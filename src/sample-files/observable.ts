/**
 * A reactive programming system with observables and operators.
 * This implements the Observer pattern and provides a foundation for
 * building reactive data flows, similar to RxJS but simplified.
 */

export type Subscriber<T> = (value: T) => void;
export type Operator<T, U> = (source: Observable<T>) => Observable<U>;

/**
 * The main Observable class that represents a stream of values.
 */
export class Observable<T> {
  private subscribers: Set<Subscriber<T>> = new Set();

  constructor(private source?: (subscriber: Subscriber<T>) => void) {
    if (source) {
      source(this.next.bind(this));
    }
  }

  /**
   * Subscribes to the observable.
   * @param subscriber The function to call when a new value is emitted.
   * @returns An unsubscribe function.
   */
  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  /**
   * Emits a value to all subscribers.
   */
  next(value: T): void {
    this.subscribers.forEach(subscriber => {
      try {
        subscriber(value);
      } catch (error) {
        console.error('Error in observable subscriber:', error);
      }
    });
  }

  /**
   * Creates an observable from an array of values.
   */
  static from<T>(values: T[]): Observable<T> {
    return new Observable(subscriber => {
      values.forEach(value => subscriber(value));
    });
  }

  /**
   * Creates an observable that emits values at regular intervals.
   */
  static interval(ms: number): Observable<number> {
    return new Observable(subscriber => {
      let count = 0;
      const interval = setInterval(() => {
        subscriber(count++);
      }, ms);
      
      // Return cleanup function
      return () => clearInterval(interval);
    });
  }

  /**
   * Creates an observable from a promise.
   */
  static fromPromise<T>(promise: Promise<T>): Observable<T> {
    return new Observable(subscriber => {
      promise.then(subscriber).catch(error => {
        console.error('Promise observable error:', error);
      });
    });
  }
}

/**
 * Operator that filters values based on a predicate.
 */
export function filter<T>(predicate: (value: T) => boolean): Operator<T, T> {
  return (source: Observable<T>) => {
    return new Observable<T>(subscriber => {
      source.subscribe(value => {
        if (predicate(value)) {
          subscriber(value);
        }
      });
    });
  };
}

/**
 * Operator that transforms values using a mapping function.
 */
export function map<T, U>(mapper: (value: T) => U): Operator<T, U> {
  return (source: Observable<T>) => {
    return new Observable<U>(subscriber => {
      source.subscribe(value => {
        subscriber(mapper(value));
      });
    });
  };
}

/**
 * Operator that limits the number of values emitted.
 */
export function take<T>(count: number): Operator<T, T> {
  return (source: Observable<T>) => {
    return new Observable<T>(subscriber => {
      let emitted = 0;
      const unsubscribe = source.subscribe(value => {
        if (emitted < count) {
          subscriber(value);
          emitted++;
          if (emitted === count) {
            unsubscribe();
          }
        }
      });
    });
  };
}

/**
 * Operator that debounces values by waiting for a pause in emissions.
 */
export function debounce<T>(ms: number): Operator<T, T> {
  return (source: Observable<T>) => {
    return new Observable<T>(subscriber => {
      let timeoutId: ReturnType<typeof setTimeout>;
      source.subscribe(value => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          subscriber(value);
        }, ms);
      });
    });
  };
}

/**
 * Operator that combines multiple observables into one.
 */
export function merge<T>(...sources: Observable<T>[]): Observable<T> {
  return new Observable<T>(subscriber => {
    const unsubscribes = sources.map(source => source.subscribe(subscriber));
    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  });
}

// --- Example Usage ---
/*
  // Create an observable from an array
  const numbers$ = Observable.from([1, 2, 3, 4, 5]);
  
  // Subscribe to the observable
  const unsubscribe = numbers$.subscribe(value => {
    console.log('Received:', value);
  });
  
  // Create an interval observable
  const interval$ = Observable.interval(1000);
  
  // Apply operators
  const filtered$ = interval$.pipe(
    filter(x => x % 2 === 0), // Only even numbers
    map(x => x * 2), // Double the value
    take(5) // Take only 5 values
  );
  
  filtered$.subscribe(value => {
    console.log('Filtered and mapped:', value);
  });
  
  // Debounced search input
  const searchInput$ = new Observable<string>();
  
  const debouncedSearch$ = searchInput$.pipe(
    debounce(300), // Wait 300ms after last input
    map(query => query.toLowerCase())
  );
  
  debouncedSearch$.subscribe(query => {
    console.log('Searching for:', query);
    // Perform search here
  });
  
  // Simulate user typing
  setTimeout(() => searchInput$.next('hello'), 0);
  setTimeout(() => searchInput$.next('hello w'), 100);
  setTimeout(() => searchInput$.next('hello wo'), 200);
  setTimeout(() => searchInput$.next('hello wor'), 300);
  setTimeout(() => searchInput$.next('hello world'), 400);
  
  // Merge multiple observables
  const clicks$ = new Observable<MouseEvent>();
  const keypresses$ = new Observable<KeyboardEvent>();
  
  const allEvents$ = merge(clicks$, keypresses$);
  
  allEvents$.subscribe(event => {
    console.log('Event received:', event.type);
  });
*/

// --- Extension Methods for Observable ---

declare module './observable' {
  interface Observable<T> {
    pipe<U>(operator: Operator<T, U>): Observable<U>;
    pipe<U, V>(op1: Operator<T, U>, op2: Operator<U, V>): Observable<V>;
    pipe<U, V, W>(op1: Operator<T, U>, op2: Operator<U, V>, op3: Operator<V, W>): Observable<W>;
  }
}

// Add pipe method to Observable prototype
Observable.prototype.pipe = function<T, U>(...operators: Operator<any, any>[]): Observable<U> {
  return operators.reduce((source, operator) => operator(source), this as Observable<any>);
}; 