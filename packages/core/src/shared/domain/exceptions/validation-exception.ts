import { z } from "zod";
import { Exception } from "./exception";
import { ExceptionCode } from "./exception-to-response";

export class ValidationException extends Exception {
  issues: z.ZodIssue[];

  constructor(zodError: z.ZodError<string>) {
    super("Validation Error", ExceptionCode.VALIDATION);
    this.issues = zodError.issues;
  }
}
