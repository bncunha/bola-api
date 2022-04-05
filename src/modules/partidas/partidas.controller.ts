import { Controller, Body, Patch, Get, Query, Request } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { AtualizarResultadoPartidaDto } from './dto/atualizar-resultado-partida';
import { ApiResponse } from 'src/models/ApiResponse';
import { GetPartidasFilter } from './dto/get-partidas-filter.dto';

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

  @Get('lives/has-any')
  async possuiAlgumaPartidaAovivo(@Request() req) {
    try {
      return this.partidasService.possuiPartidaAoVivo(req.user.userId);
    } catch(err) {
      console.log('Erro ao verificar se possui partidas ativas!');
      return new ApiResponse('Erro ao verificar se possui partidas ativas!', null);
    }
  }

  @Get('')
  async getPartidasByUsuario(@Request() req, @Query() filtros: GetPartidasFilter) {
    try {
      return this.partidasService.getPartidasByUsuarioAndFilters(req.user.userId, filtros);
    } catch(err) {
      console.log('Erro ao verificar se possui partidas ativas!');
      return new ApiResponse('Erro ao verificar se possui partidas ativas!', null);
    }
  }
}
