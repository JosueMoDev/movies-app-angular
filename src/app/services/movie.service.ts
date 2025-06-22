import { HttpClient } from "@angular/common/http";
import {
  inject,
  Injectable,
  signal,
  WritableSignal,
  computed,
} from "@angular/core";
import { Observable, of, forkJoin } from "rxjs";
import { tap, map } from "rxjs/operators";
import { devEnv } from "@env/env.dev";
import { TMDBMoviesResponse } from "@app/interfaces/tmdb-movies-response";
import { Movie } from "@app/interfaces/movies";
import { MovieModel } from "@app/models/movie";

@Injectable({ providedIn: "root" })
export class MovieService {
  private http = inject(HttpClient);
  private cacheSignal: WritableSignal<Map<number, Movie[]>> = signal(new Map());
  readonly allCachedMovies = computed(() => {
    const map = this.cacheSignal();
    const all: Movie[] = [];
    const sortedKeys = Array.from(map.keys()).sort((a, b) => a - b);
    for (const key of sortedKeys) {
      all.push(...(map.get(key) ?? []));
    }
    return all;
  });
  private hasPrefetched = false;
  constructor() {
    this.prefetchPagesNextPages(5, 1).subscribe(() => {
      this.hasPrefetched = true;
    });
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

  getMoviesByPage(page: number): Observable<Movie[]> {
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
          if (!nowCached)
            throw new Error(
              `Página ${page} no encontrada después del prefetch`
            );
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

  getCache(): WritableSignal<Map<number, Movie[]>> {
    return this.cacheSignal;
  }
}
