// src/sample-files/scheduler.ts

type Task = () => void;

class Scheduler {
  private tasks: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Schedules a task to run at a specified interval.
   * @param id A unique identifier for the task.
   * @param task The function to execute.
   * @param interval The interval in milliseconds.
   */
  public schedule(id: string, task: Task, interval: number): void {
    if (this.tasks.has(id)) {
      this.cancel(id);
    }
    const timer = setInterval(task, interval);
    this.tasks.set(id, timer);
  }

  /**
   * Cancels a scheduled task.
   * @param id The identifier of the task to cancel.
   */
  public cancel(id: string): void {
    const timer = this.tasks.get(id);
    if (timer) {
      clearInterval(timer);
      this.tasks.delete(id);
    }
  }

  /**
   * Cancels all scheduled tasks.
   */
  public cancelAll(): void {
    for (const id of this.tasks.keys()) {
      this.cancel(id);
    }
  }
}

export const scheduler = new Scheduler(); 