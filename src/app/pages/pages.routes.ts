import { Routes } from "@angular/router";

export const pagesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./movies/movies-list/movies-list"),
  },
  {
    path: "movie/:id",
    loadComponent: () => import("./movie/movie"),
  },
];
export default pagesRoutes;
