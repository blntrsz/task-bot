import { addSegment } from "@task-bot/core/shared/domain/observability";
import { z } from "zod";
import { SessionRepository } from "@task-bot/core/user/domain/session.repository";
import { Guard } from "@task-bot/core/shared/use-cases/guard";
import { SessionEntitySchema } from "../domain/session.entity";

const Input = SessionEntitySchema.pick({
  userId: true,
  id: true,
});
type Input = z.infer<typeof Input>;

export class VerifyUserUseCase {
  constructor(private readonly sessionRepository = SessionRepository.use()) {}

  async execute(input: Input) {
    Guard.withSchema(Input, input);
    using segment = addSegment("use-case", VerifyUserUseCase.name);

    const session = await segment.try(() =>
      this.sessionRepository.findOne(input),
    );

    return session;
  }
}
