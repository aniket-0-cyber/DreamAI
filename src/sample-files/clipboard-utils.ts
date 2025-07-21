// src/sample-files/clipboard-utils.ts

/**
 * Copies a string to the clipboard.
 * @param text The string to copy.
 * @returns A promise that resolves when the text is copied.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
    return Promise.resolve();
  }

  return navigator.clipboard.writeText(text);
}

/**
 * Reads text from the clipboard.
 * @returns A promise that resolves with the text from the clipboard.
 */
export async function readFromClipboard(): Promise<string> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API not available.');
  }
  return navigator.clipboard.readText();
} 