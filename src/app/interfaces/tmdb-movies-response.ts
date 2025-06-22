import { Person } from "./movie-details";
import { Movie } from "./movies";

export interface TMDBMoviesResponse {
  dates: Dates;
  page: number;
  results: MovieResult[];
  total_pages: number;
  total_results: number;
}

export interface Dates {
  maximum: Date;
  minimum: Date;
}

export interface MovieResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: OriginalLanguage;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface FetchMovie extends MovieResult {
  genres?: Genre[];
  runtime?: number;
  budget?: number;
  cast?: FetchPerson[];
  related?: FetchMovie[];
}

export interface FetchPerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}
interface Genre {
  id: number;
  name: string;
}
export enum OriginalLanguage {
  CN = "cn",
  En = "en",
  Hi = "hi",
  Zh = "zh",
}
