/**
 * A simple, type-safe Dependency Injection (DI) container for the DreamAI application.
 * This helps in managing dependencies and achieving Inversion of Control (IoC),
 * making the application more modular, testable, and maintainable.
 */

// A token can be a class constructor or a string/symbol for non-class dependencies.
export type Token<T> = { new (...args: any[]): T } | Function | string | symbol;

type Factory<T> = () => T;

enum Lifetime {
  Singleton, // A single instance is created and shared.
  Transient, // A new instance is created every time it's requested.
}

interface Registration<T> {
  factory: Factory<T>;
  lifetime: Lifetime;
  instance?: T; // For singletons
}

/**
 * The main container for managing dependencies.
 */
export class Container {
  private registry = new Map<Token<any>, Registration<any>>();

  /**
   * Registers a dependency with the container.
   * @param token The token to identify the dependency.
   * @param value The class constructor or factory function.
   * @param lifetime The lifetime of the dependency (Singleton or Transient).
   */
  register<T>(
    token: Token<T>,
    value: { new (...args: any[]): T } | Factory<T>,
    lifetime: Lifetime = Lifetime.Singleton
  ): void {
    let factory: Factory<T>;

    // Check if value is a class constructor
    if (value.prototype) {
      factory = () => new (value as { new (...args: any[]): T })();
    } else {
      factory = value as Factory<T>;
    }

    this.registry.set(token, { factory, lifetime });
  }

  /**
   * Resolves a dependency from the container.
   * @param token The token of the dependency to resolve.
   * @returns An instance of the resolved dependency.
   */
  resolve<T>(token: Token<T>): T {
    const registration = this.registry.get(token);

    if (!registration) {
      // If it's a class, try to auto-register it
      if (typeof token === 'function' && token.prototype) {
        this.register(token, token as { new (): T }, Lifetime.Transient);
        return this.resolve(token);
      }
      throw new Error(`Dependency not found for token: ${token.toString()}`);
    }

    if (registration.lifetime === Lifetime.Singleton) {
      if (!registration.instance) {
        registration.instance = registration.factory();
      }
      return registration.instance;
    }

    // For Transient lifetime, always create a new instance.
    return registration.factory();
  }

  /**
   * Clears all registered dependencies.
   */
  clear(): void {
    this.registry.clear();
  }
}

// --- Singleton Instance ---

let globalContainer: Container | null = null;

export function getGlobalContainer(): Container {
  if (!globalContainer) {
    globalContainer = new Container();
  }
  return globalContainer;
}

// --- Example Usage ---
/*
  // Define some example classes
  class LoggerService {
    log(message: string) {
      console.log(`[Logger]: ${message}`);
    }
  }

  class ApiService {
    // This could have its own dependencies in a real scenario
    constructor() {}
    fetchData() {
      console.log('Fetching data from API...');
      return { id: 1, content: 'Dream data' };
    }
  }

  class DreamService {
    // Dependencies are "injected" via the container
    constructor(
      private logger: LoggerService,
      private api: ApiService
    ) {}

    saveDream() {
      this.logger.log('Attempting to save a dream...');
      const data = this.api.fetchData();
      this.logger.log(`Dream saved with id: ${data.id}`);
    }
  }


  // --- Configuration ---
  const container = getGlobalContainer();

  // Register dependencies
  container.register(LoggerService, LoggerService, Lifetime.Singleton);
  container.register(ApiService, ApiService, Lifetime.Singleton);

  // Register DreamService with a custom factory to handle its dependencies
  container.register(DreamService, () => new DreamService(
    container.resolve(LoggerService),
    container.resolve(ApiService)
  ), Lifetime.Transient);


  // --- Application Logic ---
  const dreamApp = container.resolve(DreamService);
  dreamApp.saveDream();

  const dreamApp2 = container.resolve(DreamService);
  dreamApp2.saveDream(); // Will use the same logger/api but is a new DreamService instance

  // Check if singletons are the same instance
  const logger1 = container.resolve(LoggerService);
  const logger2 = container.resolve(LoggerService);
  console.log('Loggers are the same instance:', logger1 === logger2); // true
*/ 