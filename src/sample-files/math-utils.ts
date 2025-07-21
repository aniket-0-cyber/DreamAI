// src/sample-files/math-utils.ts

/**
 * Clamps a number between a minimum and maximum value.
 * @param num The number to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Maps a number from one range to another.
 * @param num The number to map.
 * @param in_min The lower bound of the input range.
 * @param in_max The upper bound of the input range.
 * @param out_min The lower bound of the output range.
 * @param out_max The upper bound of the output range.
 */
export function mapRange(
  num: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

/**
 * Generates a random integer within a specified range.
 * @param min The minimum value (inclusive).
 * @param max The maximum value (inclusive).
 */
export function randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 