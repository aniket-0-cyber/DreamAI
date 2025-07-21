// src/sample-files/event-emitter.ts

type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: { [event: string]: Listener<T>[] } = {};

  public on(event: string, listener: Listener<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);

    // Return an unsubscribe function
    return () => this.off(event, listener);
  }

  public off(event: string, listener: Listener<T>): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter(
      (l) => l !== listener
    );
  }

  public emit(event: string, data: T): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((listener) => listener(data));
  }
}

export const appEvents = new EventEmitter<any>(); 