import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Time {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false
  })
  nome: string;
}