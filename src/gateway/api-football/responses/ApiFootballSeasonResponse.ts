export class ApiFootballSeasonResponse {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: {
    fixtures: {
      events: boolean,
      lineups: boolean,
      statistics_fixtures: boolean,
      statistics_players: boolean
    },
    standings: boolean,
    players: boolean,
    top_scorers: boolean,
    top_assists: boolean,
    top_cards: boolean,
    injuries: boolean,
    predictions: boolean,
    odds: boolean
  }
}