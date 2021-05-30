import { Controller, Body, Patch } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { AtualizarResultadoPartidaDto } from './dto/atualizar-resultado-partida';

@Controller('partidas')
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  @Patch('salvar-resultado')
  atualizarResultado(@Body() atualizarResultadoDto: AtualizarResultadoPartidaDto[]) {
    return this.partidasService.atualizarResultado(atualizarResultadoDto);
  }
}
