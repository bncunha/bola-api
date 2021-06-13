import { Injectable } from "@nestjs/common";
import { EntityTarget, getConnection, getRepository, Repository } from "typeorm";

@Injectable()
export class TypeOrmGateway<T> {
  private repository: Repository<T>;
  
  constructor(
    entity: EntityTarget<T>
  ) {
    this.repository = getRepository<T>(entity, 'conexaopicadasgalaxia');
  }
  
  findOneOrFail(id: number): Promise<T> {
    return this.repository.findOneOrFail(id);
  }

  findByIds(ids: number[]): Promise<T[]> {
    return this.repository.findByIds(ids);
  }

  saveMany(entity: T[]): Promise<T[]> {
    return this.repository.save(entity);
  }
}