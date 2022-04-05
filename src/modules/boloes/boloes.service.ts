import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { ApiFootball } from 'src/gateway/api-football/api-football';
import { Bolao } from 'src/models/Bolao';
import { Campeonato } from 'src/models/Campeonato';
import { Palpite } from 'src/models/Palpite';
import { Participacao } from 'src/models/Participacao';
import { Partida } from 'src/models/Partida';
import { Usuario } from 'src/models/Usuario';
import { ParticipacoesService } from 'src/participacoes/participacoes.service';
import { DateUtils } from 'src/utils/date.util';
import { Encrypt } from 'src/utils/encrypt.util';
import { Brackets, FindOneOptions, getConnection, In, IsNull, LessThan, Repository } from 'typeorm';
import { CampeonatosService } from '../campeonatos/campeonatos.service';
import { TimesService } from '../times/times.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateBolaoDto } from './dto/create-bolao.dto';
import { CreatePalpiteBonusDto } from './dto/create-palpite-bonus.dto';
import { UpdateBolaoDto } from './dto/update-bolao.dto';

@Injectable()
export class BoloesService {

  constructor(
    @InjectRepository(Bolao) private bolaoRepository: Repository<Bolao>,
    @InjectRepository(Partida) private partidaRepository: Repository<Partida>,
    @InjectRepository(Palpite) private palpiteRepository: Repository<Palpite>,
    private participacaoService: ParticipacoesService,
    private usuarioService: UsuariosService,
    private campeonatoService: CampeonatosService,
    private timeService: TimesService
  ) {}

  async create(createBoloeDto: CreateBolaoDto, usuario: number) {
    const bolao = plainToClass(Bolao, createBoloeDto);
    const campeonato = await this.campeonatoService.getCampeonatoByIdApiFootball(createBoloeDto.campeonatoId);
    const user = await this.usuarioService.findOne(usuario);
    if (bolao.senha) {
      bolao.senha = await this.gerarSenhaBolao(bolao.senha);
    }
    bolao.isPublico = !createBoloeDto.isPrivado;
    bolao.campeonato = campeonato;
    bolao.dataInicio = new Date();
    bolao.participantes = [await this.participacaoService.createParticipacaoByUsuario(user, true)];
    delete bolao['campeonatoId']
    if (!bolao.isPublico && !bolao.senha) {
      throw new ConflictException("Senha é obrigatorio para bolao privado")
    }
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
        part.totalPontos = (await this.getTotalPontosByParticipacao(part));
      }
    }
    return bolao;
  }

  findByCampeonato(campeonato: Campeonato[]) {
    return this.bolaoRepository.find({where: {
      campeonato: In(campeonato.map(c => c.id))
    }})
  }

  async getTotalPontosByParticipacao(participacao: Participacao) {
    const palpites = await this.palpiteRepository.find({where: { participacao }});
    return this.somarTotalPontos(palpites, participacao);
  }
  
  somarTotalPontos(palpites: any[], participacao: Participacao) {
    const somaPontos = palpites.reduce((prev, cur) => prev + (cur.pontuacao || 0) ,0)
    return somaPontos + Number(participacao.pontosBonus || 0)
  }

  findOne(id: number, options?: FindOneOptions) {
    return this.bolaoRepository.findOneOrFail(id, options);
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
      r.pontuacao = this.somarTotalPontos(r.palpites, r);
      delete r.palpites;
    })
    result.sort((a, b) => b.pontuacao - a.pontuacao);
    return result;
  }

  private gerarSenhaBolao(senha: string) {
    return Encrypt.toHash(senha);
  }

  async getPartidasAtivas(idBolao: number, idUsuario: number) {
    const bolao = await this.bolaoRepository.findOne(idBolao, {relations: ['campeonato']})
    const idCampeonato = bolao.campeonato.id;

    let partidas = await this.partidaRepository.createQueryBuilder("partida")
    .leftJoinAndSelect('partida.mandante', 'mandante')
    .leftJoinAndSelect('partida.visitante', 'visitante')
    .leftJoin('partida.campeonato', 'campeonato')
    .where('campeonato.id = :idCampeonato', { idCampeonato })
    .getMany();
    const usuario = await this.usuarioService.findOne(idUsuario);
    const participacao = await this.participacaoService.findByBolaoAndUsuario(bolao, usuario, {relations: ['palpites', 'palpites.partida']});

    if (partidas.length) {
      partidas.sort((a, b) => DateUtils.compare(a.data, b.data));
      partidas.forEach((p) => {
        p.palpites = participacao[0].palpites.filter(palpite => palpite.partida.id == p.id);
      })
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

  async salvarPalpiteBonus(idBolao: number, createPalpiteBonusDto: CreatePalpiteBonusDto, idUsuario: number) {
    const times = await this.timeService.findByIds([createPalpiteBonusDto.idCampeao, createPalpiteBonusDto.idViceCampeao]);
    if (createPalpiteBonusDto.idCampeao == createPalpiteBonusDto.idViceCampeao) {
      throw new ConflictException('Time campeão deve ser diferente do vice-campeão!')
    }
    
    if (times.length < 2) {
      throw new NotFoundException('Time não encontrado!');
    }

    const bolao = await this.bolaoRepository.findOneOrFail(idBolao);
    const usuario = await this.usuarioService.findOne(idUsuario);
    const participacao = await this.participacaoService.findByBolaoAndUsuario(bolao, usuario);
    const timeCampeao = await this.timeService.findByIds([createPalpiteBonusDto.idCampeao]);
    const timeVice = await this.timeService.findByIds([createPalpiteBonusDto.idViceCampeao]);
    participacao[0].palpiteCampeao = timeCampeao[0];
    participacao[0].palpiteViceCampeao = timeVice[0];
    return this.participacaoService.save(participacao[0]);
  }

  async getPalpiteBonus(idBolao: number, idUsuario: number) {
    const bolao = await this.bolaoRepository.findOneOrFail(idBolao);
    const usuario = await this.usuarioService.findOne(idUsuario);
    const participacao = await this.participacaoService.findByBolaoAndUsuario(bolao, usuario, {relations: ['palpiteCampeao', 'palpiteViceCampeao']});
    console.log(participacao);
    return {
      palpiteCampeao: participacao[0].palpiteCampeao ? participacao[0].palpiteCampeao?.id : null,
      palpiteViceCampeao: participacao[0].palpiteViceCampeao ? participacao[0].palpiteViceCampeao?.id : null,
    }
  }

  async getDetalhesPartida(idBolao: number, idPartida: number) {
    const mais30 = DateUtils.add(new Date(), {minutes: 30});
    const bolao = await this.bolaoRepository.findOneOrFail(idBolao); 
    const partida = await this.partidaRepository.findOneOrFail(idPartida, {relations: ['mandante', 'visitante']});
    const palpites = await this.palpiteRepository.createQueryBuilder('palpite')
      .leftJoin('palpite.partida', 'part')
      .leftJoinAndSelect('palpite.participacao', 'p')
      .leftJoinAndSelect('p.usuario', 'u')
      .leftJoinAndSelect('p.bolao', 'b')
      .where('part.id = :idPartida', {idPartida})
      .andWhere('part.data < :mais30', {mais30})
      .andWhere('b.id = :idBolao', {idBolao: bolao.id})
      .getMany();
    return {
      partida,
      palpites
    }
  }
}
