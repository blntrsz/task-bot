import toSnakeCase from "lodash/snakeCase";

export function entityToResponse<
  TProps extends { id: string },
  TType extends string,
>(props: TProps, type: TType) {
  return {
    id: props.id,
    type,
    attributes: Object.fromEntries(
      Object.entries(props).map(([key, value]) => [
        toSnakeCase(key),
        (value as any) instanceof Date
          ? (value as unknown as Date).toISOString()
          : value,
      ]),
    ),
  };
}
