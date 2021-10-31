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
      mandante.nome = ApiFootballFixtureParse.parseName(s.teams.home.name);
      mandante.logomarca = s.teams.home.logo;
      visitante.nome = ApiFootballFixtureParse.parseName(s.teams.away.name);
      visitante.logomarca = s.teams.away.logo;

      partida.data = s.fixture.date;
      partida.mandante = mandante;
      partida.visitante = visitante;
      partida.isFinalizado = s.fixture.status.short == 'FT';
      partida.status = ApiFootballFixtureParse.parseStatus(s.fixture.status.short);
      partida.tempoDecorrido = s.fixture.status.elapsed;
      partida.rodada = Number(s.league.round.split('-')[1].trim());
      partida.estadio = s.fixture.venue.name;
      partida.resultadoMandante = s.goals.home;
      partida.resultadoVisitante = s.goals.away;
      partidas.push(partida);
    }
    return partidas;
  }

  static parseName(nome: string) {
    switch(nome) {
      case 'Atletico Goianiense': return 'Atlético-GO';
      case 'Sao Paulo': return 'São Paulo';
      case 'Fortaleza EC': return 'Fortaleza';
      case 'Atletico-MG': return 'Atlético-MG';
      case 'Sport Recife': return 'Sport';
      case 'Ceara': return 'Ceará';
      case 'Gremio': return 'Grêmio';
      case 'Atletico Paranaense': return 'Athletico-PR';
      case 'America Mineiro': return 'América-MG';
      case 'Chapecoense-sc': return 'Chapecoense';
      case 'RB Bragantino': return 'Bragantino';
      case 'Cuiaba': return 'Cuiabá Esporte';
      default: return nome;
    }
  }

  static parseStatus(status: string) {
    switch(status) {
      case 'TBD': return 'Data a ser definidia';
      case 'NS': return 'Não iniciado';
      case '1H': return '1º tempo';
      case 'HT': return 'Intervalo';
      case '2H': return '2º tempo';
      case 'ET': return 'Prorrogação';
      case 'P': return 'Penalts';
      case 'FT': return 'Finalizado';
      case 'AET': return 'Finalizado com prorrogação';
      case 'PEN': return 'Finalizado com penalts';
      case 'SUSP': return 'Suspenso';
      case 'INT': return 'Interrompido';
      case 'PST': return 'Adiado';
      case 'CANC': return 'Cancelado';
      default: return status;
    }
  }
}