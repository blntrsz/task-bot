import { createContext } from "../contex";
import { BaseEntity } from "./base-entity";
import { BaseRepository } from "./base-repository";
import { EventEmitter } from "./event-emitter";

export interface UnitOfWork<TEntity extends BaseEntity<any>> {
  save(
    repositories: BaseRepository<TEntity>[],
    eventEmitter: EventEmitter,
  ): Promise<void>;
}

export const UnitOfWork = createContext<UnitOfWork<any>>();
