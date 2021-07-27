import { Campeonato } from "src/models/Campeonato";
import { ApiFootballLeagueResponse } from "../responses/ApiFootballLeagueResponse";

export class ApiFootballLeagueParse {

  parse(source: ApiFootballLeagueResponse) {
    const campeonato = new Campeonato();
    campeonato.nome = source.league.name;
    campeonato.dataInicio = new Date(source.seasons[0].start);
    campeonato.dataFim = new Date(source.seasons[0].end);
    campeonato.idApiFootball = source.league.id;
    return campeonato;
  }
}