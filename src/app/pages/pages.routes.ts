import { Routes } from "@angular/router";

export const pagesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./movies/movies"),
  },
  {
    path: "movie/:id",
    loadComponent: () => import("./movie/movie"),
  },
  {
    path: "favorites",
    loadComponent: () => import("./favorites/favorites"),
  },
];
export default pagesRoutes;
