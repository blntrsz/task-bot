import { Observe } from "#common/domain/services/observability";
import { Validate } from "#common/use-cases/validate";
import { taskSchema } from "#task/domain/task.entity";
import { useTaskRepository } from "#task/domain/task.repository";
import { z } from "zod";

const schema = taskSchema.pick({ id: true });
type Input = z.infer<typeof schema>;

export class FindOneTaskUseCase {
  @Observe("use-case")
  @Validate(schema)
  execute(input: Input) {
    return useTaskRepository().findOne(input.id);
  }
}
