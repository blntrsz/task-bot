import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { TaskEntity, taskSchema } from "#task/domain/task.entity";
import { useTaskRepository } from "#task/domain/task.repository";
import { z } from "zod";

const schema = taskSchema.pick({ name: true });
type Input = z.infer<typeof schema>;

export class CreateTaskUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const task = TaskEntity.create({
      name: input.name,
    });

    await useTaskRepository().createOne(task);
    await useEventEmitter().emit(task.consumeEvents());

    return task;
  }
}
