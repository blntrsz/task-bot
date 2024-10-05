import { z, ZodTypeAny } from "zod";
import { ValidationException } from "./exception";

export abstract class ValueObject<TSchema extends ZodTypeAny> {
  protected props: z.infer<TSchema>;
  abstract schema: TSchema;
  abstract isEqual(valueObject: ValueObject<TSchema>): boolean;
  constructor(props: z.infer<TSchema>) {
    this.props = props;
  }

  validate() {
    const parsed = this.schema.safeParse(this.props);

    if (!parsed.success) throw new ValidationException(parsed.error);
  }

  getProps() {
    const propsCopy = {
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }
}
