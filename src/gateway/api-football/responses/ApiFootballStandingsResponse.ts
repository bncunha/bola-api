export class ApiFootballStandingsResponse {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
    standings: {
      rank: number;
      team: {
          id: number;
          name: string;
          logo: string;
      }
    }[][];
  }
}