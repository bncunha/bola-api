import { Module } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { PartidasController } from './partidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from 'src/models/Partida';
import { PalpitesModule } from '../palpites/palpites.module';
import { ApiFootballModule } from 'src/gateway/api-football/api-football.module';
import { CampeonatosModule } from '../campeonatos/campeonatos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partida]),
    PalpitesModule,
    CampeonatosModule,
    ApiFootballModule
  ],
  controllers: [PartidasController],
  providers: [PartidasService]
})
export class PartidasModule {}
