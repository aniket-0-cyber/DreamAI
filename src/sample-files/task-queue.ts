/**
 * A utility for creating and managing task queues with concurrency control.
 * This is useful for handling rate-limited APIs, managing uploads,
 * or any situation where you need to control the number of concurrent async operations.
 */

type Task<T> = () => Promise<T>;

interface QueuedTask<T> {
  task: Task<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

export interface TaskQueueOptions {
  concurrency?: number; // Number of tasks to run in parallel
  autoStart?: boolean; // Whether the queue should start processing automatically
}

/**
 * The TaskQueue class manages a queue of async tasks.
 */
export class TaskQueue {
  private queue: QueuedTask<any>[] = [];
  private activeTasks = 0;
  private isPaused = false;
  private concurrency: number;

  constructor(options: TaskQueueOptions = {}) {
    this.concurrency = options.concurrency || 2;
    this.isPaused = options.autoStart === false;
  }

  /**
   * Adds a task to the queue.
   * @param task A function that returns a promise.
   * @returns A promise that resolves or rejects when the task is complete.
   */
  add<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      if (!this.isPaused) {
        this.process();
      }
    });
  }

  /**
   * Starts processing the queue if it was paused.
   */
  start(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.process();
  }

  /**
   * Pauses the queue. Active tasks will complete, but no new tasks will start.
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Clears all tasks from the queue.
   * Active tasks will not be cancelled.
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Gets the number of tasks waiting in the queue.
   */
  get pendingTasks(): number {
    return this.queue.length;
  }

  /**
   * Gets the number of tasks currently running.
   */
  get runningTasks(): number {
    return this.activeTasks;
  }

  /**
   * The internal processing loop.
   */
  private process(): void {
    if (this.isPaused) return;

    while (this.activeTasks < this.concurrency && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift()!;
      this.activeTasks++;

      task()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.activeTasks--;
          this.process();
        });
    }
  }
}

// --- Example Usage ---
/*
  async function runQueueDemo() {
    // A function that simulates a slow API call
    const createSlowTask = (id: number, duration: number) => {
      return () => {
        console.log(`[Task ${id}] Starting... (will take ${duration}ms)`);
        return new Promise(resolve => {
          setTimeout(() => {
            console.log(`[Task ${id}] Finished.`);
            resolve(`Result from task ${id}`);
          }, duration);
        });
      };
    };

    const queue = new TaskQueue({ concurrency: 2 });
    
    console.log('Adding tasks to the queue...');
    
    const results: Promise<any>[] = [];

    // Add 5 tasks to the queue
    results.push(queue.add(createSlowTask(1, 1000)));
    results.push(queue.add(createSlowTask(2, 1500)));
    results.push(queue.add(createSlowTask(3, 800)));
    results.push(queue.add(createSlowTask(4, 1200)));
    results.push(queue.add(createSlowTask(5, 900)));

    console.log(`Queue status: ${queue.runningTasks} running, ${queue.pendingTasks} pending.`);

    // Wait for all tasks to complete
    const allResults = await Promise.all(results);

    console.log('\nAll tasks completed!');
    console.log('Results:', allResults);
    console.log(`Queue status: ${queue.runningTasks} running, ${queue.pendingTasks} pending.`);
  }

  runQueueDemo();
*/ 