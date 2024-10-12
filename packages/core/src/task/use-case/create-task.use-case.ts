import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { Observe } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Validate } from "@task-bot/core/shared/use-cases/validate";
import { TaskCreatedDomainEvent } from "@task-bot/core/task/domain/events/task-created.event";
import { TaskEntity, TaskEntitySchema } from "@task-bot/core/task/domain/task.entity";
import { TaskRepository } from "@task-bot/core/task/domain/task.repository";
import { z } from "zod";

const Input = TaskEntitySchema.pick({
  title: true,
  description: true,
});
type Input = z.infer<typeof Input>;

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepository.use(),
    private readonly unitOfWork = UnitOfWork.use(),
    private readonly eventEmitter = EventEmitter.use(),
  ) {}

  @Observe("use-case")
  @Validate(Input)
  async execute(input: Input) {
    const task = TaskEntity.create({
      title: input.title,
      description: input.description,
    });

    this.eventEmitter.add(TaskCreatedDomainEvent.create(task));
    this.taskRepository.add(task, "create");

    await this.unitOfWork.save([this.taskRepository], this.eventEmitter);

    return task;
  }
}
