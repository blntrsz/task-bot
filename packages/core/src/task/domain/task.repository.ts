import { createContext } from "#common/context";
import { TaskEntity } from "./task.entity";

export interface TaskRepository {
  add(entity: TaskEntity): void;
  popAll(): TaskEntity[];

  findOne(id: string): Promise<TaskEntity>;
  save(): Promise<void>;
  list(): Promise<TaskEntity[]>;
}

export const TaskRepositoryContext = createContext<TaskRepository>();
export const useTaskRepository = TaskRepositoryContext.use;
