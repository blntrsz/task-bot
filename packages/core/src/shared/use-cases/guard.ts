import { ZodTypeAny } from "zod";
import { ValidationException } from "../domain/exceptions/validation-exception";

export namespace Guard {
  export function assertSchema(schema: ZodTypeAny, input: unknown) {
    const result = schema.safeParse(input);
    if (!result.success) throw new ValidationException(result.error);
  }
}
