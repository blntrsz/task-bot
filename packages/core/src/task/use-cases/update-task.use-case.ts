import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { useTaskRepository } from "#task/domain/task.repository";
import { TaskSchema } from "@task-bot/shared/task.types";
import { z } from "zod";

const schema = TaskSchema.pick({ name: true, status: true })
  .partial({})
  .extend({
    id: z.string(),
  })
  .refine((data) => data.status || data.name, {
    message: "At least one property is needed for update",
  });
type Input = z.infer<typeof schema>;

export class UpdateTaskUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const taskRepository = useTaskRepository();
    const eventEmitter = useEventEmitter();

    const task = await taskRepository.findOne(input.id);
    taskRepository.add(task);

    if (input.name) {
      task.setName(input.name);
    }

    if (input.status) {
      task.setName(input.status);
    }

    await taskRepository.save();
    await eventEmitter.emit(taskRepository.popAll());

    return task;
  }
}
