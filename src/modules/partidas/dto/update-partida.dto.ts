import { PartialType } from '@nestjs/mapped-types';
import { AtualizarResultadoPartidaDto } from './atualizar-resultado-partida';

export class UpdatePartidaDto extends PartialType(AtualizarResultadoPartidaDto) {}
