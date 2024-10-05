import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { taskSchema } from "#task/domain/task.entity";
import { useTaskRepository } from "#task/domain/task.repository";
import { z } from "zod";

const schema = taskSchema
  .pick({ name: true, status: true })
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
