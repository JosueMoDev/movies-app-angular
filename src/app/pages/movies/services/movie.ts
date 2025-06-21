import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MovieService {
  constructor() {}
  getAllMovies() {
    return [
      {
        title: "Final Destination Bloodlines",
        posterUrl: "/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg",
        rating: 7.214,
        releaseDate: "2025-05-14",
      },
      {
        title: "Lilo & Stitch",
        posterUrl: "/c32TsWLES7kL1uy6fF03V67AIYX.jpg",
        rating: 7.1,
        releaseDate: "2025-05-17",
      },
      {
        title: "STRAW",
        posterUrl: "/t3cmnXYtxJb9vVL1ThvT2CWSe1n.jpg",
        rating: 8.051,
        releaseDate: "2025-06-05",
      },
      {
        title: "The Amateur",
        posterUrl: "/SNEoUInCa5fAgwuEBMIMBGvkkh.jpg",
        rating: 6.929,
        releaseDate: "2025-04-09",
      },
      {
        title: "How to Train Your Dragon",
        posterUrl: "/q5pXRYTycaeW6dEgsCrd4mYPmxM.jpg",
        rating: 8.03,
        releaseDate: "2025-06-06",
      },
      {
        title: "Candle in the Tomb: The Worm Valley",
        posterUrl: "/7Hk1qxAvZi9H9cfBb4iHkoGjapH.jpg",
        rating: 8.0,
        releaseDate: "2023-09-22",
      },
      {
        title: "Crazy Lizard",
        posterUrl: "/9TFaFsSXedaALXTzba349euDeoY.jpg",
        rating: 0.0,
        releaseDate: "2024-03-27",
      },
      {
        title: "Predator: Killer of Killers",
        posterUrl: "/2XDQa6EmFHSA37j1t0w88vpWqj9.jpg",
        rating: 7.994,
        releaseDate: "2025-06-05",
      },
      {
        title: "Hunt the Wicked",
        posterUrl: "/m5UBHbEjQJx3AkRZWRY6A4l4ZDT.jpg",
        rating: 5.571,
        releaseDate: "2024-02-12",
      },
      {
        title: "Deep Cover",
        posterUrl: "/euM8fJvfH28xhjGy25LiygxfkWc.jpg",
        rating: 6.74,
        releaseDate: "2025-06-12",
      },
    ];
  }
}
