/**
 * A manager for handling Web Workers to offload heavy tasks from the main UI thread.
 * This helps keep the application responsive by running scripts in the background.
 * It provides a simple, promise-based API for request-response communication.
 */

// A generic interface for messages sent to the worker.
export interface WorkerRequest<T = any> {
  type: string;
  payload: T;
}

// A generic interface for messages received from the worker.
export interface WorkerResponse<T = any> {
  type: string;
  payload?: T;
  error?: string;
}

// A map to keep track of ongoing requests and their `resolve` functions.
type PromiseResolver = (response: WorkerResponse) => void;

/**
 * The WorkerManager class abstracts away the complexity of dealing with Web Workers.
 */
export class WorkerManager {
  private worker: Worker;
  private requestCounter = 0;
  private pendingRequests = new Map<number, PromiseResolver>();

  /**
   * @param workerPath The path to the worker script.
   */
  constructor(workerPath: string) {
    if (typeof Worker === 'undefined') {
      throw new Error('Web Workers are not supported in this environment.');
    }

    this.worker = new Worker(workerPath);
    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.onerror = this.handleError.bind(this);
  }

  /**
   * Handles incoming messages from the worker.
   */
  private handleMessage(event: MessageEvent): void {
    const { requestId, response } = event.data;
    const resolver = this.pendingRequests.get(requestId);

    if (resolver) {
      resolver(response);
      this.pendingRequests.delete(requestId);
    } else {
      console.warn(`Received message for an unknown request ID: ${requestId}`);
    }
  }

  /**
   * Handles errors from the worker.
   */
  private handleError(event: ErrorEvent): void {
    console.error('Error in Web Worker:', event);
    // Reject all pending requests on a catastrophic worker error.
    this.pendingRequests.forEach(resolver => {
      resolver({ type: 'WORKER_ERROR', error: event.message });
    });
    this.pendingRequests.clear();
  }

  /**
   * Sends a request to the worker and returns a promise that resolves with the response.
   * @param request The request object to send to the worker.
   */
  public postRequest<TRequest, TResponse>(request: WorkerRequest<TRequest>): Promise<WorkerResponse<TResponse>> {
    const requestId = this.requestCounter++;
    
    return new Promise<WorkerResponse<TResponse>>((resolve) => {
      this.pendingRequests.set(requestId, resolve as PromiseResolver);
      this.worker.postMessage({ requestId, request });
    });
  }

  /**
   * Terminates the worker.
   * Any pending requests will be rejected.
   */
  public terminate(): void {
    this.worker.terminate();
    this.handleError(new ErrorEvent('error', { message: 'Worker terminated' }));
  }
}

// --- Example Worker Script (`dream-analyzer.worker.ts`) ---
// This file would be separate in a real project. It's included here for demonstration.
/*
  // In dream-analyzer.worker.ts

  self.onmessage = (event) => {
    const { requestId, request } = event.data;
    let response;

    try {
      switch (request.type) {
        case 'ANALYZE_DREAM_CONTENT':
          // Simulate a heavy computation
          const analysis = analyzeContent(request.payload.content);
          response = { type: 'ANALYSIS_COMPLETE', payload: analysis };
          break;
        
        default:
          response = { type: 'UNKNOWN_REQUEST', error: `Unknown request type: ${request.type}` };
          break;
      }
    } catch (e) {
      response = { type: 'PROCESSING_ERROR', error: e.message };
    }

    self.postMessage({ requestId, response });
  };

  function analyzeContent(content: string) {
    const words = content.split(/\s+/);
    const wordCount = words.length;
    // Simulate CPU-intensive task
    for (let i = 0; i < 1e7; i++) {} 
    const longestWord = words.sort((a, b) => b.length - a.length)[0] || '';
    return { wordCount, longestWord };
  }
*/


// --- Example Usage ---
/*
  async function runWorkerDemo() {
    // NOTE: You would need to create 'dream-analyzer.worker.js' with the content from above.
    // In a real project setup (like with Create React App or Vite), you can import workers directly.
    const workerManager = new WorkerManager('./dream-analyzer.worker.js');

    console.log('Sending analysis request to worker...');
    const response = await workerManager.postRequest({
      type: 'ANALYZE_DREAM_CONTENT',
      payload: { content: 'I had a long and particularly vivid dream about flying over mountains.' }
    });

    if (response.error) {
      console.error('Worker responded with an error:', response.error);
    } else {
      console.log('Worker analysis complete:', response.payload);
      // Expected output: { wordCount: 13, longestWord: 'particularly' }
    }

    workerManager.terminate();
    console.log('Worker terminated.');
  }

  runWorkerDemo();
*/ 