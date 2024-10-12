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
  TaskRepositoryQuerySchema,
} from "@task-bot/core/task/domain/task.repository";
import { sql } from "slonik";

export class PostgresTaskRepository
  extends BasePostgresCommandRepository<TaskEntity>
  implements TaskRepository
{
  constructor(protected readonly db = DatabaseConnectionContext.use) {
    super("tasks", db);
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
          TaskRepositoryQuerySchema,
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
      const tasks = await conn.many(
        sql.type(TaskRepositoryQuerySchema)`
        SELECT * FROM ${sql.identifier([this.tableName])} 
        OFFSET ${options.pageNumber * options.pageSize} 
        LIMIT ${options.pageSize + 1}
      `,
      );
      return {
        data: tasks
          .slice(0, options.pageSize)
          .map((task) => new TaskEntity(task)),
        pageSize: options.pageSize,
        pageNumber: options.pageNumber,
        hasNextPage: tasks.length > options.pageSize,
      };
    });
  }
}

export const withPostgresTaskRepository = TaskRepository.with(
  new PostgresTaskRepository(),
);
