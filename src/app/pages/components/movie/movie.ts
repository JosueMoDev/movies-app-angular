import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import type { MovieDetail } from "@app/interfaces/movies";
import { MovieService } from "@app/services/movie.service";
import { Button } from "primeng/button";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "movie",
  imports: [CommonModule, Button],
  templateUrl: "./movie.html",
})
export class MovieComponent {
  movieService = inject(MovieService);
  movie = input.required<MovieDetail>();
  router = inject(Router);

  onFavorite(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.movieService.onFavorite(id);
  }

  async movieDetails(id: number) {
    try {
      const movie = await firstValueFrom(this.movieService.findMovieById(id));
      if (!movie) return;
      this.router.navigateByUrl(`/movie/${id}`);
    } catch (err) {
      console.error("Error obteniendo la película:", err);
    }
  }
}
