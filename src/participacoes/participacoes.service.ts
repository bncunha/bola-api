import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bolao } from 'src/models/Bolao';
import { Participacao } from 'src/models/Participacao';
import { Usuario } from 'src/models/Usuario';
import { Repository } from 'typeorm';
import { CreateParticipacoeDto } from './dto/create-participacoe.dto';
import { UpdateParticipacoeDto } from './dto/update-participacoe.dto';

@Injectable()
export class ParticipacoesService {

  constructor(
    @InjectRepository(Participacao) private participacaoRepository: Repository<Participacao>
  ) {}

  async createParticipacaoByUsuario(usuario: Usuario, isAdm: boolean) {
    const participacao = await this.participacaoRepository.create();
    participacao.usuario = usuario;
    participacao.isAdministrador = isAdm;
    return participacao;
  }

  create(createParticipacoeDto: CreateParticipacoeDto) {
    return 'This action adds a new participacoe';
  }

  async participarBolao(bolao: Bolao, usuario: Usuario) {
    if (await (await this.findByUsuario(usuario)).length) {
      throw new ConflictException('Esse usuário já está participando deste bolão!')
    }
    const participacao = await this.createParticipacaoByUsuario(usuario, false);
    participacao.bolao = bolao;
    return this.participacaoRepository.save(participacao);
  }

  async sairBolao(bolao: Bolao, usuario: Usuario) {
    return this.participacaoRepository.remove(await this.findByBolaoAndUsuario(bolao, usuario));
  }

  findByBolao(bolao: Bolao, options?) {
    return this.participacaoRepository.find({
      where: {
        bolao
      },
      ...options
    })
  }

  findByUsuario(usuario: Usuario) {
    return this.participacaoRepository.find({
      where: {
        usuario
      }
    })
  }

  findByBolaoAndUsuario(bolao: Bolao, usuario: Usuario, options?:any) {
    return this.participacaoRepository.find({
      where: {
        bolao,
        usuario
      },
      ...options
    })
  }

  findAll() {
    return `This action returns all participacoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participacoe`;
  }

  update(id: number, updateParticipacoeDto: UpdateParticipacoeDto) {
    return `This action updates a #${id} participacoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} participacoe`;
  }
}
