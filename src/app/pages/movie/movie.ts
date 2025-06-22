import { CommonModule } from "@angular/common";
import { Component, inject, signal, WritableSignal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MovieDetail } from "@app/interfaces/movies";
import { MovieService } from "@app/services/movie.service";
import { Button } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { TagModule } from "primeng/tag";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-movie",
  imports: [CommonModule, CarouselModule, TagModule, Button, RouterLink],
  templateUrl: "./movie.html",
  styleUrl: "./movie.css",
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
        console.log(movie);
        if (!movie) this.router.navigateByUrl(`/`);
        if (movie) this.movie = signal<MovieDetail>(movie!);
      });
    } catch (err) {
      console.error("Error obteniendo la película:", err);
    }
  }
}
