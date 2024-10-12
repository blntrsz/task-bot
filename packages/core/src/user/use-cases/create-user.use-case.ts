import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { Observe } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Validate } from "@task-bot/core/shared/use-cases/validate";
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

  @Observe("use-case")
  @Validate(Input)
  async execute(input: Input) {
    const user = UserEntity.create(input);

    this.eventEmitter.add(UserCreatedDomainEvent.create(user));
    this.userRepository.add(user, "create");

    await this.unitOfWork.save([this.userRepository], this.eventEmitter);

    return user;
  }
}
