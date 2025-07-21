// src/sample-files/promise-utils.ts

/**
 * Creates a Promise that resolves after a specified number of milliseconds.
 * @param ms The number of milliseconds to wait.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Attaches a timeout to a promise. If the promise does not resolve or reject
 * within the specified time, it will be rejected with a timeout error.
 * @param promise The promise to attach the timeout to.
 * @param ms The timeout in milliseconds.
 * @param timeoutMessage The error message for when the timeout is reached.
 */
export function timeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, ms);

    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
} 