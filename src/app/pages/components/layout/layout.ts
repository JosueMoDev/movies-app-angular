import {
  Component,
  inject,
  signal,
  effect,
  computed,
  input,
} from "@angular/core";
import { MovieService } from "@app/services/movie.service";
import { Movie } from "@app/interfaces/movies";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { DataView } from "primeng/dataview";
import { MovieComponent } from "../movie/movie";
import { Skeleton } from "../skeleton/skeleton";
import { EmptyComponent } from "../empty/empty";

@Component({
  selector: "layout",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DataView,
    MovieComponent,
    Skeleton,
    EmptyComponent,
  ],
  templateUrl: "./layout.html",
})
export class Layout {
  movieService = inject(MovieService);
  isFavoriteList = input.required<boolean>();
  movies = signal<Movie[]>([]);
  currentPage = 1;
  rows = 20;
  first = 0;
  totalRecords = signal(0);
  isLoading = true;
  constructor() {
    const storedFirst = sessionStorage.getItem("current-page");
    if (storedFirst) {
      this.first = parseInt(storedFirst, this.rows);
    }
    effect(() => {
      if (this.isFavoriteList()) {
        this.first = 0;
      }
      const all = this.isFavoriteList()
        ? this.movieService.getFavorites()
        : this.movieService.allCachedMovies();
      this.movies.set(all);
      this.totalRecords.set(all.length);
    });
  }

  onPageChange(event: any) {
    const { first, rows } = event;
    this.first = first;
    sessionStorage.setItem("current-page", this.first.toString());
    this.currentPage = Math.floor(first / rows) + 1;
    this.movieService.getMoviesByPage(this.currentPage).subscribe();
  }

  counterArray(n: number): any[] {
    return Array(n);
  }
}
