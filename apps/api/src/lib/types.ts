import { z } from "@hono/zod-openapi";

export function Response<TSchema extends z.ZodTypeAny>(
  responseSchema: TSchema,
) {
  return {
    "application/json": {
      schema: z.object({
        data: responseSchema,
      }),
    },
  };
}
