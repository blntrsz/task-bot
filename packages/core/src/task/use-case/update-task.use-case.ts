import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { addUseCaseSegment } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Guard } from "@task-bot/core/shared/use-cases/guard";
import { TaskDescriptionUpdatedDomainEvent } from "@task-bot/core/task/domain/events/task-description-updated.event";
import { TaskStatusUpdatedDomainEvent } from "@task-bot/core/task/domain/events/task-status-updated.event";
import { TaskTitleUpdatedDomainEvent } from "@task-bot/core/task/domain/events/task-title-updated.event";
import { TaskEntitySchema } from "@task-bot/core/task/domain/task.entity";
import { TaskRepository } from "@task-bot/core/task/domain/task.repository";
import { z } from "zod";

const Input = TaskEntitySchema.pick({
  id: true,
  title: true,
  description: true,
  status: true,
})
  .partial({ title: true, description: true, status: true })
  .refine(
    (val) => {
      return val.description || val.title || val.status;
    },
    { message: "At least one property should be updated." },
  );
type Input = z.infer<typeof Input>;

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepository.use(),
    private readonly unitOfWork = UnitOfWork.use(),
    private readonly eventEmitter = EventEmitter.use(),
  ) {}

  async execute(input: Input) {
    Guard.withSchema(Input, input);
    using segment = addUseCaseSegment(this);

    const result = await segment.try(async () => {
      let task = await this.taskRepository.findOne({ id: input.id });

      if (input.title) {
        task = task.fork({
          title: input.title,
        });
        this.eventEmitter.add(TaskTitleUpdatedDomainEvent.create(task));
      }

      if (input.description) {
        task = task.fork({
          description: input.description,
        });
        this.eventEmitter.add(TaskDescriptionUpdatedDomainEvent.create(task));
      }

      if (input.status) {
        task = task.fork({
          status: input.status,
        });
        this.eventEmitter.add(TaskStatusUpdatedDomainEvent.create(task));
      }

      this.taskRepository.add(task, "update");

      await this.unitOfWork.save([this.taskRepository], this.eventEmitter);

      return task;
    });

    return result;
  }
}
