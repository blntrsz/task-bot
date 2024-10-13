import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { addUseCaseSegment } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Guard } from "@task-bot/core/shared/use-cases/guard";
import { UserEntitySchema } from "@task-bot/core/user/domain/user.entity";
import { UserRepository } from "@task-bot/core/user/domain/user.repository";
import { z } from "zod";

const Input = UserEntitySchema.pick({
  id: true,
});
type Input = z.infer<typeof Input>;

export class DeleteUserUseCase {
  constructor(
    private readonly userRepository = UserRepository.use(),
    private readonly unitOfWork = UnitOfWork.use(),
    private readonly eventEmitter = EventEmitter.use(),
  ) {}

  async execute(input: Input) {
    Guard.withSchema(Input, input);
    using segment = addUseCaseSegment(this);

    const result = await segment.try(async () => {
      const user = await this.userRepository.findOne(input);

      // TODO
      // this.eventEmitter.add(UserCreatedDomainEvent.create(user));
      this.userRepository.add(user, "delete");

      await this.unitOfWork.save([this.userRepository], this.eventEmitter);

      return user;
    });

    return result;
  }
}
