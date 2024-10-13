import { EventEmitter } from "@task-bot/core/shared/domain/event-emitter";
import { addUseCaseSegment } from "@task-bot/core/shared/domain/observability";
import { UnitOfWork } from "@task-bot/core/shared/domain/unit-of-work";
import { UserRepository } from "@task-bot/core/user/domain/user.repository";
import { z } from "zod";
import { SessionRepository } from "@task-bot/core/user/domain/session.repository";
import { Guard } from "@task-bot/core/shared/use-cases/guard";
import { SessionEntitySchema } from "../domain/session.entity";

const Input = SessionEntitySchema.pick({
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

  async execute(input: Input) {
    Guard.assertSchema(Input, input);
    using segment = addUseCaseSegment(this);

    const result = await segment.try(async () => {
      const session = await this.sessionRepository.findOne(input);

      // TODO
      // this.eventEmitter.add(UserCreatedDomainEvent.create(user));
      this.sessionRepository.add(session, "delete");

      await this.unitOfWork.save([this.userRepository], this.eventEmitter);
    });

    return result;
  }
}
