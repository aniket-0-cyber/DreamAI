// src/sample-files/csv-utils.ts

/**
 * Parses a CSV string into an array of objects.
 * @param csvString The CSV string to parse.
 * @param delimiter The delimiter used in the CSV.
 * @returns An array of objects representing the CSV data.
 */
export function parseCSV(csvString: string, delimiter: string = ','): Record<string, string>[] {
  const lines = csvString.trim().split('\n');
  const headers = lines[0].split(delimiter);
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, string> = {};
    const currentLine = lines[i].split(delimiter);
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }
    result.push(obj);
  }

  return result;
}

/**
 * Converts an array of objects to a CSV string.
 * @param data The array of objects to convert.
 * @param delimiter The delimiter to use in the CSV.
 * @returns A CSV string.
 */
export function toCSV(data: Record<string, any>[], delimiter: string = ','): string {
  if (data.length === 0) {
    return '';
  }
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(delimiter)];

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(delimiter));
  }

  return csvRows.join('\n');
} 