import { ValidationException } from "#domain/exceptions/exception";
import {
  ObservabilityResources,
  useObservability,
} from "#domain/services/observability";
import { z, ZodTypeAny } from "zod";

export function useCase(useCaseName: string) {
  return function <TSchema extends ZodTypeAny>(schema?: TSchema) {
    return function <T>(
      cb: (
        input: z.infer<TSchema>,
        props: ObservabilityResources,
      ) => Promise<T>,
    ) {
      return function (input: z.infer<TSchema>) {
        return useObservability().createSegment(
          "useCaseName",
          useCaseName,
        )(async (props) => {
          const parsedInput = schema?.safeParse(input);
          if (parsedInput && !parsedInput.success) {
            throw new ValidationException(parsedInput.error);
          }

          return await cb(parsedInput?.data, props);
        });
      };
    };
  };
}
