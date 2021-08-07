import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campeonato } from 'src/models/Campeonato';
import { Repository } from 'typeorm';
import { CriarCampeonatoDto } from './dto/criar-campeonato.dto';
import { DateUtils } from '../../utils/date.util';
import { Partida } from 'src/models/Partida';
import { Time } from 'src/models/Time';
import { ApiFootball } from 'src/gateway/api-football/api-football';

@Injectable()
export class CampeonatosService {

  constructor(
    @InjectRepository(Campeonato) private campeonatoRepository: Repository<Campeonato>,
    @InjectRepository(Partida) private partidaRepository: Repository<Partida>,
    @InjectRepository(Time) private timeRepository: Repository<Time>,
    private apiFootball: ApiFootball
  ) {}

  async criarCampeonatoCompleto(criarCampeonato: CriarCampeonatoDto) {
    const campeonatoSalvo = await this.campeonatoRepository.findOne({where: {nome: criarCampeonato.campeonato}, relations: ['partidas', 'partidas.mandante', 'partidas.visitante']});
    const campeonato = campeonatoSalvo ? campeonatoSalvo : this.campeonatoRepository.create();
    
    campeonato.nome = criarCampeonato.campeonato;
    campeonato.dataInicio = new Date(criarCampeonato.dataInicio);
    campeonato.dataFim = new Date(criarCampeonato.dataFim);

    for (let partida of criarCampeonato.partidas) {
      if (!campeonato.partidas.find(p => p.mandante.nome == partida.mandante && p.visitante.nome == partida.visitante && DateUtils.compare(new Date(p.data), new Date(partida.data)) == 0)) {
        const novaPartida = this.partidaRepository.create();
        novaPartida.rodada = partida.rodada;
        novaPartida.data = new Date(partida.data);
        novaPartida.mandante = await this.timeRepository.findOneOrFail({where: {nome: partida.mandante}});
        novaPartida.visitante = await this.timeRepository.findOneOrFail({where: {nome: partida.visitante}});
        campeonato.partidas.push(novaPartida);
      } else {
        console.log('Partida já cadastrada')
      }
    }
    return this.campeonatoRepository.save(campeonato);
  }

  findByNome(nome: string) {
    return this.campeonatoRepository.findOne({where: {nome}})
  }

  async atualizarCampeonato() {
    const campeonato = await this.apiFootball.getCampeonatoAtivo();
    const partidasApi = await this.apiFootball.getPartidas(campeonato.idApiFootball, new Date().getFullYear());
    const campeonatoCadastrato = await this.campeonatoRepository.findOneOrFail({where: {idApiFootball: campeonato.idApiFootball}})
    const partidasCadastradas = await this.partidaRepository.find({relations: ['visitante', 'mandante']});
    const times = await this.timeRepository.find();
    for (let p of partidasApi) {
      const idPartidaCadastrada = partidasCadastradas.find(pCadastrado => pCadastrado.isEqual(p));
      const idMandante = times.find(t => t.nome.indexOf(p.mandante.nome) >= 0);
      const idVisitante = times.find(t => t.nome.indexOf(p.visitante.nome) >= 0);
      p.campeonato = campeonatoCadastrato;
      p.mandante.id = idMandante.id;
      p.visitante.id = idVisitante.id;
      if (idPartidaCadastrada) {
        p.id = idPartidaCadastrada.id;
      }
    }
    const salvos = await this.partidaRepository.save(partidasApi);
    return salvos;
  }

}

