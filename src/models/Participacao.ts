import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Bolao } from "./Bolao";
import { Palpite } from "./Palpite";
import { Time } from "./Time";
import { Usuario } from "./Usuario";

@Entity()
export class Participacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: false
  })
  isAdministrador: boolean;

  @Column({
    default: false
  })
  isVencedor: boolean;

  @ManyToOne(() => Usuario, u => u.participacoes)
  usuario: Usuario;

  @ManyToOne(() => Bolao, b => b.participantes)
  bolao: Bolao;

  @OneToMany(() => Palpite, p => p.participacao)
  palpites: Palpite[];

  @ManyToOne(() => Time)
  palpiteCampeao: Time;

  @ManyToOne(() => Time)
  palpiteViceCampeao: Time;

  totalPontos: number;
}