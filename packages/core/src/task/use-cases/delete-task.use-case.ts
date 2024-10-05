import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { taskSchema } from "#task/domain/task.entity";
import { useTaskRepository } from "#task/domain/task.repository";
import { z } from "zod";

const schema = taskSchema.pick({ id: true });
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
