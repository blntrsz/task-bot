import { addRepositorySegment } from "@task-bot/core/shared/domain/observability";
import { BasePostgresCommandRepository } from "@task-bot/core/shared/infrastructure/base-postgres-command.repository";
import { DatabaseConnectionContext } from "@task-bot/core/shared/infrastructure/db-pool";
import {
  UserEntity,
  UserEntitySchema,
} from "@task-bot/core/user/domain/user.entity";
import { UserRepository } from "@task-bot/core/user/domain/user.repository";
import { sql } from "slonik";

export class PostgresUserRepository
  extends BasePostgresCommandRepository<UserEntity>
  implements UserRepository
{
  constructor(protected readonly db = DatabaseConnectionContext.use) {
    super("users");
  }

  async save(): Promise<void> {
    using segment = addRepositorySegment(this.tableName, this.save);

    await segment.try(() =>
      Promise.all(
        this.entities.map(({ entity, operation }) => {
          return this.saveOne(entity, operation);
        }),
      ),
    );
  }

  async findOne(props: Pick<UserEntitySchema, "id">): Promise<UserEntity> {
    using segment = addRepositorySegment(this.tableName, this.findOne);

    return await segment.try(async () => {
      const conn = await this.db().get();
      const result = await conn.one(
        sql.type(
          UserEntitySchema,
        )`SELECT * FROM ${sql.identifier([this.tableName])} where id = ${props.id}`,
      );
      return new UserEntity(result);
    });
  }

  async findByEmail(
    props: Pick<UserEntitySchema, "email">,
  ): Promise<UserEntity> {
    using segment = addRepositorySegment(this.tableName, this.findByEmail);

    return segment.try(async () => {
      const conn = await this.db().get();
      const result = await conn.one(
        sql.type(
          UserEntitySchema,
        )`SELECT * FROM ${sql.identifier([this.tableName])} where email = ${props.email}`,
      );
      return new UserEntity(result);
    });
  }
}

export const withPostgresUserRepository = UserRepository.with(
  new PostgresUserRepository(),
);
