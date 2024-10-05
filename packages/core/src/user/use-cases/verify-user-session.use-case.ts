import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { sessionSchema } from "#user/domain/session.value-object";
import { userSchema } from "#user/domain/user.entity";
import { useUserRepository } from "#user/domain/user.repository";
import { z } from "zod";

const schema = userSchema
  .pick({
    id: true,
  })
  .merge(sessionSchema.pick({ session: true }));
type Input = z.infer<typeof schema>;

export class VerifyUserSessionUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const userRepository = useUserRepository();

    const user = await userRepository.findOne(input.id, input.session);
    user.assertLoggedIn();

    return user;
  }
}
