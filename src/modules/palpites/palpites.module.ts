import { Module } from '@nestjs/common';
import { PalpitesService } from './palpites.service';
import { PalpitesController } from './palpites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Palpite } from 'src/models/Palpite';
import { Partida } from 'src/models/Partida';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { BoloesModule } from '../boloes/boloes.module';
import { ParticipacoesModule } from 'src/participacoes/participacoes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Palpite, Partida]), UsuariosModule, BoloesModule, ParticipacoesModule],
  controllers: [PalpitesController],
  providers: [PalpitesService],
  exports: [PalpitesService]
})
export class PalpitesModule {}
