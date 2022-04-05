import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campeonato } from 'src/models/Campeonato';
import { In, Repository } from 'typeorm';
import { CriarCampeonatoDto } from './dto/criar-campeonato.dto';
import { DateUtils } from '../../utils/date.util';
import { Partida } from 'src/models/Partida';
import { Time } from 'src/models/Time';
import { ApiFootball } from 'src/gateway/api-football/api-football';
import { GetPartidasFilter } from '../partidas/dto/get-partidas-filter.dto';

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

  async atualizarLoteCampeonatos() {
    const campeonatos = await this.apiFootball.getCampeonatoAtivoByCountryAndSeason('Brazil', new Date().getFullYear());
    const campeonatosCadastrados = await this.campeonatoRepository.find({
      where: {
        idApiFootball: In(campeonatos.map(c => c.idApiFootball)),
        ano: new Date().getFullYear(),
      }
    })
    for (let campeonato of campeonatosCadastrados) {
      try {
        await this.atualizarCampeonato(campeonato);
      } catch(err) {
        console.log("Erro ao atualizar camepoanto!", err)
      }
    }
  }

  private async atualizarCampeonato(campeonato: Campeonato) {
    console.log('- Buscando Partidas - Campeonato: ' + campeonato.nome)
    const partidasApi = await this.apiFootball.getPartidas(campeonato.idApiFootball, new Date().getFullYear());
    console.log('- Buscando Partidas Cadastradas')
    const partidasCadastradas = await this.partidaRepository.find({relations: ['visitante', 'mandante'], where: {campeonato}});
    console.log('- Buscando Times Cadastradas')
    const times = await this.timeRepository.find();
    if (campeonato.dataFim.getTime() < new Date().getTime()) {
      const classificacao = await this.apiFootball.getClassificacao(campeonato.idApiFootball, new Date().getFullYear());
      const vencedor = classificacao[0].nomeTime;
      const vice = classificacao[1].nomeTime;
      campeonato.campeao = times.find(t => t.nome.indexOf(vencedor) >= 0);
      campeonato.viceCampeao = times.find(t => t.nome.indexOf(vice) >= 0);
      await this.campeonatoRepository.save(campeonato);
    }
    for (let p of partidasApi) {
      const idPartidaCadastrada = partidasCadastradas.find(pCadastrado => pCadastrado.isEqual(p));
      let mandante = times.find(t => t.nome.indexOf(p.mandante.nome) >= 0);
      let visitante = times.find(t => t.nome.indexOf(p.visitante.nome) >= 0);
      if (!mandante) {
        mandante = await this.timeRepository.save(p.mandante);
      }
      if (!visitante) {
        visitante = await this.timeRepository.save(p.visitante);
      }
      p.campeonato = campeonato;
      p.mandante = mandante;
      p.visitante = visitante;
      if (idPartidaCadastrada) {
        p.id = idPartidaCadastrada.id;
      }
    }
    console.log('- Salvando Partidas')
    const salvos = await this.partidaRepository.save(partidasApi);
    return salvos;
  }

  async findById(id: number) {
    return this.campeonatoRepository.findOne(id);
  }

  async findCampeonatosAtivosComPartidasAoVivoByUsuario(idUsuario: number) {
    return await this.campeonatoRepository.createQueryBuilder('campeonato')
      .leftJoin('campeonato.partidas', 'partida')
      .leftJoin('campeonato.boloes', 'b')
      .leftJoin('b.participantes', 'part')
      .leftJoinAndSelect('part.usuario', 'u')
      .where('u.id = :idUsuario', {idUsuario})
      .andWhere('campeonato.ano = :ano', {ano: new Date().getFullYear()})
      .andWhere('partida.isFinalizado = :finalizado', {finalizado: false})
      .andWhere('partida.data > :antesDuasHoras', {antesDuasHoras: DateUtils.subtract(new Date(), {hours: 2})})
      .andWhere('partida.data < :aposDuasHoras', {aposDuasHoras: DateUtils.add(new Date(), {hours: 2})})
      .getMany();
  }
  
  async findCampeonatosByUsuarioAndFilters(idUsuario: number, filtros: GetPartidasFilter) {
    const builder = this.campeonatoRepository.createQueryBuilder('campeonato')
      .leftJoinAndSelect('campeonato.partidas', 'partida')
      .leftJoin('campeonato.boloes', 'b')
      .leftJoin('b.participantes', 'part')
      .leftJoinAndSelect('part.usuario', 'u')
      .where('u.id = :idUsuario', {idUsuario})
      .andWhere('campeonato.ano = :ano', {ano: new Date().getFullYear()})
  
    if (filtros.periodo || 'SEMANAL') {
      builder.andWhere('partida.data >= :hoje', {hoje: DateUtils.setTime(new Date(), {hours: 0, minutes: 0, seconds: 0})} )
      builder.andWhere('partida.data <= :proximaSemana', {proximaSemana: DateUtils.add(DateUtils.setTime(new Date(), {hours: 0, minutes: 0, seconds: 0}), {weeks: 1})} )
    }
    return builder.getMany();
  }

  getCampeonatosAtivosPorPais(pais: string) {
    return this.apiFootball.getCampeonatoAtivoByCountryAndSeason(pais, new Date().getFullYear());
  }

  async getCampeonatoByIdApiFootballAndSeason(id: number, season: number) {
    const campeonatoLocal = await this.campeonatoRepository.findOne({
      where: { idApiFootball: id, ano: season }
    })
    if (campeonatoLocal) {
      return campeonatoLocal;
    }
    return (await this.apiFootball.getCampeonatoById(id))[0];
  }
}

