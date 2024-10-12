import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { addSegment } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Guard } from "@task-bot/core/shared/use-cases/guard";
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

  async execute(input: Input) {
    Guard.withSchema(Input, input);
    using segment = addSegment("use-case", DeleteTaskUseCase.name);

    const task = await segment.try(() =>
      this.taskRepository.findOne({ id: input.id }),
    );

    this.eventEmitter.add(TaskDeletedDomainEvent.create(task));
    this.taskRepository.add(task, "delete");

    await segment.try(() =>
      this.unitOfWork.save([this.taskRepository], this.eventEmitter),
    );

    return task;
  }
}
