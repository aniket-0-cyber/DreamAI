// src/sample-files/crypto-utils.ts

/**
 * Hashes a string using the SHA-256 algorithm.
 * @param data The string to hash.
 * @returns A promise that resolves with the hex-encoded hash.
 */
export async function sha256(data: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is not available.');
  }
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Generates a random UUID (v4).
 * @returns A new UUID string.
 */
export function uuidv4(): string {
  if (typeof crypto === 'undefined' || !crypto.randomUUID) {
    // Fallback for environments without crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }
  return crypto.randomUUID();
} 