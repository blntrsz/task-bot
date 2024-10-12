import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { Observe } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Validate } from "@task-bot/core/shared/use-cases/validate";
import {
  Password,
  UserEntitySchema,
} from "@task-bot/core/user/domain/user.entity";
import { UserRepository } from "@task-bot/core/user/domain/user.repository";
import { z } from "zod";
import { PasswordValueObject } from "@task-bot/core/user/domain/password.value-object";
import { SessionRepository } from "@task-bot/core/user/domain/session.repository";
import { SessionEntity } from "../domain/session.entity";

const Input = UserEntitySchema.pick({
  email: true,
}).merge(Password);
type Input = z.infer<typeof Input>;

export class LoginUserUseCase {
  constructor(
    private readonly userRepository = UserRepository.use(),
    private readonly sessionRepository = SessionRepository.use(),
    private readonly unitOfWork = UnitOfWork.use(),
    private readonly eventEmitter = EventEmitter.use(),
  ) {}

  @Observe("use-case")
  @Validate(Input)
  async execute(input: Input) {
    const user = await this.userRepository.findByEmail(input);

    user.props.password.equals(PasswordValueObject.create(input));
    const session = SessionEntity.create({
      userId: user.props.id,
    });

    // TODO
    // this.eventEmitter.add(UserCreatedDomainEvent.create(user));
    this.userRepository.add(user, "create");
    this.sessionRepository.add(session, "create");

    await this.unitOfWork.save([this.userRepository], this.eventEmitter);

    return user;
  }
}
