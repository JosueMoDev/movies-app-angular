import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { Button } from "primeng/button";

@Component({
  selector: "movie",
  imports: [CommonModule, Button],
  templateUrl: "./movie.html",
  styleUrl: "./movie.css",
})
export class Movie {
  movie: any = input<any>(undefined);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.movie());
  }
}
