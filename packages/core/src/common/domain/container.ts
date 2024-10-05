import { createContext } from "#common/context";

export class Container {
  private dependencies: Map<string, new () => any>;
  private initiatedDependencies: Map<string, any>;

  constructor() {
    this.dependencies = new Map();
    this.initiatedDependencies = new Map();
  }

  getDependency(key: string) {
    const initiatedDependency = this.initiatedDependencies.get(key);

    if (initiatedDependency) return initiatedDependency;

    const dependency = this.dependencies.get(key);

    if (!dependency) throw new Error(`No dependency with key ${key} found`);

    const instance = new dependency();
    this.initiatedDependencies.set(key, instance);

    return instance;
  }

  addDependency<T>(key: string, value: new () => T) {
    this.dependencies.set(key, value);
  }
}

export const ContainerContext = createContext<Container>();

export function useContainer<T>(key: string): T {
  const container = ContainerContext.use();

  return container.getDependency(key);
}
