import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { UserEntity, userSchema } from "#user/domain/user.entity";
import { useUserRepository } from "#user/domain/user.repository";
import { z } from "zod";

const schema = userSchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string(),
  });
type Input = z.infer<typeof schema>;

export class CreateUserUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const eventEmitter = useEventEmitter();
    const userRepository = useUserRepository();

    const user = UserEntity.create({
      email: input.email,
      password: input.password,
    });

    userRepository.add(user);
    await userRepository.save();
    await eventEmitter.emit(userRepository.popAll());

    return user;
  }
}
