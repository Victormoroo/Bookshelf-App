/**
 * Placeholder cover helpers. Until real cover images arrive from the books API,
 * covers are rendered as a diagonal gradient built from the book's base color
 * (matches the prototype's `cover(color)`).
 */

/** Gradient stops for a placeholder cover, for use with expo-linear-gradient. */
export function coverGradient(color: string): [string, string, string] {
  return [color, color, 'rgba(0,0,0,0.24)'];
}

/** Gradient locations matching `linear-gradient(155deg, c 0%, c 58%, dark 100%)`. */
export const coverGradientLocations: [number, number, number] = [0, 0.58, 1];

/** 155deg gradient direction expressed as start/end points for RN. */
export const coverGradientStart = { x: 0.15, y: 0 };
export const coverGradientEnd = { x: 0.85, y: 1 };
