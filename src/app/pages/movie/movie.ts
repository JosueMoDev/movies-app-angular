import { CommonModule } from "@angular/common";
import { Component, inject, signal, WritableSignal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MovieDetail } from "@app/interfaces/movies";
import { MovieService } from "@app/services/movie.service";
import { Button } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { Tag } from "primeng/tag";

@Component({
  selector: "app-movie",
  imports: [CommonModule, CarouselModule, Tag, Button, RouterLink],
  templateUrl: "./movie.html",
})
export default class Movie {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  movieService = inject(MovieService);
  id: number = +this.activatedRoute.snapshot.params["id"];
  movie: WritableSignal<MovieDetail | null> = signal(null);

  async ngOnInit() {
    try {
      this.movieService.findMovieById(this.id).subscribe((movie) => {
        if (movie) this.movie = signal<MovieDetail>(movie!);
        if (!movie) this.router.navigateByUrl(`/`);
      });
    } catch (err) {
      console.error("Error obteniendo la película:", err);
    }
  }
  onFavorite(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.movieService.onFavorite(id);

    const allMovies = this.movieService.allCachedMovies();
    const updatedMovie = allMovies.find((m) => m.id === id);
    if (updatedMovie) {
      this.movie.set(updatedMovie);
    }
  }
}
