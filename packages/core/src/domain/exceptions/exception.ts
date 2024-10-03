import { z } from "zod";

export class Exception extends Error {
  code: string;
  message: string;

  constructor(code: string, message: string) {
    super();

    this.code = code;
    this.message = message;
  }
}

export class ValidationException<T> extends Exception {
  constructor(zodError: z.ZodError<T>) {
    super("exception.validation", zodError.message);
  }
}

export class NotFoundException extends Exception {
  constructor() {
    super("exception.not_found", "Entity not found");
  }
}
