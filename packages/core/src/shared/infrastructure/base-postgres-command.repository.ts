import { BaseEntity } from "@task-bot/core/shared/domain/base-entity";
import { sql } from "slonik";
import toSnakeCase from "lodash/snakeCase";
import { Operation } from "@task-bot/core/shared/domain/base-repository";
import { BaseValueObject } from "@task-bot/core/shared/domain/base-value-object";
import { DatabaseConnection } from "./db-pool";

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
    protected readonly db: DatabaseConnection,
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
          keys.push(voKey);
          values.push(voValue);
        }
        continue;
      }

      keys.push(toSnakeCase(key));
      values.push(toSnakeCase(value));
    }

    return [keys, values];
  }

  private async create(entity: TEntity) {
    const conn = await this.db.get();
    const [keys, values] = this.toPersistence(entity);

    await conn.query(sql.typeAlias("void")`
      INSERT INTO ${sql.identifier([this.tableName])} (${sql.join(keys, sql.fragment`, `)})
      VALUES (${sql.join(values, sql.fragment`, `)})
    `);
  }

  private async delete(entity: TEntity): Promise<void> {
    const conn = await this.db.get();
    await conn.query(sql.typeAlias("void")`
      DELETE FROM ${sql.identifier([this.tableName])} WHERE id = ${entity.props.id}
    `);
  }

  private async update(entity: TEntity): Promise<void> {
    const [keys, values] = this.toPersistence(entity);

    const setClauses = [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];
      setClauses.push(
        sql.fragment`${sql.identifier([toSnakeCase(key)])} = ${value instanceof Date ? value.toISOString() : value}`,
      );
    }

    const conn = await this.db.get();
    await conn.query(sql.typeAlias("void")`
      UPDATE ${sql.identifier([this.tableName])}
      SET ${sql.join(setClauses, sql.fragment`, `)}
      WHERE id = ${entity.props.id}
    `);
  }
}
