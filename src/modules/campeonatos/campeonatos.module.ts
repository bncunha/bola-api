import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from 'src/models/Partida';
import { Campeonato } from 'src/models/Campeonato';
import { CampeonatosService } from './campeonatos.service';
import { CampeonatosController } from './campeonatos.controller';
import { Time } from 'src/models/Time';

@Module({
  imports: [TypeOrmModule.forFeature([Partida, Campeonato, Time])],
  controllers: [CampeonatosController],
  providers: [CampeonatosService],
  exports: [CampeonatosService]
})
export class CampeonatosModule {}
