import { HttpService } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DateUtils } from 'src/utils/date.util';
import { ApiFootballFixtureParse } from './parses/ApiFootballFixtureParse';
import { ApiFootballLeagueParse } from './parses/ApiFootballLeagueParse';
import { ApiFootballFixtureResponse } from './responses/ApiFootballFixtureResponse';
import { ApiFootballLeagueResponse } from './responses/ApiFootballLeagueResponse';
import { ApiFootballResponse } from './responses/ApiFootballResponse';

@Injectable()
export class ApiFootball {
  private endpoint = process.env.API_FUTEBOL_ENDPOINT;
  private key = process.env.API_FUTEBOL_KEY;

  constructor(private httpService: HttpService) {}

  async getCampeonatoAtivo() {
    const params = {
      country: 'Brazil',
      name: 'Serie A',
      current: true
    }
    const response = await this.httpService.get<ApiFootballResponse<ApiFootballLeagueResponse>>(this.endpoint + '/leagues', {params}).toPromise();
    const parser = new ApiFootballLeagueParse();
    return parser.parse(response.data.response);
  }

  async getPartidas(idLeague: number, temporada: number, from: Date) {
    const params = {
      league: idLeague,
      season: temporada,
      from: DateUtils.format(from, 'yyyy-MM-dd')
    }
    const response = await this.httpService.get<ApiFootballResponse<ApiFootballFixtureResponse[]>>(this.endpoint + '/fixtures', {params}).toPromise();
    const parser = new ApiFootballFixtureParse();
    return parser.parse(response.data.response);
  }
}
