import { Campeonato } from "src/models/Campeonato";
import { ApiFootballLeagueResponse } from "../responses/ApiFootballLeagueResponse";

export class ApiFootballLeagueParse {

  parse(source: ApiFootballLeagueResponse) {
    const last = source.seasons.length - 1;
    const campeonato = new Campeonato();
    campeonato.nome = source.league.name;
    campeonato.dataInicio = new Date(source.seasons[last].start);
    campeonato.dataFim = new Date(source.seasons[last].end);
    campeonato.idApiFootball = source.league.id;
    campeonato.ano = source.seasons[last].year;
    campeonato.imagem = source.league.logo;
    return campeonato;
  }

}