import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MovieService } from "@app/services/movie.service";
import { Button } from "primeng/button";

@Component({
  selector: "navbar-component",
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: "./navbar.html",
})
export class Navbar {
  movieService = inject(MovieService);
  private readonly validQueryRegex = /^[a-z0-9\s?]+$/i;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  public queryError = false;
  public query = "";

  onSearch(query: string, event: Event) {
    const isEnter = (event as KeyboardEvent).key === "Enter";
    const sanitized = query.trim().toLowerCase();
    this.query = sanitized;

    if (sanitized === "") {
      this.queryError = false;
      this.clearDebounce();
      return;
    }

    if (!this.validQueryRegex.test(sanitized)) {
      this.queryError = true;
      this.clearDebounce();
      return;
    }

    this.queryError = false;

    if (isEnter) {
      this.clearDebounce();
      this.movieService.searchMovie(this.query);
    } else {
      this.clearDebounce();
      this.debounceTimer = setTimeout(() => {
        if (this.query === "") return;
        this.movieService.searchMovie(this.query);
      }, 2000);
    }
  }

  clearSearch(input: HTMLInputElement) {
    input.value = "";
    this.query = "";
    this.queryError = false;
    this.clearDebounce();
    this.movieService.clearSearchResults();
  }

  private clearDebounce() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
      this.movieService.clearSearchResults();
    }
  }
}
