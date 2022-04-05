import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { CampeonatosService } from 'src/modules/campeonatos/campeonatos.service';
import { PalpitesService } from 'src/modules/palpites/palpites.service';
import { DateUtils } from 'src/utils/date.util';

@Injectable()
export class PartidasJobService {

  constructor(private campeonatoService: CampeonatosService, private palpiteService: PalpitesService) {

  }

  @Cron('0 10 0 * * *')
  async atualizarPartidas() {
    console.log('--- Iniciando Job Atualizar Partidas ---');
    await this.campeonatoService.atualizarLoteCampeonatos();
    console.log('--- Fim Job Atualizar Partidas ---');
  } 

  @Cron('0 10 * * * *')
  async pontuarPalpites() {
    console.log('--- Iniciando Job Atualizar Palpites ---');
    await this.palpiteService.pontuarUltimosXRodadas(0);  
    console.log('--- Fim Job Atualizar Palpites ---');
  }

  @Cron('0 15 * * * *')
  async pontuarPalpiteBonus() {
    console.log('--- Iniciando Job Pontuar Palpites Bônus ---');
    await this.palpiteService.pontuarPalpiteBonus();  
    console.log('--- Fim Job Pontuar Palpites Bônus ---');
  }

}
