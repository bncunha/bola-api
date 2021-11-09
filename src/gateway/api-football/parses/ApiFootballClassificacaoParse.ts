import { Campeonato } from "src/models/Campeonato";
import { Classificacao } from "src/models/Classificacao";
import { ApiFootballLeagueResponse } from "../responses/ApiFootballLeagueResponse";
import { ApiFootballStandingsResponse } from "../responses/ApiFootballStandingsResponse";
import { ApiFootballFixtureParse } from "./ApiFootballFixtureParse";

export class ApiFootballClassificacaoParse {

  parse(source: ApiFootballStandingsResponse) {
    const classificacoes = source.league.standings[0].map(s => {
      const classi = new Classificacao();
      classi.rank = s.rank;
      classi.nomeTime = ApiFootballFixtureParse.parseName(s.team.name);
      return classi;
    });
    classificacoes.sort((a, b) => a.rank - b.rank);
    return classificacoes;
  }

}