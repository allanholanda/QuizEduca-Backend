import { Repository, ObjectLiteral } from 'typeorm';
import { AppDataSource } from '../lib/typeorm/typeorm';

export class BaseRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;

  constructor(entity: new () => T) {
    this.repo = AppDataSource.getRepository(entity);
  }
}