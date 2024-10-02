import { z } from "zod";

export class DomainError extends Error {
  code: string;
  message: string;

  constructor(code: string, message: string) {
    super();

    this.code = code;
    this.message = message;
  }
}

export class ValidationError<T> extends DomainError {
  constructor(zodError: z.ZodError<T>) {
    super("error.validation", zodError.message);
  }
}

export class NotFoundError extends DomainError {
  constructor() {
    super("error.not_found", "Entity not found");
  }
}
