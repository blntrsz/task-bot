import { createContext } from "#common/context";
import { BaseRepository } from "#common/domain/base-repository";
import { TaskEntity } from "./task.entity";

export interface TaskRepository extends BaseRepository<TaskEntity> {
  findOne(id: string): Promise<TaskEntity>;
  save(): Promise<void>;
  list(): Promise<TaskEntity[]>;
  remove(task: TaskEntity): Promise<void>;
}

export const TaskRepositoryContext = createContext<TaskRepository>();
export const useTaskRepository = TaskRepositoryContext.use;
