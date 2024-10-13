import { addUseCaseSegment } from "@task-bot/core/shared/domain/observability";
import { z } from "zod";
import { SessionRepository } from "@task-bot/core/user/domain/session.repository";
import { Guard } from "@task-bot/core/shared/use-cases/guard";
import { SessionEntitySchema } from "../domain/session.entity";
import { UserRepository } from "../domain/user.repository";

const Input = SessionEntitySchema.pick({ id: true });
type Input = z.infer<typeof Input>;

export class VerifyUserUseCase {
  constructor(
    private readonly sessionRepository = SessionRepository.use(),
    private readonly userRepository = UserRepository.use(),
  ) {}

  async execute(input: Input) {
    Guard.assertSchema(Input, input);
    using segment = addUseCaseSegment(this);

    const result = await segment.try(async () => {
      const session = await this.sessionRepository.findOne({
        id: input.id,
      });

      const user = await this.userRepository.findOne({
        id: session.props.userId,
      });

      return { session, user };
    });

    return result;
  }
}
