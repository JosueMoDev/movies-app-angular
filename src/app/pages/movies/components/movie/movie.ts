import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import type { Movie } from "@app/interfaces/movies";
import { Button } from "primeng/button";

@Component({
  selector: "movie",
  imports: [CommonModule, Button],
  templateUrl: "./movie.html",
  styleUrl: "./movie.css",
})
export class MovieComponent {
  movie = input.required<Movie>();
}
