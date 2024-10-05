import { BaseEntity } from "./base-entity";

export abstract class BaseRepository<TEntity extends BaseEntity<any>> {
  protected entities: TEntity[];
  add(entity: TEntity): void {
    this.entities.push(entity);
  }
  popAll(): readonly TEntity[] {
    const copy = Object.freeze([...this.entities]);
    this.entities = [];

    return copy;
  }

  constructor() {
    this.entities = [];
  }
}
