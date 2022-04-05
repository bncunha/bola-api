import { IsNotEmpty, Min } from "class-validator";

export class CreateBolaoDto {
  @IsNotEmpty({message: 'Nome é obrigatório!'})
  nome: string;

  @Min(2, {message: 'Máximo de participantes deve ser 2 ou mais.'})
  maximoParticipantes: number;

  isPrivado: boolean;

  @IsNotEmpty({ message: 'Campeonato é obrigatório!'})
  campeonatoId: number;

  senha: string;
}
