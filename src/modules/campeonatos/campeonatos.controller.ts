import { Controller, Post, Body, Get, Param, Request, Query } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';
import { CriarCampeonatoDto } from './dto/criar-campeonato.dto';

@Controller('campeonatos')
export class CampeonatosController {
  constructor(private readonly campeonatosService: CampeonatosService) {}

  @Post('cadastrar-completo')
  iniciarPartida(@Body() iniciarPartidaDto: CriarCampeonatoDto) {
    return this.campeonatosService.criarCampeonatoCompleto(iniciarPartidaDto);
  }

  // @Get('atualizar')
  // atualizarCampeonatos() {
  //   return this.campeonatosService.atualizarCampeonato();
  // }

  @Get('source/ativos/:pais')
  getCampeonatosAtivos(@Param('pais') pais: string) {
    return this.campeonatosService.getCampeonatosAtivosPorPais(pais);
  }
}
