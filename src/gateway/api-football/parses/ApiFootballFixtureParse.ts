import { Campeonato } from "src/models/Campeonato";
import { Partida } from "src/models/Partida";
import { Time } from "src/models/Time";
import { ApiFootballFixtureResponse } from "../responses/ApiFootballFixtureResponse";

export class ApiFootballFixtureParse {

  parse(source: ApiFootballFixtureResponse[]) {
    const partidas: Partida[] = []
    for (let s of source) {
      const partida = new Partida();
      const mandante = new Time();
      const visitante = new Time();
      mandante.nome = s.teams.home.name;
      mandante.logomarca = s.teams.home.logo;
      visitante.nome = s.teams.away.name;
      visitante.logomarca = s.teams.away.logo;

      partida.data = s.fixture.date;
      partida.mandante = mandante;
      partida.visitante = visitante;
      partida.isFinalizado = s.fixture.status.short == 'FT';
      partida.rodada = Number(s.league.round.split('-')[1].trim());
      partida.estadio = s.fixture.venue.name;
      partida.resultadoMandante = s.goals.home;
      partida.resultadoVisitante = s.goals.away;
      partidas.push(partida);
    }
    return partidas;
  }
}