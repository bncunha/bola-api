import { IsNotEmpty } from "class-validator";

export class AtualizarResultadoPartidaDto {
  @IsNotEmpty({message: 'Partida é obrigatório!'})
  idPartida: number;
  @IsNotEmpty({message: 'Resultado mandante é obrigatório!'})
  resultadoMandante: number;
  @IsNotEmpty({message: 'Resultado visitante é obrigatório!'})
  resultadoVisitante: number;
}
