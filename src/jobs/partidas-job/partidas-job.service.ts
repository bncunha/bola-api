import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { CampeonatosService } from 'src/modules/campeonatos/campeonatos.service';
import { PalpitesService } from 'src/modules/palpites/palpites.service';
import { DateUtils } from 'src/utils/date.util';

@Injectable()
export class PartidasJobService {

  constructor(private campeonatoService: CampeonatosService, private palpiteService: PalpitesService) {

  }

  @Cron('0 10 * * * *')
  // @Interval(5000)
  async atualizarPartidasEPalpites() {
    console.log('--- Iniciando Job Atualizar Partidas e Palpites ---');
    console.log('-- Atualizar Campeonato');
    await this.campeonatoService.atualizarCampeonato();

    console.log('-- Atualiar Palpites');
    await this.palpiteService.pontuarUltimosXRodadas(0);      
    console.log('--- Fim Job Atualizar Partidas e Palpites ---');
  } 
}
