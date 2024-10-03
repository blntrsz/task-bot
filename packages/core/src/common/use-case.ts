import { z, ZodTypeAny } from "zod";
import { createSegment, ObservabilityResources } from "./observability";
import { ValidationError } from "./domain-error";

export function useCase(useCaseName: string) {
  return function <TSchema extends ZodTypeAny>(schema?: TSchema) {
    return function <T>(
      cb: (
        input: z.infer<TSchema>,
        props: ObservabilityResources,
      ) => Promise<T>,
    ) {
      return function (input: z.infer<TSchema>) {
        return createSegment(
          "useCaseName",
          useCaseName,
        )(async (props) => {
          const parsedInput = schema?.safeParse(input);
          if (parsedInput && !parsedInput.success) {
            throw new ValidationError(parsedInput.error);
          }

          return await cb(parsedInput?.data, props);
        });
      };
    };
  };
}
