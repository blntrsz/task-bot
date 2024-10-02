import { useCase } from "../../common/use-case";
import { taskSchema } from "../domain/task.entity";
import { useTaskRepository } from "../domain/task.repository";

export const findOneTaskUseCase = useCase("findOneTaskUseCase")(
  taskSchema.pick({ id: true }),
)(({ id }) => useTaskRepository().findOne(id));
