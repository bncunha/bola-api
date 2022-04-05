import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Bolao } from "./Bolao";
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

  @Column({
    nullable: true
  })
  ano: number;

  @Column({
    nullable: true
  })
  imagem: string;

  @ManyToOne(() => Time)
  campeao: Time;

  @ManyToOne(() => Time)
  viceCampeao: Time;

  @OneToMany(() => Partida, p => p.campeonato, {cascade: true})
  partidas: Partida[];

  @OneToMany(() => Bolao, b => b.campeonato)
  boloes: Bolao[];

  atualizarVencedores(campeao: Time, vice: Time) {
    this.campeao = campeao;
    this.viceCampeao = vice;
  }
}