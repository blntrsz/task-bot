import { z } from "@hono/zod-openapi";
import { CREATED_AT_DESCRIPTION, UPDATED_AT_DESCRIPTION } from "./base.types";

export type PasswordSchema = z.infer<typeof PasswordSchema>;
export const PasswordSchema = z.object({
  userId: z.string().openapi({
    description: "The ID of the User.",
  }),
  hash: z.string().openapi({
    description: "The hash which is generated from the password.",
  }),
  createdAt: z.date().openapi({ description: CREATED_AT_DESCRIPTION }),
  updatedAt: z.date().openapi({ description: UPDATED_AT_DESCRIPTION }),
});

export const CreatePasswordSchema = z.object({
  password: z.string().min(8).openapi({
    description: "The User's password. Minimum 8 characters.",
  }),
});
