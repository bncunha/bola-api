import { ApiFootballCountryResponse } from "./ApiFootballCountryResponse";
import { ApiFootballSeasonResponse } from "./ApiFootballSeasonResponse";

export class ApiFootballLeagueResponse {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  }
  country: ApiFootballCountryResponse;
  seasons: ApiFootballSeasonResponse[];
}