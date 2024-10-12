import { ZodTypeAny } from "zod";

export namespace Guard {
  export function withSchema(schema: ZodTypeAny, input: unknown) {
    schema.parse(input);
  }
}
