import { taskSchema } from "#domain/entities/task.entity";
import { useTaskRepository } from "#domain/repositories/task.repository";
import { useCase } from "#use-cases/common/use-case";

export const findOneTaskUseCase = useCase("findOneTaskUseCase")(
  taskSchema.pick({ id: true }),
)(({ id }) => useTaskRepository().findOne(id));
