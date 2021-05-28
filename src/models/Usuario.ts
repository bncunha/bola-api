import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Participacao } from "./Participacao";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  nome: string;

  @Column({
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    nullable: false,
    select: false
  })
  senha: string;

  @Column({
    default: true
  })
  isAtivo: boolean;

  @OneToMany(() => Participacao, p => p.usuario)
  participacoes: Participacao[];
}