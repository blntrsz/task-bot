import { useTaskRepository } from "#domain/repositories/task.repository";
import { useCase } from "#use-cases/common/use-case";

export const listTasksUseCase = useCase("listTasksUseCase")()(() =>
  useTaskRepository().list(),
);
