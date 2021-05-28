import { Module } from '@nestjs/common';
import { ParticipacoesService } from './participacoes.service';
import { ParticipacoesController } from './participacoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participacao } from 'src/models/Participacao';

@Module({
  imports: [TypeOrmModule.forFeature([Participacao])],
  controllers: [ParticipacoesController],
  providers: [ParticipacoesService],
  exports: [ParticipacoesService]
})
export class ParticipacoesModule {}
