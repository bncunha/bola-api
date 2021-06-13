import { Module } from '@nestjs/common';
import { BoloesService } from './boloes.service';
import { BoloesController } from './boloes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bolao } from 'src/models/Bolao';
import { ParticipacoesModule } from 'src/participacoes/participacoes.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { Partida } from 'src/models/Partida';
import { Palpite } from 'src/models/Palpite';
import { CampeonatosModule } from '../campeonatos/campeonatos.module';
import { TimesModule } from '../times/times.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bolao, Partida, Palpite]),
    ParticipacoesModule,
    UsuariosModule,
    CampeonatosModule,
    TimesModule
  ],
  controllers: [BoloesController],
  providers: [BoloesService],
  exports: [BoloesService]
})
export class BoloesModule {}
