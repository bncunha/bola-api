import { HttpService } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DateUtils } from 'src/utils/date.util';
import { ApiFootballClassificacaoParse } from './parses/ApiFootballClassificacaoParse';
import { ApiFootballFixtureParse } from './parses/ApiFootballFixtureParse';
import { ApiFootballLeagueParse } from './parses/ApiFootballLeagueParse';
import { ApiFootballFixtureResponse } from './responses/ApiFootballFixtureResponse';
import { ApiFootballLeagueResponse } from './responses/ApiFootballLeagueResponse';
import { ApiFootballResponse } from './responses/ApiFootballResponse';
import { ApiFootballStandingsResponse } from './responses/ApiFootballStandingsResponse';

@Injectable()
export class ApiFootball {
  private endpoint = process.env.API_FUTEBOL_ENDPOINT;
  private headers = {
    'x-rapidapi-key': process.env.API_FUTEBOL_KEY
  }

  constructor(private httpService: HttpService) {}

  async getCampeonatoById(id: number) {
    const params = {
      id
    }
    const response = await this.httpService.get<ApiFootballResponse<ApiFootballLeagueResponse>>(this.endpoint + '/leagues', {params, headers: this.headers}).toPromise();
    const parser = new ApiFootballLeagueParse();
    return response.data.response.map(r => parser.parse(r));
  }

  async getCampeonatoAtivoByCountryAndSeason(country: string, season: number) {
    const params = {
      country,
      season,
    }
    const response = await this.httpService.get<ApiFootballResponse<ApiFootballLeagueResponse>>(this.endpoint + '/leagues', {params, headers: this.headers}).toPromise();
    const parser = new ApiFootballLeagueParse();
    return response.data.response.map(r => parser.parse(r));
  }

  async getClassificacao(idLeague: number, temporada: number) {
    const params = {
      league: idLeague,
      season: temporada,
    };
    const response = await this.httpService.get<ApiFootballResponse<ApiFootballStandingsResponse>>(this.endpoint + 'standings', {params, headers: this.headers}).toPromise()
    const parser = new ApiFootballClassificacaoParse();
    return parser.parse(response.data.response[0])

  }

  async getPartidas(idLeague: number, temporada: number, live?: boolean, from?: Date) {
    const params = {
      league: idLeague,
      season: temporada,
      live: live ? 'all' : null,
      from: from ? DateUtils.format(from, 'yyyy-MM-dd') : null
    }
    const response = await this.httpService.get<ApiFootballResponse<ApiFootballFixtureResponse[]>>(this.endpoint + 'fixtures', {params, headers: this.headers}).toPromise();
    const parser = new ApiFootballFixtureParse();
    return parser.parse(response.data.response as any);
  }

}
