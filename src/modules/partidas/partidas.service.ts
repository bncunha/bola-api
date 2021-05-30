import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partida } from 'src/models/Partida';
import { Repository } from 'typeorm';
import { PalpitesService } from '../palpites/palpites.service';
import { AtualizarResultadoPartidaDto } from './dto/atualizar-resultado-partida';

@Injectable()
export class PartidasService {

  constructor(
    @InjectRepository(Partida) private partidaRepository: Repository<Partida>,
    private palpiteService: PalpitesService
  ) {}

  async atualizarResultado(partidasDto: AtualizarResultadoPartidaDto[]) {
    const ids = partidasDto.map(p => p.idPartida);
    const partidas = await this.partidaRepository.findByIds(ids);
    partidasDto.forEach(p => {
      const finded = partidas.find(p1 => p1.id == p.idPartida);
      if (finded) {
        finded.isFinalizado = true;
        finded.resultadoMandante = p.resultadoMandante;
        finded.resultadoVisitante = p.resultadoVisitante;
      }
    })
    const salvos = await this.partidaRepository.save(partidas);
    const requests = ids.map(id => this.palpiteService.pontuarPalpites(id));
    await Promise.all(requests);
    return salvos;
  }
}
