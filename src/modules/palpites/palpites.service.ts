import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Campeonato } from 'src/models/Campeonato';
import { Palpite } from 'src/models/Palpite';
import { Participacao } from 'src/models/Participacao';
import { Partida } from 'src/models/Partida';
import { ParticipacoesService } from 'src/participacoes/participacoes.service';
import { DateUtils } from 'src/utils/date.util';
import { IsNull, LessThanOrEqual, Not, Repository, SimpleConsoleLogger } from 'typeorm';
import { BoloesService } from '../boloes/boloes.service';
import { PartidasService } from '../partidas/partidas.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreatePalpiteDto } from './dto/create-palpite.dto';
import { UpdatePalpiteDto } from './dto/update-palpite.dto';

@Injectable()
export class PalpitesService {

  constructor(
    @InjectRepository(Palpite) private palpiteRepository: Repository<Palpite>,
    @InjectRepository(Partida) private partidaRepository: Repository<Partida>,
    @InjectRepository(Campeonato) private campeonatoRepository: Repository<Campeonato>,
    private usuarioService: UsuariosService,
    private bolaoService: BoloesService,
    private participacaoService: ParticipacoesService
  ) {}

  async create(createPalpiteDtoArray: CreatePalpiteDto[], idUsuario: number) {
    const toSave = [];

    const usuario = await this.usuarioService.findOne(idUsuario);
    const bolao = await this.bolaoService.findOne(createPalpiteDtoArray[0].idBolao);
    const participacao = await this.participacaoService.findByBolaoAndUsuario(bolao, usuario);
    if (!participacao[0]) {
      throw new ConflictException('Usuário não está participando deste bolão');
    }
  
    for (let createPalpiteDto of createPalpiteDtoArray) {
      const partida = await this.partidaRepository.findOneOrFail(createPalpiteDto.idPartida);
      const hoje = new Date();
      if (DateUtils.compare(hoje, DateUtils.subtract(new Date(partida.data), {minutes: 30})) > 0) {
        throw new ConflictException('Palpites encerrados para esta partida');
      }
      const palpite = await this.palpiteRepository.findOne({where: {partida, participacao: participacao[0]}}) || plainToClass(Palpite, createPalpiteDto);      
      palpite.resultadoMandante = createPalpiteDto.resultadoMandante;
      palpite.resultadoVisitante = createPalpiteDto.resultadoVisitante;
      palpite.participacao = participacao[0];
      palpite.partida = partida;
      toSave.push(palpite);
    }
    console.log(`-- Salvando Palpite (${usuario.nome}-${usuario.id}) --`, toSave);
    return this.palpiteRepository.save(toSave);
  }

  async pontuarUltimosXRodadas(x: number) {
    const dataAtual = new Date();
    const partidasAntigas = await this.partidaRepository.find({
      where: {
        data: LessThanOrEqual(dataAtual)
      }, order: {
        data: 'DESC'
      }
    });
    const round = partidasAntigas[0]?.rodada;
    console.log('- Rodada:', round);
    if (round) {
      console.log('- Atualizando Palpites, últimos rounds -', x);
      const partidasAtualizar = partidasAntigas.filter(p => p.rodada <= round && p.rodada >= round - x);
      console.log(partidasAtualizar);
      await this.pontuarMany(partidasAtualizar.map(p => p.id));      
    }
  }

  async pontuarMany(idPartidas: number[]) {
    const requests = idPartidas.map(id => this.pontuarPalpites(id));
    return Promise.all(requests);
  }

  async pontuarPalpites(idPartida: number) {
    const partida = await this.partidaRepository.findOneOrFail(idPartida);
    const palpites = await this.palpiteRepository.find({where: { partida }});
    const resultadoMandante = partida.resultadoMandante;
    const resultadoVisitante = partida.resultadoVisitante;
    const vencedor = this.getVencedor(resultadoMandante, resultadoVisitante);
    const diferenca = Math.abs(resultadoMandante - resultadoVisitante);

    if (resultadoMandante == null || resultadoVisitante == null) {
      return new ConflictException('Partida não possui os resultados');
    }

    palpites.forEach(p => {
      const apostaVencedor = this.getVencedor(p.resultadoMandante, p.resultadoVisitante);
      if (p.resultadoMandante == resultadoMandante && p.resultadoVisitante == resultadoVisitante) {
        // se acertar o resultado do jogo
        p.pontuacao = 20;
      } else if (apostaVencedor == vencedor && diferenca == Math.abs(p.resultadoMandante - p.resultadoVisitante)) {
        // se acertar o vencedor && a diferença de gols
        p.pontuacao = 16;
      } else if (apostaVencedor == vencedor && (p.resultadoMandante == resultadoMandante || p.resultadoVisitante == resultadoVisitante)) {
        // se acertar o vencedor && o resultado de um dos dois times
        p.pontuacao = 15;
      } else if (apostaVencedor == vencedor) {
        // se acertar o vencedor
        p.pontuacao = 10;
      } else if ((p.resultadoMandante == resultadoMandante || p.resultadoVisitante == resultadoVisitante)) {
        // se acertar apenas o numero de gols em apenas um dos dois times
        p.pontuacao = 5;
      } else {
        // não acertou nada
        p.pontuacao = 0;
      }
    })

    return this.palpiteRepository.save(palpites);
  }

  private getVencedor(ptMandante: number, ptVisitante: number) {
    if (ptMandante > ptVisitante) {
      return 'mandante';
    } else if (ptMandante < ptVisitante) {
      return 'visitante';
    } else {
      return 'empate';
    }
  }

  async isPalpiteBonusDisponivel(idBolao: number) {
    const bolao = await this.bolaoService.findOne(idBolao, {relations: ['campeonato']}); 
    const partidas = await this.partidaRepository.find({
      where: {
        campeonato: bolao.campeonato,
        rodada: 3
      },
      order: {
        data: 'ASC'
      }
    });
    return DateUtils.compare(new Date(), partidas[0].data) <= 0;
  }

  async pontuarPalpiteBonus() {
    const campeonatosFinalizados = await this.campeonatoRepository.find({
      where: {
        campeao: Not(IsNull()),
        viceCampeao: Not(IsNull())
      },
    });
    const boloes = await this.bolaoService.findByCampeonato(campeonatosFinalizados);
    if (campeonatosFinalizados?.length && boloes?.length) {
      const participacoes = await this.participacaoService.findByBolao(boloes, {relations: ['palpiteCampeao', 'palpiteViceCampeao', 'bolao', 'bolao.campeonato', 'bolao.campeonato.campeao', 'bolao.campeonato.viceCampeao']});
      participacoes.forEach(p => {
        let acertouCampeao = 0;
        let acertouVice = 0;
        if (p.palpiteCampeao) {
          acertouCampeao = p.palpiteCampeao.id == p.bolao.campeonato.campeao.id ? 50 : 0;          
        }
        if (p.palpiteViceCampeao) {
          acertouVice = p.palpiteViceCampeao.id == p.bolao.campeonato.viceCampeao.id ? 30 : 0;
        }
        p.pontosBonus = acertouCampeao + acertouVice;        
      });
      await this.participacaoService.saveMany(participacoes);
    }
  }
}
