import { addSegment } from "@task-bot/core/shared/domain/observability";
import { BasePostgresCommandRepository } from "@task-bot/core/shared/infrastructure/base-postgres-command.repository";
import { DatabaseConnectionContext } from "@task-bot/core/shared/infrastructure/db-pool";
import {
  SessionEntity,
  SessionEntitySchema,
} from "@task-bot/core/user/domain/session.entity";
import { SessionRepository } from "@task-bot/core/user/domain/session.repository";
import { sql } from "slonik";

export class PostgresSessionRepository
  extends BasePostgresCommandRepository<SessionEntity>
  implements SessionRepository
{
  constructor(protected readonly db = DatabaseConnectionContext.use) {
    super("sessions");
  }

  async save(): Promise<void> {
    using segment = addSegment(
      "repository",
      `${this.tableName}.${this.save.name}`,
    );
    await segment.try(() =>
      Promise.all(
        this.entities.map(({ entity, operation }) => {
          return this.saveOne(entity, operation);
        }),
      ),
    );
  }

  async findOne(
    props: Pick<SessionEntitySchema, "id" | "userId">,
  ): Promise<SessionEntity> {
    using segment = addSegment(
      "repository",
      `${this.tableName}.${this.save.name}`,
    );

    return await segment.try(async () => {
      const conn = await this.db().get();
      const result = await conn.one(
        sql.type(
          SessionEntitySchema,
        )`SELECT * FROM ${sql.identifier([this.tableName])} where id = ${props.id} AND user_id = ${props.userId}`,
      );
      return new SessionEntity(result);
    });
  }
}

export const withPostgresSessionRepository = SessionRepository.with(
  new PostgresSessionRepository(),
);
