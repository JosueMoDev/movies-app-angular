import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Sidebar } from "./shared/components/sidebar/sidebar";
import { Navbar } from "./shared/components/navbar/navbar";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Sidebar, CommonModule, Navbar],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected title = "MOVIES-APP-ANGULAR";
}
