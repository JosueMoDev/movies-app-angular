import { Component, inject, signal, effect, computed } from "@angular/core";
import { MovieService } from "@app/services/movie.service";
import { Movie } from "@app/interfaces/movies";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { DataView } from "primeng/dataview";
import { MovieComponent } from "../movie/movie";
import { Skeleton } from "../skeleton/skeleton";

@Component({
  selector: "layout",
  standalone: true,
  imports: [CommonModule, ButtonModule, DataView, MovieComponent, Skeleton],
  templateUrl: "./layout.html",
  styleUrl: "./layout.css",
})
export class Layout {
  movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  currentPage = 1;
  rows = 20;
  totalRecords = signal(0);

  constructor() {
    effect(() => {
      const all = this.movieService.allCachedMovies();
      this.movies.set(all);
      this.totalRecords.set(all.length);
    });
  }

  onPageChange(event: any) {
    const { first, rows } = event;
    this.currentPage = Math.floor(first / rows) + 1;
    this.movieService.getMoviesByPage(this.currentPage).subscribe();
  }

  counterArray(n: number): any[] {
    return Array(n);
  }
}
