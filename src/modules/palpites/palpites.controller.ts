import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PalpitesService } from './palpites.service';
import { CreatePalpiteDto } from './dto/create-palpite.dto';
import { UpdatePalpiteDto } from './dto/update-palpite.dto';

@Controller('palpites')
export class PalpitesController {
  constructor(private readonly palpitesService: PalpitesService) {}

  @Post()
  create(@Body() createPalpiteDto: CreatePalpiteDto[], @Request() req) {
    return this.palpitesService.create(createPalpiteDto, req.user.userId);
  }

  @Post('pontuar/:idPartida')
  pontuarApostas(@Param('idPartida') idPartida: number) {
    return this.palpitesService.pontuarPalpites(idPartida);
  }

  @Get('bonus/disponibilidade/:idBolao')
  getDataLimite(@Param('idBolao') idBolao: number) {
    return this.palpitesService.isPalpiteBonusDisponivel(idBolao);
  }

  @Get(':idBolao')
  getPalpitesParticipantes(@Param('idBolao') idBolao: number) {
    return this.palpitesService.getPalpitesBonusParticipantes(idBolao);
  }
}
