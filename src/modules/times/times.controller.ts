import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TimesService } from './times.service';
import { CreateTimeDto } from './dto/create-time.dto';

@Controller('times')
export class TimesController {
  constructor(private readonly timesService: TimesService) {}

  @Post()
  create(@Body() createTimeDto: CreateTimeDto) {
    return this.timesService.create(createTimeDto);
  }

  @Get()
  getTimesPorBolao() {
    return this.timesService.findAll();
  }

}
