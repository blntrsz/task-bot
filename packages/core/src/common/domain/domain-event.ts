export class DomainEvent {
  private name: string;
  private version: number;
  private data: object;
  private metadata?: object;

  constructor({
    name,
    version,
    data,
    metadata,
  }: {
    name: string;
    version: number;
    data: object;
    metadata?: object;
  }) {
    this.name = name;
    this.version = version;
    this.data = data;
    this.metadata = metadata;
  }

  get detailType() {
    return `${this.name}:${this.version}`;
  }

  get detail() {
    return {
      data: this.data,
      metadata: this.metadata,
    };
  }
}
