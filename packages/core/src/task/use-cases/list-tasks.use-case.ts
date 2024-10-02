import { useCase } from "../../common/use-case";
import { useTaskRepository } from "../domain/task.repository";

export const listTasksUseCase = useCase("listTasksUseCase")()(() =>
  useTaskRepository().list(),
);
