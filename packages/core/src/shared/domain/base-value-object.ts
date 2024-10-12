import { z, ZodTypeAny } from "zod";

export abstract class BaseValueObject<TSchema extends ZodTypeAny> {
  readonly props: Readonly<z.infer<TSchema>>;
  readonly updated: Readonly<Partial<z.infer<TSchema>>>;

  constructor(props: z.infer<TSchema>, updated?: Partial<z.infer<TSchema>>) {
    this.props = Object.freeze(props);
    this.updated = Object.freeze(updated ?? {});
  }
}
