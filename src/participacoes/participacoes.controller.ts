import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParticipacoesService } from './participacoes.service';
import { CreateParticipacoeDto } from './dto/create-participacoe.dto';
import { UpdateParticipacoeDto } from './dto/update-participacoe.dto';

@Controller('participacoes')
export class ParticipacoesController {
  constructor(private readonly participacoesService: ParticipacoesService) {}

  @Post()
  create(@Body() createParticipacoeDto: CreateParticipacoeDto) {
    return this.participacoesService.create(createParticipacoeDto);
  }

  @Get()
  findAll() {
    return this.participacoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participacoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParticipacoeDto: UpdateParticipacoeDto) {
    return this.participacoesService.update(+id, updateParticipacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participacoesService.remove(+id);
  }
}
