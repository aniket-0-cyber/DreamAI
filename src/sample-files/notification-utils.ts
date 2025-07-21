// src/sample-files/notification-utils.ts

/**
 * Requests permission to show notifications.
 * @returns A promise that resolves with the permission status.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support desktop notification');
  }
  return Notification.requestPermission();
}

/**
 * Shows a system notification.
 * @param title The title of the notification.
 * @param options The notification options.
 */
export function showNotification(title: string, options?: NotificationOptions): void {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported.');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }
} 