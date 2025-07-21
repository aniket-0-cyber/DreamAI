// src/sample-files/service-worker-utils.ts

/**
 * Registers a service worker.
 * @param scriptURL The path to the service worker script.
 * @param options Registration options.
 * @returns The service worker registration object.
 */
export async function registerServiceWorker(
  scriptURL: string,
  options?: RegistrationOptions
): Promise<ServiceWorkerRegistration> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(scriptURL, options);
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  } else {
    throw new Error('Service Workers are not supported in this browser.');
  }
}

/**
 * Sends a message to the service worker.
 * @param message The message to send.
 */
export function sendMessageToServiceWorker(message: any): void {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  } else {
    console.warn('No active service worker controller found.');
  }
} 