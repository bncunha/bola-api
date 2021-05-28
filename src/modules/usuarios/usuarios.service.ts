import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Usuario } from 'src/models/Usuario';
import { Encrypt } from 'src/utils/encrypt.util';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = plainToClass(Usuario, createUsuarioDto);
    usuario.senha = await Encrypt.toHash(usuario.senha);
    await this.usuarioRepository.save(usuario);
    return {criado: true};
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  findOne(id: number) {
    return this.usuarioRepository.findOne(id)
  }

  findByEmail(email: string, getSenha: boolean = false) {
    return this.usuarioRepository.findOne({email: email}, {
      select: getSenha ? ['senha', 'email', 'id', 'isAtivo', 'nome'] : ['email', 'id', 'isAtivo', 'nome']  
    });
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = plainToClass(Usuario, updateUsuarioDto);
    return this.usuarioRepository.update(id, usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    usuario.isAtivo = false;
    await this.usuarioRepository.update(usuario.id, usuario);
    return 'removed';
  }
}
