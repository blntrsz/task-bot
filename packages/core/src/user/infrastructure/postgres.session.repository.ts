import { BasePostgresCommandRepository } from "@task-bot/core/shared/infrastructure/base-postgres-command.repository";
import { DatabaseConnectionContext } from "@task-bot/core/shared/infrastructure/db-pool";
import {
  SessionEntity,
  SessionEntitySchema,
} from "@task-bot/core/user/domain/session.entity";
import {
  SessionRepository,
  SessionRepositoryQuerySchema,
} from "@task-bot/core/user/domain/session.repository";
import { sql } from "slonik";

export class PostgresSessionRepository
  extends BasePostgresCommandRepository<SessionEntity>
  implements SessionRepository
{
  constructor(protected readonly db = DatabaseConnectionContext.use()) {
    super("tasks", db);
  }

  async save(): Promise<void> {
    await Promise.all(
      this.entities.map(({ entity, operation }) => {
        return this.saveOne(entity, operation);
      }),
    );
  }

  async findOne(
    props: Pick<SessionEntitySchema, "id">,
  ): Promise<SessionEntity> {
    const conn = await this.db.get();
    const result = await conn.one(
      sql.type(
        SessionRepositoryQuerySchema,
      )`SELECT * FROM ${sql.identifier([this.tableName])} where id = ${props.id}`,
    );
    return new SessionEntity(result);
  }
}

export const withPostgresSessionRepository = SessionRepository.with(
  new PostgresSessionRepository(),
);
