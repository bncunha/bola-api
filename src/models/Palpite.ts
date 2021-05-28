import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Participacao } from "./Participacao";
import { Partida } from "./Partida";

@Entity()
export class Palpite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  resultadoMandante: number;

  @Column({
    nullable: false
  })
  resultadoVisitante: number;

  @Column({
    default: 0
  })
  pontuacao: number;

  @Column({
    default: false
  })
  dobrarPontos: boolean;

  @ManyToOne(() => Partida, p => p.palpites)
  partida: Partida;

  @ManyToOne(() => Participacao, p => p.palpites)
  participacao: Participacao;

  totalPontos: number;
}