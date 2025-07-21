// src/sample-files/animation-utils.ts

/**
 * A wrapper for the Web Animations API to simplify animations.
 * @param el The element to animate.
 * @param keyframes The keyframes for the animation.
 * @param options The animation options.
 * @returns An Animation object.
 */
export function animate(
  el: HTMLElement,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options?: number | KeyframeAnimationOptions
): Animation {
  if (typeof el.animate !== 'function') {
    console.warn('Web Animations API is not supported in this browser.');
    // Return a dummy object for compatibility
    return {
        play: () => {},
        pause: () => {},
        cancel: () => {},
        finish: () => {},
    } as any;
  }
  return el.animate(keyframes, options);
}

/**
 * A simple fade-in animation.
 * @param el The element to fade in.
 * @param duration The duration of the animation in milliseconds.
 */
export function fadeIn(el: HTMLElement, duration: number = 300): Animation {
    const keyframes = [
        { opacity: 0 },
        { opacity: 1 }
    ];
    return animate(el, keyframes, { duration, easing: 'ease-in-out' });
}

/**
 * A simple fade-out animation.
 * @param el The element to fade out.
 * @param duration The duration of the animation in milliseconds.
 */
export function fadeOut(el: HTMLElement, duration: number = 300): Animation {
    const keyframes = [
        { opacity: 1 },
        { opacity: 0 }
    ];
    return animate(el, keyframes, { duration, easing: 'ease-in-out' });
} 