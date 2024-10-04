import { ZodTypeAny } from "zod";

export function Validate(schema: ZodTypeAny) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (input: unknown) {
      schema.parse(input);

      // You could also add more specific validation here,
      // for example: checking types, ranges, or custom conditions

      return originalMethod.apply(this, input);
    };

    return descriptor;
  };
}
