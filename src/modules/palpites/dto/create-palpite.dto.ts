import { IsNotEmpty } from "class-validator";

export class CreatePalpiteDto {
  @IsNotEmpty()
  resultadoMandante: number;

  @IsNotEmpty()
  resultadoVisitante: number;

  @IsNotEmpty()
  idPartida: number;

  @IsNotEmpty()
  idBolao: number;
}