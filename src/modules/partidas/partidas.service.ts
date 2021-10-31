import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiFootball } from 'src/gateway/api-football/api-football';
import { Partida } from 'src/models/Partida';
import { Repository } from 'typeorm';
import { CampeonatosService } from '../campeonatos/campeonatos.service';
import { PalpitesService } from '../palpites/palpites.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { AtualizarResultadoPartidaDto } from './dto/atualizar-resultado-partida';

@Injectable()
export class PartidasService {

  constructor(
    @InjectRepository(Partida) private partidaRepository: Repository<Partida>,
    private palpiteService: PalpitesService,
    private apiFootball: ApiFootball,
    private campeonatoService: CampeonatosService,
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

  async buscarAoVivo(idUsuario: number, campeonato?: number) {
    if (campeonato) {
      const c = await this.campeonatoService.findById(campeonato);
      return {
        campeonato: c,
        partidas: this.apiFootball.getPartidas(c.idApiFootball, c.ano, true)
      }
    }
    const campeonatosUsuario = await this.campeonatoService.findCampeonatosAtivosByUsuario(idUsuario);
    const requests = campeonatosUsuario.map(c => this.apiFootball.getPartidas(c.idApiFootball, c.ano, true));
    const response = await Promise.all(requests);
    return response.map((r, index) => ({
      campeonato: campeonatosUsuario[index],
      partidas: r
    }))
  }
}
