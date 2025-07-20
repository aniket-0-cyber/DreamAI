/**
 * A WebSocket client manager for real-time communication with a server.
 * This class handles connection, reconnection, message sending/receiving,
 * and provides a structured way to handle different types of real-time events.
 * It uses the Adapter pattern to wrap the native WebSocket API.
 */

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

// A generic structure for messages sent to and from the server.
export interface WebSocketMessage<T = any> {
  event: string;
  payload: T;
  timestamp: number;
}

export interface RealtimeManagerOptions {
  url: string;
  reconnectInterval?: number; // Time in ms to wait before reconnecting
  maxReconnectAttempts?: number; // Max attempts before giving up
}

type EventHandler = (payload: any) => void;
type StatusChangeHandler = (status: ConnectionStatus) => void;

/**
 * The RealtimeManager class.
 */
export class RealtimeManager {
  private ws?: WebSocket;
  private options: Required<RealtimeManagerOptions>;
  private status: ConnectionStatus = 'disconnected';
  private reconnectAttempts = 0;
  
  private eventHandlers = new Map<string, Set<EventHandler>>();
  private statusChangeHandlers = new Set<StatusChangeHandler>();

  constructor(options: RealtimeManagerOptions) {
    this.options = {
      reconnectInterval: options.reconnectInterval || 5000,
      maxReconnectAttempts: options.maxReconnectAttempts || 10,
      ...options,
    };
  }

  /**
   * Establishes a connection to the WebSocket server.
   */
  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.setStatus('connecting');
    this.ws = new WebSocket(this.options.url);

    this.ws.onopen = () => this.onOpen();
    this.ws.onmessage = (event) => this.onMessage(event);
    this.ws.onclose = () => this.onClose();
    this.ws.onerror = (event) => this.onError(event);
  }

  /**
   * Disconnects from the server.
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  private setStatus(newStatus: ConnectionStatus): void {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.statusChangeHandlers.forEach(handler => handler(this.status));
  }

  private onOpen(): void {
    this.setStatus('connected');
    this.reconnectAttempts = 0;
    console.log('[Realtime] Connection established.');
  }

  private onMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const handlers = this.eventHandlers.get(message.event);
      if (handlers) {
        handlers.forEach(handler => handler(message.payload));
      }
    } catch (error) {
      console.error('[Realtime] Error parsing incoming message:', error);
    }
  }

  private onClose(): void {
    this.ws = undefined;
    if (this.status !== 'disconnected') {
      this.handleReconnect();
    }
  }

  private onError(event: Event): void {
    console.error('[Realtime] WebSocket error:', event);
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.setStatus('reconnecting');
      console.log(`[Realtime] Reconnecting... (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), this.options.reconnectInterval);
    } else {
      this.setStatus('disconnected');
      console.error('[Realtime] Max reconnect attempts reached. Giving up.');
    }
  }

  /**
   * Subscribes to a specific server event.
   * @param event The name of the event.
   * @param handler The callback function to execute.
   * @returns An unsubscribe function.
   */
  on(event: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    return () => this.off(event, handler);
  }
  
  /**
   * Unsubscribes from a server event.
   */
  off(event: string, handler: EventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }
  
  /**
   * Subscribes to connection status changes.
   */
  onStatusChange(handler: StatusChangeHandler): () => void {
    this.statusChangeHandlers.add(handler);
    return () => this.statusChangeHandlers.delete(handler);
  }

  /**
   * Sends a message to the server.
   */
  send<T>(event: string, payload: T): void {
    if (this.status !== 'connected') {
      console.warn('[Realtime] Cannot send message while not connected.');
      return;
    }
    const message: WebSocketMessage<T> = { event, payload, timestamp: Date.now() };
    this.ws?.send(JSON.stringify(message));
  }
}


// --- Example Usage ---
/*
  // This example requires a running WebSocket server.
  // You can use a simple one like `npm install ws` and run a basic server.
  // Or use a public echo server like 'wss://socketsbay.com/wss/v2/1/demo/'

  async function runRealtimeDemo() {
    const realtime = new RealtimeManager({ url: 'wss://socketsbay.com/wss/v2/1/demo/' });

    const unsubscribeStatus = realtime.onStatusChange(status => {
      console.log(`Connection status changed to: ${status.toUpperCase()}`);
    });

    const unsubscribeDreamUpdate = realtime.on('dream:updated', (payload) => {
      console.log('Received dream update from server:', payload);
    });
    
    realtime.connect();

    // After connection, send a message
    setTimeout(() => {
        realtime.send('dream:get-details', { dreamId: 'dream-123' });
        // The echo server will send this message back, triggering the 'dream:get-details' handler if you have one.
    }, 2000);
    
    // Simulate a message that would be sent from the server.
    // In a real app, the server would send this. Here we simulate it for demo.
    setTimeout(() => {
        const fakeServerMessage = {
            event: 'dream:updated',
            payload: { id: 'dream-456', title: 'A New Title from Server', status: 'analyzed' },
            timestamp: Date.now()
        };
        // This won't work with a real echo server, but shows how the handler works.
        // To test, you'd need your own server that sends this message.
    }, 4000);

    // Clean up after some time
    setTimeout(() => {
      unsubscribeStatus();
      unsubscribeDreamUpdate();
      realtime.disconnect();
    }, 10000);
  }

  runRealtimeDemo();
*/ 