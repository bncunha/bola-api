import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {

  @IsNotEmpty({message: 'Nome deve ser obrigatório!'})
  nome: string;

  @IsNotEmpty({message: 'Email deve ser obrigatório!'})
  @IsEmail(undefined, {message: 'E-mail inválido!'})
  email: string;
  
  @IsNotEmpty({message: 'Senha deve ser obrigatório!'})
  senha: string;
}
