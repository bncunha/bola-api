import { Injectable } from "@nestjs/common";
import { TypeOrmGateway } from "src/gateway/TypeOrm.gateway";
import { Partida } from "src/models/Partida";

@Injectable()
export class PartidaGateway extends TypeOrmGateway<Partida> {

  constructor() {
    super(Partida);
  }
}