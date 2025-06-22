import { Person } from "@app/interfaces/movie-details";
import { Movie, MovieDetail } from "@app/interfaces/movies";
import {
  FetchPerson,
  FetchMovie,
  MovieResult,
} from "@app/interfaces/tmdb-movies-response";
export enum Gender {
  Unknown = 0,
  Female = 1,
  Male = 2,
}
export class MovieModel {
  static fromTheMovieDBToMovie = (movie: FetchMovie): MovieDetail => {
    return {
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      releaseDate: new Date(movie.release_date),
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
      rating: movie.vote_average,
      isFavorite: false,
      hasDetails: false,
      genres: movie.genres ?? [],
      budget: movie.budget ?? 0,
      duration: movie.runtime ?? 0,
      cast: movie.cast?.map(MovieModel.fromTheMovieDBPersonToCast),
      related: movie.related?.map(MovieModel.fromTheMovieDBToMovieRelated),
    };
  };

  static fromTheMovieDBPersonToCast = (person: FetchPerson): Person => {
    return {
      id: person.id,
      name: person.name,
      character: person.character,
      avatar: person.profile_path,
      gender: Gender[person.gender],
    };
  };

  static fromTheMovieDBToMovieRelated = (movie: MovieResult): Movie => {
    return {
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      releaseDate: new Date(movie.release_date),
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
      rating: movie.vote_average,
      isFavorite: false,
      hasDetails: false,
    };
  };
}
