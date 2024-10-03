import { useCase } from "../../common/use-case";
import { Task, taskSchema } from "../domain/task.entity";
import { useTaskRepository } from "../domain/task.repository";

export const createTaskUseCase = useCase("createTaskUseCase")(
  taskSchema.pick({
    name: true,
  }),
)(async ({ name }) => {
  const task = Task.create({
    name,
  });

  await useTaskRepository().createOne(task);

  return task;
});
