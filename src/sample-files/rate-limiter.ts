// src/sample-files/rate-limiter.ts

class RateLimiter {
  private fn: (...args: any[]) => void;
  private delay: number;
  private timeoutId: NodeJS.Timeout | null = null;
  private lastCallTime: number = 0;

  constructor(fn: (...args: any[]) => void, delay: number) {
    this.fn = fn;
    this.delay = delay;
  }

  public call(...args: any[]): void {
    const now = Date.now();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    const timeSinceLastCall = now - this.lastCallTime;

    if (timeSinceLastCall >= this.delay) {
      this.lastCallTime = now;
      this.fn(...args);
    } else {
      this.timeoutId = setTimeout(() => {
        this.lastCallTime = Date.now();
        this.fn(...args);
      }, this.delay - timeSinceLastCall);
    }
  }

  public cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export default RateLimiter; 