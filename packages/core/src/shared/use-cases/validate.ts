import { ZodTypeAny } from "zod";

export function Validate(schema: ZodTypeAny) {
  return function (
    _target: Object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (input: unknown) {
      const parsed = schema.safeParse(input);
      // TODO validationexception
      if (!parsed.success) throw new Error();

      return originalMethod.apply(this, [parsed.data]);
    };

    return descriptor;
  };
}
