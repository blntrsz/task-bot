import { BaseEntity } from "./base-entity";

export type Operation = "create" | "delete" | "update";

export interface BaseRepository<TEntity extends BaseEntity<any>> {
  add(entity: TEntity, operation: Operation): void;
  save(): Promise<void>;
}
