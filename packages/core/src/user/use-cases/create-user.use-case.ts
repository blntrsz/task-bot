import {
  AlreadyExistException,
  NotFoundException,
} from "#common/domain/exception";
import { useEventEmitter } from "#common/domain/services/event-emitter";
import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { UserEntity } from "#user/domain/user.entity";
import { useUserRepository } from "#user/domain/user.repository";
import { UserSchema } from "@task-bot/shared/user.types";
import { z } from "zod";

const schema = UserSchema.pick({
  email: true,
}).extend({
  password: z.string(),
});
type Input = z.infer<typeof schema>;

export class CreateUserUseCase {
  @Observe("use-case")
  @Validate(schema)
  async execute(input: Input) {
    const eventEmitter = useEventEmitter();
    const userRepository = useUserRepository();

    const existingUser = await userRepository
      .findOneByEmail(input.email)
      .catch((error) => !(error instanceof NotFoundException));

    if (existingUser) throw new AlreadyExistException();

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
