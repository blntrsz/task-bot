import { BaseEntity } from "@task-bot/core/shared/domain/base-entity";
import { z } from "zod";
import { UserEntitySchema } from "./user.entity";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

export const SessionEntitySchema = z.object({
  id: z.string().uuid(),
  userId: UserEntitySchema.shape.id,
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});
export type SessionEntitySchema = z.infer<typeof SessionEntitySchema>;

const THIRTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 30;

export class SessionEntity extends BaseEntity<typeof SessionEntitySchema> {
  static create(props: Pick<SessionEntitySchema, "userId">) {
    const now = new Date();
    const token = generateSessionToken();
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    return new SessionEntity({
      id: sessionId,
      userId: props.userId,
      createdAt: now,
      expiresAt: new Date(Date.now() + THIRTY_DAYS_IN_MS),
    });
  }

  isExpired() {
    return Date.now() >= this.props.expiresAt.getTime();
  }
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}
