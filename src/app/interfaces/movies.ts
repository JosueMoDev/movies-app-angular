import { Person } from "./movie-details";
export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: Date;
  rating: number;
  poster: string;
  backdrop: string;
  isFavorite: boolean;
  hasDetails: boolean;
}

export interface MovieDetail extends Movie {
  genres?: { id: number; name: string }[];
  duration?: number;
  budget?: number;
  cast?: Person[];
  related?: Movie[];
  votage?: number;
}
