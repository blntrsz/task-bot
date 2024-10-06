import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { useTaskRepository } from "#task/domain/task.repository";
import { TaskSchema } from "@task-bot/shared/task.types";
import { z } from "zod";

const schema = TaskSchema.pick({ id: true });
type Input = z.infer<typeof schema>;

export class DeleteTaskUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const taskRepository = useTaskRepository();
    const eventEmitter = useEventEmitter();

    const task = await taskRepository.findOne(input.id);
    task.delete();

    await taskRepository.remove(task);
    await eventEmitter.emit(taskRepository.popAll());

    return task;
  }
}
