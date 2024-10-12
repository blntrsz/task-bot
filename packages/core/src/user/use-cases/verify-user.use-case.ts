import { Observe } from "@task-bot/core/shared/domain/observability";
import { Validate } from "@task-bot/core/shared/use-cases/validate";
import { UserEntitySchema } from "@task-bot/core/user/domain/user.entity";
import { z } from "zod";
import { SessionRepository } from "@task-bot/core/user/domain/session.repository";

const Input = UserEntitySchema.pick({
  id: true,
});
type Input = z.infer<typeof Input>;

export class VerifyUserUseCase {
  constructor(private readonly sessionRepository = SessionRepository.use()) {}

  @Observe("use-case")
  @Validate(Input)
  async execute(input: Input) {
    // TODO: find by user id
    const session = await this.sessionRepository.findOne(input);

    return session;
  }
}
