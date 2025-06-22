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

  // Signal que representa el cache de páginas
  private cacheSignal: WritableSignal<Map<number, Movie[]>> = signal(new Map());

  // Signal computada: arreglo plano de todas las películas cacheadas
  readonly allCachedMovies = computed(() => {
    const map = this.cacheSignal();
    const all: Movie[] = [];
    for (const movies of map.values()) {
      all.push(...movies);
    }
    return all;
  });

  private hasPrefetched = false;

  constructor() {
    this.prefetchInitialPages(5);
  }

  private prefetchInitialPages(count: number) {
    if (this.hasPrefetched) return;

    const requests = Array.from({ length: count }, (_, i) => i + 1).map(
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
                const newCache = new Map(cache); // ❗ Importante: nueva referencia
                newCache.set(page, movies);
                return newCache;
              });
            })
          )
    );

    forkJoin(requests).subscribe(() => {
      this.hasPrefetched = true;
      console.log("✅ Prefetch de las primeras 5 páginas listo");
    });
  }

  getMoviesByPage(page: number): Observable<Movie[]> {
    const cached = this.cacheSignal().get(page + 1);
    if (cached) {
      return of(cached);
    }

    return this.http
      .get<TMDBMoviesResponse>(`${devEnv.apiUrl}/movie/popular`, {
        params: { page: page.toString() + 1 },
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
