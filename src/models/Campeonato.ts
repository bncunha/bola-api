import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Partida } from "./Partida";
import { Time } from "./Time";

@Entity()
export class Campeonato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  nome: string;

  @Column({
    nullable: false
  })
  dataInicio: Date;

  @Column({
    nullable: false
  })
  dataFim: Date;

  @Column({
    nullable: true
  })
  idApiFootball: number;

  @ManyToOne(() => Time)
  campeao: Time;

  @ManyToOne(() => Time)
  viceCampeao: Time;

  @OneToMany(() => Partida, p => p.campeonato, {cascade: true})
  partidas: Partida[];
}