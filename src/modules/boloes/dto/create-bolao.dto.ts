import { IsNotEmpty, Min } from "class-validator";

export class CreateBolaoDto {
  @IsNotEmpty({message: 'Nome é obrigatório!'})
  nome: string;

  @Min(2, {message: 'Máximo de participantes de ser 2 ou mais.'})
  maximoParticipantes: number;

  isPublico: boolean;

  senha: string;
}
