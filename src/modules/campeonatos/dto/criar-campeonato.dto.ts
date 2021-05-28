import { IsNotEmpty } from "class-validator";

class PartidaDto {
  @IsNotEmpty()
  data: string;
  
  @IsNotEmpty()  
  mandante: string;

  @IsNotEmpty()
  visitante: string;

  @IsNotEmpty()
  rodada: number;
}

export class CriarCampeonatoDto {
  @IsNotEmpty()
  campeonato: string;

  @IsNotEmpty()
  dataInicio: string;

  @IsNotEmpty()
  dataFim: string;

  @IsNotEmpty()
  partidas: PartidaDto[]
}
