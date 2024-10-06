import { z } from "@hono/zod-openapi";

export type SessionSchema = z.infer<typeof SessionSchema>;
export const SessionSchema = z.object({
  session: z.string().openapi({
    description: "The session identifier of the logged in User.",
  }),
  expireAt: z.date().openapi({
    description: "The expiration date of the current logged in User's session.",
  }),
  userId: z.string().openapi({
    description: "The identifier of the current User.",
  }),
  createdAt: z.date().openapi({
    description:
      "The creation date of the session. It represents the time when the User logged in.",
  }),
});
