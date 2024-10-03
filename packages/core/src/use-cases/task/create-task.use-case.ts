import { TaskEntity, taskSchema } from "#domain/entities/task.entity";
import { useTaskRepository } from "#domain/repositories/task.repository";
import { useCase } from "#use-cases/common/use-case";

export const createTaskUseCase = useCase("createTaskUseCase")(
  taskSchema.pick({
    name: true,
  }),
)(async ({ name }) => {
  const task = TaskEntity.create({
    name,
  });

  await useTaskRepository().createOne(task);

  return task;
});
