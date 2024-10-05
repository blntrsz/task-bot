import { BaseRepository } from "#common/domain/base-repository";
import { useContainer } from "#common/domain/container";
import { TaskEntity } from "./task.entity";

export const TASK_REPOSITORY_DI_TOKEN = "task-repository-di-token";
export interface TaskRepository extends BaseRepository<TaskEntity> {
  findOne(id: string): Promise<TaskEntity>;
  save(): Promise<void>;
  list(): Promise<TaskEntity[]>;
  remove(task: TaskEntity): Promise<void>;
}

export const useTaskRepository = () =>
  useContainer<TaskRepository>(TASK_REPOSITORY_DI_TOKEN);
