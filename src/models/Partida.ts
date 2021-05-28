import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Bolao } from "./Bolao";
import { Campeonato } from "./Campeonato";
import { Palpite } from "./Palpite";
import { Time } from "./Time";

@Entity()
export class Partida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: Date;

  @Column({
    default: false
  })
  isFinalizado: boolean;

  @Column({
    nullable: true
  })
  estadio: string;

  @Column({
    nullable: true
  })
  resultadoMandante: number;

  @Column({
    nullable: true
  })
  resultadoVisitante: number;

  @Column({
    nullable: false
  })
  rodada: number;
  
  @OneToMany(() => Palpite, p => p.partida)
  palpites: Palpite[];

  @ManyToOne(() => Time)
  mandante: Time;

  @ManyToOne(() => Time)
  visitante: Time;

  @ManyToOne(() => Campeonato, c => c.partidas)
  campeonato: Campeonato;

}