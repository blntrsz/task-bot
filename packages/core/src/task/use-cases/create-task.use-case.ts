import { Err, Ok } from "../../common/result";
import { useCase } from "../../common/use-case";
import { Task, taskSchema } from "../domain/task.entity";
import { useTaskRepository } from "../domain/task.repository";

export const createTaskUseCase = useCase("createTaskUseCase")(
  taskSchema.pick({
    name: true,
  }),
)(async ({ name }) => {
  const [err, task] = Task.create({
    name,
  });
  if (err) return Err(err);

  await useTaskRepository().createOne(task);

  return Ok(task);
});
