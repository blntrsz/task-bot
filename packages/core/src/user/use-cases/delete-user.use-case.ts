import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { useUserRepository } from "#user/domain/user.repository";
import { SessionSchema } from "@task-bot/shared/session.types";
import { UserSchema } from "@task-bot/shared/user.types";
import { z } from "zod";

const schema = UserSchema.pick({
  id: true,
}).merge(
  SessionSchema.pick({
    session: true,
  }),
);
type Input = z.infer<typeof schema>;

export class DeleteUserUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const eventEmitter = useEventEmitter();
    const userRepository = useUserRepository();

    const user = await userRepository.findOne(input.id, input.session);

    user.assertLoggedIn();

    await userRepository.remove(user);
    await eventEmitter.emit(userRepository.popAll());

    return user;
  }
}
