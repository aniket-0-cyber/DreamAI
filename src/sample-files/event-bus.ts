/**
 * A type-safe, generic event bus for decoupled communication.
 * This allows different parts of the application to interact without
 * having direct dependencies on each other, based on the publish-subscribe pattern.
 */

// Define a map of event names to their payload types.
// This allows for strong typing of event payloads.
export interface EventMap {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': void;
  'dream:saved': { dreamId: string };
  'dream:deleted': { dreamId: string };
  'notification:show': { message: string; type: 'info' | 'warning' | 'error' };
  'settings:changed': { key: string; value: any };
}

// Type alias for event names
export type EventKey = keyof EventMap;

// Type for the callback function, ensuring payload type matches the event key.
export type EventCallback<K extends EventKey> = (payload: EventMap[K]) => void;

/**
 * The EventBus class manages subscriptions and event emissions.
 */
export class EventBus {
  private listeners: {
    [K in EventKey]?: Array<EventCallback<K>>;
  } = {};

  /**
   * Subscribes to an event.
   * @param key The event to subscribe to.
   * @param callback The function to execute when the event is emitted.
   * @returns An unsubscribe function.
   */
  on<K extends EventKey>(key: K, callback: EventCallback<K>): () => void {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key]!.push(callback);

    // Return an unsubscribe function
    return () => this.off(key, callback);
  }

  /**
   * Unsubscribes from an event.
   * @param key The event to unsubscribe from.
   * @param callback The specific callback to remove.
   */
  off<K extends EventKey>(key: K, callback: EventCallback<K>): void {
    const eventListeners = this.listeners[key];
    if (eventListeners) {
      this.listeners[key] = eventListeners.filter(cb => cb !== callback);
    }
  }

  /**
   * Emits an event, calling all subscribed callbacks with the payload.
   * @param key The event to emit.
   * @param payload The data to pass to the event listeners.
   */
  emit<K extends EventKey>(key: K, payload: EventMap[K]): void {
    const eventListeners = this.listeners[key];
    if (eventListeners) {
      // Create a copy to avoid issues if a listener unsubscribes itself
      [...eventListeners].forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in event listener for '${key}':`, error);
        }
      });
    }
  }

  /**
   * Removes all listeners for a specific event, or all listeners entirely.
   * @param key Optional. The event to clear listeners for.
   */
  clear(key?: EventKey): void {
    if (key) {
      delete this.listeners[key];
    } else {
      this.listeners = {};
    }
  }
}

// --- Singleton Instance ---
// Provides a single, globally accessible event bus.

let globalEventBus: EventBus | null = null;

export function getGlobalEventBus(): EventBus {
  if (!globalEventBus) {
    globalEventBus = new EventBus();
  }
  return globalEventBus;
}

// --- React Hook Example ---
// A custom hook for easily using the event bus in React components.
/*
import { useEffect } from 'react';

export function useEventSubscription<K extends EventKey>(
  key: K,
  callback: EventCallback<K>
) {
  useEffect(() => {
    const eventBus = getGlobalEventBus();
    const unsubscribe = eventBus.on(key, callback);

    return () => {
      unsubscribe();
    };
  }, [key, callback]);
}
*/

// --- Example Usage ---
/*
  const eventBus = getGlobalEventBus();

  // Somewhere in a UI component
  const unsubscribe = eventBus.on('user:login', (payload) => {
    console.log(`User ${payload.userId} logged in at ${payload.timestamp}.`);
  });

  // Somewhere in an authentication service
  eventBus.emit('user:login', { userId: '123', timestamp: new Date() });

  // Unsubscribe when the component unmounts
  unsubscribe();

  // Using the React hook
  useEventSubscription('notification:show', (payload) => {
    alert(`${payload.type.toUpperCase()}: ${payload.message}`);
  });
*/ 