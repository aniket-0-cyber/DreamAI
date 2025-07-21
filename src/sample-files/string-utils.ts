// src/sample-files/string-utils.ts

/**
 * Capitalizes the first letter of a string.
 * @param str The string to capitalize.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length, appending an ellipsis if it exceeds the length.
 * @param str The string to truncate.
 * @param length The maximum length of the string.
 */
export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Converts a string to kebab-case.
 * @param str The string to convert.
 */
export function toKebabCase(str: string): string {
    if (!str) return '';
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
} 