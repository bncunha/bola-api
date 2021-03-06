import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Time } from 'src/models/Time';
import { Repository } from 'typeorm';
import { BoloesService } from '../boloes/boloes.service';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';

@Injectable()
export class TimesService {

  constructor(
    @InjectRepository(Time) private timeRepository: Repository<Time>,
  ) {}

  async create(createTimeDto: CreateTimeDto) {
    for (let time of createTimeDto.times) {
      if (!(await this.timeRepository.find({nome: time})).length) {
        const novoTime = this.timeRepository.create();
        novoTime.nome = time;
        await this.timeRepository.save(novoTime);
      }
    }
    return 'criados';
  }

  findAll() {
    return this.timeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} time`;
  }

  findByIds(ids: number[]) {
    return this.timeRepository.findByIds(ids);
  }

  update(id: number, updateTimeDto: UpdateTimeDto) {
    return `This action updates a #${id} time`;
  }

  remove(id: number) {
    return `This action removes a #${id} time`;
  }
}
