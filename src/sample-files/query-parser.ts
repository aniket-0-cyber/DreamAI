// src/sample-files/query-parser.ts

export function parseQueryString(url: string): Record<string, string | string[]> {
    const queryString = url.split('?')[1];
    if (!queryString) {
      return {};
    }
  
    const params = new URLSearchParams(queryString);
    const result: Record<string, string | string[]> = {};
  
    for (const [key, value] of params.entries()) {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          (result[key] as string[]).push(value);
        } else {
          result[key] = [result[key] as string, value];
        }
      } else {
        result[key] = value;
      }
    }
  
    return result;
  }
  
  export function stringifyQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item));
        } else if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      }
    }
    return searchParams.toString();
  } 