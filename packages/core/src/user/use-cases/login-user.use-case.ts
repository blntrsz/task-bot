import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { useUserRepository } from "#user/domain/user.repository";
import { UserSchema } from "@task-bot/shared/user.types";
import { z } from "zod";

const schema = UserSchema.pick({
  email: true,
}).extend({
  password: z.string(),
});
type Input = z.infer<typeof schema>;

export class LoginUserUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const eventEmitter = useEventEmitter();
    const userRepository = useUserRepository();

    const user = await userRepository.findOneByEmail(input.email);
    user.login(input.password);

    await userRepository.save();
    await eventEmitter.emit(userRepository.popAll());

    return user;
  }
}
