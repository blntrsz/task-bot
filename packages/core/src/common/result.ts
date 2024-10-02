export type Ok<T> = [undefined, T];
export function Ok<T>(data: T): Ok<T> {
  return [undefined, data] as const;
}
export type Err<T> = [T, undefined];
export function Err<T>(error: T): Err<T> {
  return [error, undefined] as const;
}
