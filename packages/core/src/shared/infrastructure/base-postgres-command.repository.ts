import { BaseEntity } from "@task-bot/core/shared/domain/base-entity";
import { sql } from "slonik";
import toSnakeCase from "lodash/snakeCase";
import { Operation } from "@task-bot/core/shared/domain/base-repository";
import { BaseValueObject } from "@task-bot/core/shared/domain/base-value-object";
import { DatabaseConnectionContext } from "./db-pool";
import { addRepositorySegment } from "../domain/observability";
import { FragmentSqlToken } from "slonik";

export class BasePostgresCommandRepository<TEntity extends BaseEntity<any>> {
  entities: { operation: Operation; entity: TEntity }[] = [];
  add(entity: TEntity, operation: Operation): void {
    this.entities.push({
      operation,
      entity,
    });
  }

  constructor(
    protected readonly tableName: string,
    protected readonly db = DatabaseConnectionContext.use,
  ) {}

  async saveOne(entity: TEntity, operation: Operation) {
    switch (operation) {
      case "create":
        return this.create(entity);
      case "delete":
        return this.delete(entity);
      case "update":
        return this.update(entity);
    }
  }

  private toPersistence(entity: TEntity) {
    const keys = [];
    const values = [];
    for (const [key, value] of Object.entries(entity.props)) {
      if (value instanceof BaseValueObject) {
        for (const [voKey, voValue] of Object.entries(value.props)) {
          keys.push(toSnakeCase(voKey));
          values.push(
            voValue instanceof Date ? voValue.toISOString() : voValue,
          );
        }
        continue;
      }

      keys.push(toSnakeCase(key));
      values.push(value instanceof Date ? value.toISOString() : value);
    }

    return [keys, values];
  }

  private async create(entity: TEntity) {
    using segment = addRepositorySegment(this.tableName, this.create);
    const [keys, values] = this.toPersistence(entity);

    await segment.try(async () => {
      const conn = await this.db().get();
      const query = sql.unsafe`
      INSERT INTO ${sql.identifier([this.tableName])} (${sql.join(
        keys.map((key) => sql.identifier([key])),
        sql.fragment`, `,
      )})
      VALUES (${sql.join(values, sql.fragment`, `)})
    `;
      await conn.query(query);
    });
  }

  private async delete(entity: TEntity): Promise<void> {
    using segment = addRepositorySegment(this.tableName, this.delete);
    await segment.try(async () => {
      const conn = await this.db().get();
      await conn.query(sql.unsafe`
      DELETE FROM ${sql.identifier([this.tableName])} WHERE id = ${entity.props.id}
    `);
    });
  }

  private async update(entity: TEntity): Promise<void> {
    using segment = addRepositorySegment(this.tableName, this.update);
    const [keys, values] = this.toPersistence(entity);

    const setClauses: FragmentSqlToken[] = [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];
      setClauses.push(
        sql.fragment`${sql.identifier([toSnakeCase(key)])} = ${value instanceof Date ? value.toISOString() : value}`,
      );
    }

    await segment.try(async () => {
      const conn = await this.db().get();
      await conn.query(sql.unsafe`
      UPDATE ${sql.identifier([this.tableName])}
      SET ${sql.join(setClauses, sql.fragment`, `)}
      WHERE id = ${entity.props.id}
    `);
    });
  }
}
