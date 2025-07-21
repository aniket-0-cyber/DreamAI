// src/sample-files/performance-monitor.ts

export class PerformanceMonitor {
    public static measure(name: string, fn: () => void): void {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds.`);
    }
  
    public static getNavigationTiming() {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const navigationStart = timing.navigationStart;
  
        const timings = {
          latency: timing.responseEnd - timing.fetchStart,
          domLoad: timing.domContentLoadedEventEnd - navigationStart,
          windowLoad: timing.loadEventEnd - navigationStart
        };
        console.table(timings);
        return timings;
      }
      return null;
    }
  
    public static startObservingPaintMetrics() {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`${entry.name}: ${entry.startTime}`);
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      }
  } 