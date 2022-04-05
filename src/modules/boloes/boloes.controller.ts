import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Usuario } from 'src/models/Usuario';
import { BoloesService } from './boloes.service';
import { CreateBolaoDto } from './dto/create-bolao.dto';
import { CreatePalpiteBonusDto } from './dto/create-palpite-bonus.dto';
import { ParticiparBolaoDto } from './dto/participar-bolao-dto';
import { UpdateBolaoDto } from './dto/update-bolao.dto';

@Controller('boloes')
export class BoloesController {
  constructor(private readonly boloesService: BoloesService) {}

  @Post()
  create(@Body() createBoloeDto: CreateBolaoDto, @Request() req) {
    return this.boloesService.create(createBoloeDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.boloesService.findAll();
  }

  @Get('participando')
  getByUsuario(@Request() req) {
    return this.boloesService.findByUsuario(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boloesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoloeDto: UpdateBolaoDto) {
    return this.boloesService.update(+id, updateBoloeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boloesService.remove(+id);
  }

  @Post(':id/participar')
  participarBolao(@Param('id') id: number, @Request() req, @Body() participarBolaoDto: ParticiparBolaoDto) {
    const user = req.user;
    return this.boloesService.adicionarParticipante(id, user.userId, participarBolaoDto);
  }

  @Post(':id/sair')
  sairBolao(@Param('id') id: number, @Request() req) {
    const user = req.user;
    return this.boloesService.removerParticipante(id, user.userId);
  }

  @Get(':id/ranking')
  getRanking(@Param('id') id: number,) {
    return this.boloesService.getRanking(id);
  }

  @Get('partidas-ativas/:idBolao')
  getPartidasAtivas(@Param('idBolao') idBolao: number, @Request() req) {
    try {
      return this.boloesService.getPartidasAtivas(idBolao, req.user.userId);
    } catch(err) {
      console.log(err);
      return {not: 'nll'}
    }
  }

  @Get('historico-partidas/:idBolao')
  getHistoricoPartidas(@Param('idBolao') idBolao: number) {
    return this.boloesService.getHistoricoPartidas(idBolao);
  }

  @Post('palpite-bonus/:idBolao')
  salvarPalpiteBonus(@Param('idBolao') idBolao: number, @Body() createPalpiteBonusDto: CreatePalpiteBonusDto, @Request() req) {
    return this.boloesService.salvarPalpiteBonus(idBolao, createPalpiteBonusDto, req.user.userId);
  }

  @Get('palpite-bonus/:idBolao')
  getPalpiteBonus(@Param('idBolao') idBolao: number,@Request() req) {
    return this.boloesService.getPalpiteBonus(idBolao, req.user.userId);
  }

  @Get('detalhes-partida/:idBolao/:idPartida')
  getDetalhesPartida(@Param('idBolao') idBolao: number, @Param('idPartida') idPartida) {
    return this.boloesService.getDetalhesPartida(idBolao, idPartida);
  }

}
