import { z } from "@hono/zod-openapi";

export const UPDATED_AT_DESCRIPTION = "Last updated date of the Entity.";
export const CREATED_AT_DESCRIPTION = "Creation date of the Entity.";

export type BaseEntitySchema = z.infer<typeof BaseEntitySchema>;
export const BaseEntitySchema = z.object({
  id: z.string().openapi({
    description: "The identifier of the resource.",
  }),
  createdAt: z.date().openapi({
    description: CREATED_AT_DESCRIPTION,
  }),
  updatedAt: z.date().openapi({
    description: UPDATED_AT_DESCRIPTION,
  }),
});

export function BaseResponse<
  TType extends string,
  TAttributed extends z.AnyZodObject,
>(type: TType, attributes: TAttributed) {
  return z.object({
    id: z.string(),
    type: z.literal(type).openapi({
      description: "The identifier type of the resource.",
    }),
    attributes: z
      .object({
        created_at: z.string().openapi({ description: CREATED_AT_DESCRIPTION }),
        updated_at: z.string().openapi({ description: UPDATED_AT_DESCRIPTION }),
      })
      .merge(attributes),
  });
}
