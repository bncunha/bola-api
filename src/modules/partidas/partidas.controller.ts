import { Controller, Body, Patch, Get, Query, Request } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { AtualizarResultadoPartidaDto } from './dto/atualizar-resultado-partida';
import { ApiResponse } from 'src/models/ApiResponse';

@Controller('partidas')
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  @Patch('salvar-resultado')
  atualizarResultado(@Body() atualizarResultadoDto: AtualizarResultadoPartidaDto[]) {
    return this.partidasService.atualizarResultado(atualizarResultadoDto);
  }

  @Get('lives')
  buscarPartidasAoVivo(@Query('campeonato') campeonato: number, @Request() req) {
    try {
      return this.partidasService.buscarAoVivo(req.user.userId, campeonato);
    } catch(err) {
      console.log('Erro ao buscar partidas ativas!');
      return new ApiResponse('Erro ao buscar partidas ativas!', null);
    }
  }
}
