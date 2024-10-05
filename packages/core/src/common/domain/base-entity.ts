import { z, ZodTypeAny } from "zod";
import { DomainEvent } from "./domain-event";
import { ValidationException } from "./exception";

export const baseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type BaseEntitySchema = z.infer<typeof baseEntitySchema>;

export interface CreateEntityProps<T> extends BaseEntitySchema {
  props: T;
}

export abstract class BaseEntity<TSchema extends ZodTypeAny> {
  protected id: string;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected props: z.infer<TSchema>;

  abstract schema: TSchema;
  domainEvents: DomainEvent[];

  constructor({
    id,
    createdAt,
    updatedAt,
    props,
  }: CreateEntityProps<z.infer<TSchema>>) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.props = props;
    this.domainEvents = [];
  }

  protected addEvent(e: DomainEvent) {
    this.domainEvents.push(e);
  }

  consumeEvents() {
    const copy = [...this.domainEvents];
    this.domainEvents = [];

    return copy;
  }

  getProps() {
    const propsCopy = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  validate() {
    const parsed = this.schema.safeParse(this.props);

    if (!parsed.success) throw new ValidationException(parsed.error);

    const baseParsed = baseEntitySchema.safeParse({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
    if (!baseParsed.success) throw new ValidationException(baseParsed.error);
  }
}
