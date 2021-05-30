import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Bolao } from 'src/models/Bolao';
import { Palpite } from 'src/models/Palpite';
import { Participacao } from 'src/models/Participacao';
import { Partida } from 'src/models/Partida';
import { Usuario } from 'src/models/Usuario';
import { ParticipacoesService } from 'src/participacoes/participacoes.service';
import { DateUtils } from 'src/utils/date.util';
import { Encrypt } from 'src/utils/encrypt.util';
import { Brackets, IsNull, LessThan, Repository } from 'typeorm';
import { CampeonatosService } from '../campeonatos/campeonatos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateBolaoDto } from './dto/create-bolao.dto';
import { UpdateBolaoDto } from './dto/update-bolao.dto';

@Injectable()
export class BoloesService {

  constructor(
    @InjectRepository(Bolao) private bolaoRepository: Repository<Bolao>,
    @InjectRepository(Partida) private partidaRepository: Repository<Partida>,
    @InjectRepository(Palpite) private palpiteRepository: Repository<Palpite>,
    private participacaoService: ParticipacoesService,
    private usuarioService: UsuariosService,
    private campeonatoService: CampeonatosService
  ) {}

  async create(createBoloeDto: CreateBolaoDto, usuario: number) {
    const bolao = plainToClass(Bolao, createBoloeDto);
    const campeonato = await this.campeonatoService.findByNome('Campeonato Brasileiro 2021');

    const user = await this.usuarioService.findOne(usuario);
    if (bolao.senha) {
      bolao.senha = await this.gerarSenhaBolao(bolao.senha);
    }
    bolao.campeonato = campeonato;
    bolao.dataInicio = new Date();
    bolao.participantes = [await this.participacaoService.createParticipacaoByUsuario(user, true)];
    return this.bolaoRepository.save(bolao);
  }

  findAll() {
    return this.bolaoRepository.find();
  }

  async findByUsuario(idUsuario: number) {
    const bolao = await this.bolaoRepository.createQueryBuilder('bolao')
    .leftJoinAndSelect('bolao.participantes', 'p')
    .leftJoin('p.usuario', 'u')
    .where('u.id = :idUsuario', { idUsuario })
    .getMany();

    for (let b of  bolao) {
      for (let part of b.participantes) {
        part.totalPontos = await this.getTotalPontosByParticipacao(part);
      }
    }
    return bolao;
  }

  async getTotalPontosByParticipacao(participacao: Participacao) {
    const palpites = await this.palpiteRepository.find({where: { participacao }});
    return palpites.reduce((prev, cur) => prev + (cur.pontuacao || 0) ,0)
  }

  findOne(id: number) {
    return this.bolaoRepository.findOneOrFail(id);
  }

  async update(id: number, updateBoloeDto: UpdateBolaoDto) {
    const bolao = await this.bolaoRepository.findOneOrFail(id);
    const participantes = await this.participacaoService.findByBolao(bolao);
    if (updateBoloeDto.senha) {
      bolao.senha = await this.gerarSenhaBolao(updateBoloeDto.senha);
    }
    if (participantes.length > updateBoloeDto.maximoParticipantes) {
      throw new ConflictException('A quantidade máxima de participantes deve ser superior a ' + bolao.participantes.length);
    }
    return this.bolaoRepository.update(id, bolao);
  }

  remove(id: number) {
    return `This action removes a #${id} boloe`;
  }

  async adicionarParticipante(idBolao: number, idUsuario: number) {
    const bolao = await this.bolaoRepository.findOneOrFail(idBolao);
    const usuario = await this.usuarioService.findOne(idUsuario);
    return this.participacaoService.participarBolao(bolao, usuario);
  }

  async removerParticipante(idBolao: number, idUsuario: number) {
    const bolao = await this.bolaoRepository.findOneOrFail(idBolao);
    const usuario = await this.usuarioService.findOne(idUsuario);
    return this.participacaoService.sairBolao(bolao, usuario);
  }

  async getRanking(idBolao: number) {
    const bolao = await this.bolaoRepository.findOneOrFail(idBolao);
    const result = await this.participacaoService.findByBolao(bolao, {relations: ['palpites', 'usuario']}) as any;
    result.forEach(r => {
      r.soma = r.palpites.reduce((prev, b) => prev + b.pontuacao, 0)
    })
    result.sort((a, b) => b.soma - a.soma);
    return result;
  }

  private gerarSenhaBolao(senha: string) {
    return Encrypt.toHash(senha);
  }

  async getPartidasAtivas(idBolao: number, idUsuario: number) {
    const mais30 = DateUtils.add(new Date(), {minutes: 30});
    console.log(mais30)
    const bolao = await this.bolaoRepository.findOne(idBolao, {relations: ['campeonato']})
    const idCampeonato = bolao.campeonato.id;

    let partidas = await this.partidaRepository.createQueryBuilder("partida")
    .leftJoinAndSelect('partida.mandante', 'mandante')
    .leftJoinAndSelect('partida.visitante', 'visitante')
    .leftJoin('partida.campeonato', 'campeonato')
    .where('campeonato.id = :idCampeonato', { idCampeonato })
    .andWhere('partida.isFinalizado = :isFinalizado', {isFinalizado: false})
    .andWhere('partida.data > :data', { data: mais30 })
    .getMany();
    const usuario = await this.usuarioService.findOne(idUsuario);
    const participacao = await this.participacaoService.findByBolaoAndUsuario(bolao, usuario, {relations: ['palpites', 'palpites.partida']});

    if (partidas.length) {
      const rodadaAtual = partidas[0].rodada;
      partidas.sort((a, b) => DateUtils.compare(a.data, b.data));
      partidas.forEach((p) => {
        p.palpites = participacao[0].palpites.filter(palpite => palpite.partida.id == p.id);
      })
      partidas = partidas.filter(p => DateUtils.difference(new Date(p.data), new Date()) <= 7 && p.rodada == rodadaAtual);
    }
    return partidas;
  }

  async getHistoricoPartidas(idBolao: number) {
    const bolao = await this.bolaoRepository.findOne(idBolao, {relations: ['campeonato']})
    const idCampeonato = bolao.campeonato.id;

    return this.partidaRepository.find({
      relations: ['mandante', 'visitante'],
      where: {
        campeonato: idCampeonato, data: LessThan(new Date())
      }, order: {
        data: 'DESC'
      }
    });
  }
}
