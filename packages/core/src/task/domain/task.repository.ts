import { createContext } from "../../common/context";
import { TaskEntity, TaskSchema } from "./task.entity";

export interface TaskRepository {
  findOne(id: TaskSchema["id"]): Promise<TaskEntity>;
  createOne(task: TaskEntity): Promise<void>;
  list(): Promise<TaskEntity[]>;
}

export const TaskRepositoryContext = createContext<TaskRepository>();
export const useTaskRepository = TaskRepositoryContext.use;
