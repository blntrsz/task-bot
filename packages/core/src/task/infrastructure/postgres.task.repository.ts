import { addSegment } from "@task-bot/core/shared/domain/observability";
import { BasePostgresCommandRepository } from "@task-bot/core/shared/infrastructure/base-postgres-command.repository";
import { DatabaseConnectionContext } from "@task-bot/core/shared/infrastructure/db-pool";
import {
  TaskEntitySchema,
  TaskEntity,
} from "@task-bot/core/task/domain/task.entity";
import {
  Paginated,
  PaginatedOptions,
  TaskRepository,
} from "@task-bot/core/task/domain/task.repository";
import { sql } from "slonik";

export class PostgresTaskRepository
  extends BasePostgresCommandRepository<TaskEntity>
  implements TaskRepository
{
  constructor(protected readonly db = DatabaseConnectionContext.use) {
    super("tasks");
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

  async findOne(props: Pick<TaskEntitySchema, "id">): Promise<TaskEntity> {
    using segment = addSegment(
      "repository",
      `${this.tableName}.${this.findOne.name}`,
    );
    return await segment.try(async () => {
      const conn = await this.db().get();
      const result = await conn.one(
        sql.type(
          TaskEntitySchema,
        )`SELECT * FROM ${sql.identifier([this.tableName])} where id = ${props.id}`,
      );
      return new TaskEntity(result);
    });
  }

  async list(options: PaginatedOptions): Promise<Paginated<TaskEntity>> {
    using segment = addSegment(
      "repository",
      `${this.tableName}.${this.list.name}`,
    );
    return await segment.try(async () => {
      const conn = await this.db().get();
      const tasks = await conn.query(
        sql.type(TaskEntitySchema)`
        SELECT * FROM ${sql.identifier([this.tableName])} 
        OFFSET ${(options.pageNumber - 1) * options.pageSize} 
        LIMIT ${options.pageSize + 1}
      `,
      );
      return {
        data: tasks.rows
          .slice(0, options.pageSize)
          .map((task) => new TaskEntity(task)),
        pageSize: options.pageSize,
        pageNumber: options.pageNumber,
        hasNextPage: tasks.rowCount > options.pageSize,
      };
    });
  }
}

export const withPostgresTaskRepository = TaskRepository.with(
  new PostgresTaskRepository(),
);
