import { Routes } from "@angular/router";

export const movieRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./movies-list/movies-list"),
  },
];
export default movieRoutes;
