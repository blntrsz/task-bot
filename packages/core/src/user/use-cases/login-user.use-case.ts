import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { addUseCaseSegment } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import {
  Password,
  UserEntitySchema,
} from "@task-bot/core/user/domain/user.entity";
import { UserRepository } from "@task-bot/core/user/domain/user.repository";
import { z } from "zod";
import { PasswordValueObject } from "@task-bot/core/user/domain/password.value-object";
import { SessionRepository } from "@task-bot/core/user/domain/session.repository";
import { SessionEntity } from "../domain/session.entity";
import { Guard } from "@task-bot/core/shared/use-cases/guard";

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

  async execute(input: Input) {
    Guard.assertSchema(Input, input);
    using segment = addUseCaseSegment(this);

    const result = await segment.try(async () => {
      const user = await this.userRepository.findByEmail(input);

      user.password.equals(PasswordValueObject.create(input));
      const session = SessionEntity.create({
        userId: user.props.id,
      });

      // TODO
      // this.eventEmitter.add(UserCreatedDomainEvent.create(user));
      this.sessionRepository.add(session, "create");

      await this.unitOfWork.save([this.sessionRepository], this.eventEmitter);

      return { user, session };
    });

    return result;
  }
}
