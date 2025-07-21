// src/sample-files/url-utils.ts

/**
 * Parses a URL and returns its components.
 * @param urlString The URL to parse.
 */
export function parseUrl(urlString: string): URL {
  return new URL(urlString);
}

/**
 * Appends query parameters to a URL.
 * @param urlString The original URL.
 * @param params The parameters to append.
 */
export function appendQueryParams(urlString: string, params: Record<string, string>): string {
  const url = new URL(urlString);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return url.toString();
}

/**
 * Checks if a URL is absolute.
 * @param urlString The URL to check.
 */
export function isAbsoluteUrl(urlString: string): boolean {
    return /^[a-z][a-z0-9+.-]*:/.test(urlString);
} 