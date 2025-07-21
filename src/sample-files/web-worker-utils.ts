// src/sample-files/web-worker-utils.ts

/**
 * Creates a new Web Worker.
 * @param workerPath The path to the worker script.
 * @returns A new Worker instance.
 */
export function createWorker(workerPath: string): Worker {
  if (typeof Worker !== 'undefined') {
    return new Worker(workerPath);
  } else {
    throw new Error('Web Workers are not supported in this browser.');
  }
}

/**
 * A wrapper for a Web Worker that simplifies message passing.
 */
export class ManagedWorker {
  private worker: Worker;

  constructor(workerPath: string) {
    this.worker = createWorker(workerPath);
  }

  public postMessage(message: any): void {
    this.worker.postMessage(message);
  }

  public onMessage(handler: (event: MessageEvent) => void): void {
    this.worker.onmessage = handler;
  }

  public onError(handler: (event: ErrorEvent) => void): void {
    this.worker.onerror = handler;
  }

  public terminate(): void {
    this.worker.terminate();
  }
} 