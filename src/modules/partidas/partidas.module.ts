import { Module } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { PartidasController } from './partidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from 'src/models/Partida';
import { PalpitesModule } from '../palpites/palpites.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partida]),
    PalpitesModule
  ],
  controllers: [PartidasController],
  providers: [PartidasService]
})
export class PartidasModule {}
