import { HttpClient } from "@angular/common/http";
import {
  inject,
  Injectable,
  signal,
  WritableSignal,
  computed,
} from "@angular/core";
import { Observable, of, forkJoin, lastValueFrom } from "rxjs";
import { tap, map } from "rxjs/operators";
import { devEnv } from "@env/env.dev";
import {
  FetchPerson,
  MovieResult,
  TMDBMoviesResponse,
} from "@app/interfaces/tmdb-movies-response";
import { MovieDetail } from "@app/interfaces/movies";
import { MovieModel } from "@app/models/movie";

@Injectable({ providedIn: "root" })
export class MovieService {
  private http = inject(HttpClient);

  private cacheSignal: WritableSignal<Map<number, MovieDetail[]>> = signal(
    new Map()
  );
  private favoritesSignal: WritableSignal<MovieDetail[]> = signal([]);
  private searchResultsSignal: WritableSignal<MovieDetail[]> = signal([]);
  private isSearchingSignal: WritableSignal<boolean> = signal(false);
  private hasSearchResultsSignal: WritableSignal<boolean> = signal(false);
  private searchHistorySignal: WritableSignal<string[]> = signal([]);
  private searchCacheSignal: WritableSignal<Map<string, MovieDetail[]>> =
    signal(new Map());

  readonly visibleMovies = computed(() => {
    if (
      this.hasSearchResultsSignal() &&
      this.searchResultsSignal().length > 0
    ) {
      return this.searchResultsSignal();
    }
    return this.allCachedMovies();
  });

  readonly allCachedMovies = computed(() => {
    if (this.hasSearchResults) {
      return this.searchResultsSignal();
    }
    const map = this.cacheSignal();
    const all: MovieDetail[] = [];
    const sortedKeys = Array.from(map.keys()).sort((a, b) => a - b);
    for (const key of sortedKeys) {
      all.push(...(map.get(key) ?? []));
    }
    return all;
  });

  constructor() {
    this.prefetchPagesNextPages(5, 1).subscribe();
  }

  private prefetchPagesNextPages(
    count: number,
    fromPage = 1
  ): Observable<void> {
    const requests = Array.from({ length: count }, (_, i) => fromPage + i).map(
      (page) =>
        this.http
          .get<TMDBMoviesResponse>(`${devEnv.apiUrl}/movie/popular`, {
            params: { page: page.toString() },
          })
          .pipe(
            tap((response) => {
              const movies = response.results.map((m) =>
                MovieModel.fromTheMovieDBToMovie(m)
              );

              this.cacheSignal.update((cache) => {
                const newCache = new Map(cache);
                newCache.set(page, movies);
                return newCache;
              });
            })
          )
    );

    return forkJoin(requests).pipe(map(() => void 0));
  }

  getMoviesByPage(page: number): Observable<MovieDetail[]> {
    const cached = this.cacheSignal().get(page + 1);
    if (cached) {
      return of(cached);
    }

    const cachedPages = Array.from(this.cacheSignal().keys());
    const lastCachedPage =
      cachedPages.length > 0 ? Math.max(...cachedPages) : 0;

    if (page === lastCachedPage) {
      return this.prefetchPagesNextPages(page, page + 1).pipe(
        map(() => {
          const nowCached = this.cacheSignal().get(page);
          if (!nowCached) {
            throw new Error(
              `Página ${page} no encontrada después del prefetch`
            );
          }
          return nowCached;
        })
      );
    }

    return this.http
      .get<TMDBMoviesResponse>(`${devEnv.apiUrl}/movie/popular`, {
        params: { page: page.toString() },
      })
      .pipe(
        tap((response) => {
          const movies = response.results.map((m) =>
            MovieModel.fromTheMovieDBToMovie(m)
          );

          this.cacheSignal.update((cache) => {
            const newCache = new Map(cache);
            newCache.set(page, movies);
            return newCache;
          });
        }),
        map((response) =>
          response.results.map((m) => MovieModel.fromTheMovieDBToMovie(m))
        )
      );
  }

  onFavorite(id: number) {
    let updatedMovie: MovieDetail | null = null;

    this.cacheSignal.update((cache) => {
      const newCache = new Map<number, MovieDetail[]>();

      for (const [page, movies] of cache.entries()) {
        const updatedMovies = movies.map((movie) => {
          if (movie.id === id) {
            const newMovie = { ...movie, isFavorite: !movie.isFavorite };
            updatedMovie = newMovie;
            return newMovie;
          }
          return movie;
        });

        newCache.set(page, updatedMovies);
      }

      return newCache;
    });

    if (updatedMovie) {
      this.favoritesSignal.update((favorites) => {
        const exists = favorites.some((m) => m.id === updatedMovie!.id);

        if (updatedMovie!.isFavorite && !exists) {
          return [...favorites, updatedMovie!];
        }

        if (!updatedMovie!.isFavorite && exists) {
          return favorites.filter((m) => m.id !== updatedMovie!.id);
        }

        return favorites;
      });
    }
  }

  getFavorites(): MovieDetail[] {
    return this.favoritesSignal();
  }

  async searchMovie(query: string): Promise<void> {
    this.isSearchingSignal.set(true);

    const cachedResult = this.searchCacheSignal().get(query);
    if (cachedResult && cachedResult.length > 0) {
      this.searchResultsSignal.set(cachedResult);
      this.hasSearchResultsSignal.set(cachedResult.length > 0);
      this.isSearchingSignal.set(false);
      return;
    }

    try {
      const response = await lastValueFrom(
        this.http
          .get<TMDBMoviesResponse>(`${devEnv.apiUrl}/search/movie`, {
            params: { query: query },
          })
          .pipe(
            map((res) =>
              res.results.filter(
                (m) =>
                  !!m.release_date &&
                  !isNaN(new Date(m.release_date).getTime()) &&
                  !!m.poster_path
              )
            )
          )
      );
      const movies = response.map((m) => MovieModel.fromTheMovieDBToMovie(m));

      this.searchCacheSignal.update((prevCache) => {
        const newCache = new Map(prevCache);
        newCache.set(query, movies);
        return newCache;
      });

      this.searchResultsSignal.set(movies);
      this.hasSearchResultsSignal.set(movies.length > 0);
    } catch (error) {
      this.isSearchingSignal.set(false);
      console.error("Error en la búsqueda:", error);
    } finally {
      this.isSearchingSignal.set(false);
    }
  }

  clearSearchResults() {
    this.searchResultsSignal.set([]);
    this.isSearchingSignal.set(false);
    this.hasSearchResultsSignal.set(false);
    this.searchCacheSignal.set(new Map());
  }

  findMovieById(id: number): Observable<MovieDetail | undefined> {
    const currentCache = this.cacheSignal();
    const newCache = new Map(currentCache);

    for (const [page, movies] of newCache.entries()) {
      const index = movies.findIndex((m) => m.id === id);

      if (index !== -1) {
        const movie = movies[index];

        if (movie.hasDetails) {
          return of(movie);
        }

        const credits$ = this.http
          .get<{ cast: FetchPerson[] }>(`${devEnv.apiUrl}/movie/${id}/credits`)
          .pipe(map((res) => res.cast.filter((p) => !!p.profile_path)));

        const similar$ = this.http
          .get<{ results: MovieResult[] }>(
            `${devEnv.apiUrl}/movie/${id}/similar`
          )
          .pipe(
            map((res) =>
              res.results.filter(
                (m) =>
                  !!m.release_date &&
                  !isNaN(new Date(m.release_date).getTime()) &&
                  !!m.poster_path
              )
            )
          );

        return forkJoin({ credits: credits$, similar: similar$ }).pipe(
          map(({ credits, similar }) => {
            const updatedMovie: MovieDetail = {
              ...movie,
              cast: credits.map(MovieModel.fromTheMovieDBPersonToCast),
              related: similar.map(MovieModel.fromTheMovieDBToMovieRelated),
              hasDetails: true,
              isFavorite: movie.isFavorite,
            };

            const updatedMovies = [...movies];
            updatedMovies[index] = updatedMovie;
            newCache.set(page, updatedMovies);
            this.cacheSignal.set(newCache);

            return updatedMovie;
          })
        );
      }
    }

    return of(undefined);
  }

  get isSearching(): boolean {
    return this.isSearchingSignal();
  }

  get hasSearchResults(): boolean {
    return this.hasSearchResultsSignal();
  }

  get searchResults(): MovieDetail[] {
    return this.searchResultsSignal();
  }

  get searchHistory(): string[] {
    return this.searchHistorySignal();
  }
}
