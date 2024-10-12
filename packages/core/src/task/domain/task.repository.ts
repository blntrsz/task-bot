import { z } from "zod";
import { TaskEntity, TaskEntitySchema } from "./task.entity";
import { BaseRepository } from "@task-bot/core/shared/domain/base-repository";
import { objectToCamelCase } from "@task-bot/core/shared/infrastructure/util";
import { createContext } from "@task-bot/core/shared/contex";

export type PaginatedOptions = {
  pageNumber: number;
  pageSize: number;
};

export type Paginated<T> = {
  data: T[];
  hasNextPage: boolean;
} & PaginatedOptions;

export interface TaskRepository extends BaseRepository<TaskEntity> {
  findOne(props: Pick<TaskEntitySchema, "id">): Promise<TaskEntity>;
  list(options: PaginatedOptions): Promise<Paginated<TaskEntity>>;
}

export const TaskRepository = createContext<TaskRepository>();

export const TaskRepositoryQuerySchema = z.preprocess(
  objectToCamelCase,
  TaskEntitySchema,
);
