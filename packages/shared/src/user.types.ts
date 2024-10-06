import { z } from "@hono/zod-openapi";
import { BaseEntitySchema, BaseResponse } from "./base.types";
import { SessionSchema } from "./session.types";
import { CreatePasswordSchema } from "./password.types";

export type UserSchema = z.infer<typeof UserSchema>;
export const UserSchema = BaseEntitySchema.merge(
  z.object({
    email: z.string().email().openapi({
      description:
        "The User's email address. Should be in `me@mail.com` format.",
    }),
  }),
);

export type UserResponseSchema = z.infer<typeof UserResponseSchema>;
export const UserResponseSchema = BaseResponse(
  "users",
  z.object({
    email: UserSchema.shape.email,
    session: SessionSchema.shape.session.optional(),
  }),
);

export type CreateUserSchema = z.infer<typeof CreateUserSchema>;
export const CreateUserSchema = UserResponseSchema.pick({
  type: true,
}).extend({
  attributes: UserResponseSchema.shape.attributes
    .pick({
      email: true,
    })
    .merge(CreatePasswordSchema),
});

export type UpdateUserSchema = z.infer<typeof UpdateUserSchema>;
export const UpdateUserSchema = UserResponseSchema.pick({
  type: true,
}).extend({
  attributes: UserResponseSchema.shape.attributes
    .pick({
      email: true,
    })
    .merge(CreatePasswordSchema),
});
