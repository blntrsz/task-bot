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

export const exceptionCodes = {
  validation: "exception.validation",
  notFound: "exception.not_found",
  unauthorized: "exception.unauthorized",
  exists: "exception.exists",
};

export class ValidationException<T> extends Exception {
  constructor(zodError: z.ZodError<T>) {
    super(exceptionCodes.validation, zodError.message);
  }
}

export class NotFoundException extends Exception {
  constructor() {
    super(exceptionCodes.notFound, "Entity not found");
  }
}

export class UnauthorizedException extends Exception {
  constructor() {
    super(exceptionCodes.unauthorized, "Unauthorized");
  }
}

export class AlreadyExistException extends Exception {
  constructor() {
    super(exceptionCodes.exists, "Entity already exists.");
  }
}

export const ExceptionCodeToStatus = {
  [exceptionCodes.validation]: 400,
  [exceptionCodes.notFound]: 404,
  [exceptionCodes.unauthorized]: 401,
};

export function exceptionToResponse(exception: Exception) {
  return {
    json: {
      errors: [
        {
          message: exception.message,
        },
      ],
    },
    status: ExceptionCodeToStatus[exception.code],
  };
}
