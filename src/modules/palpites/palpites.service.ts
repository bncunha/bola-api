import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Palpite } from 'src/models/Palpite';
import { Participacao } from 'src/models/Participacao';
import { Partida } from 'src/models/Partida';
import { ParticipacoesService } from 'src/participacoes/participacoes.service';
import { DateUtils } from 'src/utils/date.util';
import { IsNull, Not, Repository } from 'typeorm';
import { BoloesService } from '../boloes/boloes.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreatePalpiteDto } from './dto/create-palpite.dto';
import { UpdatePalpiteDto } from './dto/update-palpite.dto';

@Injectable()
export class PalpitesService {

  constructor(
    @InjectRepository(Palpite) private palpiteRepository: Repository<Palpite>,
    @InjectRepository(Partida) private partidaRepository: Repository<Partida>,
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
    return this.palpiteRepository.save(toSave);
  }

  async pontuarPalpites(idPartida: number) {
    const partida = await this.partidaRepository.findOneOrFail(idPartida);
    const palpites = await this.palpiteRepository.find({where: { partida }});
    const resultadoMandante = partida.resultadoMandante;
    const resultadoVisitante = partida.resultadoVisitante;
    const vencedor = this.getVencedor(resultadoMandante, resultadoVisitante);
    const diferenca = Math.abs(resultadoMandante - resultadoVisitante);

    if (resultadoMandante == null || resultadoVisitante == null) {
      throw new ConflictException('Partida não possui os resultados');
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
}
