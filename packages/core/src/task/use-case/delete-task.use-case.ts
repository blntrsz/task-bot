import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { Observe } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Validate } from "@task-bot/core/shared/use-cases/validate";
import { TaskDeletedDomainEvent } from "@task-bot/core/task/domain/events/task-deleted.event";
import { TaskEntitySchema } from "@task-bot/core/task/domain/task.entity";
import { TaskRepository } from "@task-bot/core/task/domain/task.repository";
import { z } from "zod";

const Input = TaskEntitySchema.pick({
  id: true,
});
type Input = z.infer<typeof Input>;

export class DeleteTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepository.use(),
    private readonly unitOfWork = UnitOfWork.use(),
    private readonly eventEmitter = EventEmitter.use(),
  ) {}

  @Observe("use-case")
  @Validate(Input)
  async execute(_input: Input) {
    const input = Input.parse(_input);

    const task = await this.taskRepository.findOne({ id: input.id });

    this.eventEmitter.add(TaskDeletedDomainEvent.create(task));
    this.taskRepository.add(task, "delete");

    await this.unitOfWork.save([this.taskRepository], this.eventEmitter);

    return task;
  }
}
