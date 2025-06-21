import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DataView } from "primeng/dataview";
import { Movie } from "../movie/movie";
import { Skeleton } from "../skeleton/skeleton";
import { MovieService } from "../../services/movie";

@Component({
  selector: "layout",
  imports: [DataView, ButtonModule, CommonModule, Movie, Skeleton],
  templateUrl: "./layout.html",
  styleUrl: "./layout.css",
})
export class Layout {
  movieService: MovieService = inject(MovieService);
  movies = signal<any>([]);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const movies = this.movieService.getAllMovies();
    this.movies.set(movies);
  }
  first = 0;
  rows = 18;
  totalRecords = 0;

  onPageChange(event: any) {
    this.first = event.first;
  }

  counterArray(n: number): any[] {
    return Array(n);
  }
}
