export interface DomainEvent<TData extends Object, TMetadata extends Object> {
  name: `${string}:${number}`;
  data: TData;
  metadata?: TMetadata;
}
