import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { addSegment } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Guard } from "@task-bot/core/shared/use-cases/guard";
import { UserCreatedDomainEvent } from "@task-bot/core/user/domain/events/user-created.event";
import {
  Password,
  UserEntity,
  UserEntitySchema,
} from "@task-bot/core/user/domain/user.entity";
import { UserRepository } from "@task-bot/core/user/domain/user.repository";
import { z } from "zod";

const Input = UserEntitySchema.pick({
  email: true,
}).merge(Password);
type Input = z.infer<typeof Input>;

export class CreateUserUseCase {
  constructor(
    private readonly userRepository = UserRepository.use(),
    private readonly unitOfWork = UnitOfWork.use(),
    private readonly eventEmitter = EventEmitter.use(),
  ) {}

  async execute(input: Input) {
    Guard.withSchema(Input, input);
    using segment = addSegment("use-case", CreateUserUseCase.name);
    const user = UserEntity.create(input);

    this.eventEmitter.add(UserCreatedDomainEvent.create(user));
    this.userRepository.add(user, "create");

    await segment.try(() =>
      this.unitOfWork.save([this.userRepository], this.eventEmitter),
    );

    return user;
  }
}
