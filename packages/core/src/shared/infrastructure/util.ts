import toCamelCase from "lodash/camelCase";

export function objectToCamelCase(obj: unknown) {
  const newObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as object)) {
    newObj[toCamelCase(key)] = value;
  }

  return newObj;
}
