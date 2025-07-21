// src/sample-files/date-utils.ts

/**
 * Formats a date into a string with a specified format.
 * (This is a simplified version; for robust formatting, use a library like date-fns)
 * @param date The date to format.
 * @param format The format string (e.g., 'YYYY-MM-DD').
 */
export function formatDate(date: Date, format: string): string {
  const map: { [key: string]: string } = {
    YYYY: date.getFullYear().toString(),
    MM: (date.getMonth() + 1).toString().padStart(2, '0'),
    DD: date.getDate().toString().padStart(2, '0'),
    HH: date.getHours().toString().padStart(2, '0'),
    mm: date.getMinutes().toString().padStart(2, '0'),
    ss: date.getSeconds().toString().padStart(2, '0'),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (matched) => map[matched]);
}

/**
 * Checks if a given date is today.
 * @param date The date to check.
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Adds a specified number of days to a date.
 * @param date The date to modify.
 * @param days The number of days to add.
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
} 