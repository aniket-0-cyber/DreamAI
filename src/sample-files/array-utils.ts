// src/sample-files/array-utils.ts

/**
 * Removes duplicate values from an array.
 * @param arr The array to process.
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Groups an array of objects by a specified key.
 * @param arr The array of objects.
 * @param key The key to group by.
 */
export function groupBy<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = item[key];
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Creates an array of chunks from an array.
 * @param arr The array to chunk.
 * @param size The size of each chunk.
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
} 