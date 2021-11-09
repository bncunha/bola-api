import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/modules/usuarios/usuarios.service';
import { Encrypt } from 'src/utils/encrypt.util';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private jwtService: JwtService
  ){}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findByEmail(email, true);
    if (user && user.isAtivo && await Encrypt.compare(pass, user.senha)) {
      console.log('--Usuario Logado--', user);
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      nome: user.nome,
      token: this.jwtService.sign(payload),
    };
  }
}
