import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { CampeonatosService } from './campeonatos.service';
import { CriarCampeonatoDto } from './dto/criar-campeonato.dto';

@Controller('campeonatos')
export class CampeonatosController {
  constructor(private readonly campeonatosService: CampeonatosService) {}

  @Post('cadastrar-completo')
  iniciarPartida(@Body() iniciarPartidaDto: CriarCampeonatoDto) {
    return this.campeonatosService.criarCampeonatoCompleto(iniciarPartidaDto);
  }

  @Get('atualizar')
  atualizarCampeonatos() {
    return this.campeonatosService.atualizarCampeonato();
  }
}
