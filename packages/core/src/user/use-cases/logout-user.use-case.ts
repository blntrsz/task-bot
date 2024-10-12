import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { Observe } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { Validate } from "@task-bot/core/shared/use-cases/validate";
import { UserEntitySchema } from "@task-bot/core/user/domain/user.entity";
import { UserRepository } from "@task-bot/core/user/domain/user.repository";
import { z } from "zod";
import { SessionRepository } from "@task-bot/core/user/domain/session.repository";

const Input = UserEntitySchema.pick({
  id: true,
});
type Input = z.infer<typeof Input>;

export class LogoutUserUseCase {
  constructor(
    private readonly userRepository = UserRepository.use(),
    private readonly sessionRepository = SessionRepository.use(),
    private readonly unitOfWork = UnitOfWork.use(),
    private readonly eventEmitter = EventEmitter.use(),
  ) {}

  @Observe("use-case")
  @Validate(Input)
  async execute(input: Input) {
    // TODO: find by user id
    const session = await this.sessionRepository.findOne(input);

    // TODO
    // this.eventEmitter.add(UserCreatedDomainEvent.create(user));
    this.sessionRepository.add(session, "create");

    await this.unitOfWork.save([this.userRepository], this.eventEmitter);
  }
}
