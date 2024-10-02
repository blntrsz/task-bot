import { createContext } from "../../common/context";
import { NotFoundError } from "../../common/domain-error";
import { Err, Ok } from "../../common/result";
import { TaskSchema, Task } from "./task.entity";

export interface TaskRepository {
  findOne(id: TaskSchema["id"]): Promise<Ok<Task> | Err<NotFoundError>>;
  createOne(task: Task): Promise<void>;
  list(): Promise<Ok<Task[]>>;
}

export const TaskRepositoryContext = createContext<TaskRepository>();
export const useTaskRepository = TaskRepositoryContext.use;
