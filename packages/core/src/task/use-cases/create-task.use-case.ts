import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { TaskEntity } from "#task/domain/task.entity";
import { useTaskRepository } from "#task/domain/task.repository";
import { TaskSchema } from "@task-bot/shared/task.types";
import { z } from "zod";

const schema = TaskSchema.pick({ name: true });
type Input = z.infer<typeof schema>;

export class CreateTaskUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const taskRepository = useTaskRepository();
    const eventEmitter = useEventEmitter();

    const task = TaskEntity.create({
      name: input.name,
    });

    taskRepository.add(task);
    await taskRepository.save();
    await eventEmitter.emit(taskRepository.popAll());

    return task;
  }
}
