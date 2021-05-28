import { DateUtils } from "src/utils/date.util";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Campeonato } from "./Campeonato";
import { Participacao } from "./Participacao";
import { Partida } from "./Partida";

@Entity()
export class Bolao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true
  })
  nome: string;

  @Column({
    default: 15
  })
  maximoParticipantes: number;

  @Column({
    default: false
  })
  isPublico: boolean;

  @Column({
    nullable: true
  })
  senha: string;

  @Column({
    default: DateUtils.formatSql(new Date())
  })
  dataInicio: Date;

  @Column({
    nullable: true
  })
  dataFim: Date;

  @OneToMany(() => Participacao, p => p.bolao, {cascade: ['insert']})
  participantes: Participacao[];

  @ManyToOne(() => Campeonato)
  campeonato: Campeonato;

}