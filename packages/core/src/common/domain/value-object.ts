import { z, ZodTypeAny } from "zod";
import { ValidationException } from "./exception";

export abstract class ValueObject<TSchema extends ZodTypeAny> {
  abstract data: z.infer<TSchema>;
  abstract schema: TSchema;
  abstract isEqual(valueObject: ValueObject<TSchema>): boolean;

  validate() {
    const parsed = this.schema.safeParse(this.data);

    if (!parsed.success) throw new ValidationException(parsed.error);
  }
}
