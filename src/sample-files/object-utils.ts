// src/sample-files/object-utils.ts

/**
 * Checks if an object is empty (has no own properties).
 * @param obj The object to check.
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Creates an object composed of the picked object properties.
 * @param obj The source object.
 * @param keys The properties to pick.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Creates an object composed of the own and inherited enumerable property paths of object that are not omitted.
 * @param obj The source object.
 * @param keys The properties to omit.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    }
    );
    return result;
} 