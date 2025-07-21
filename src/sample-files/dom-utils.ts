// src/sample-files/dom-utils.ts

/**
 * Adds a class to an element.
 * @param el The element.
 * @param className The class to add.
 */
export function addClass(el: HTMLElement, className: string): void {
  el.classList.add(className);
}

/**
 * Removes a class from an element.
 * @param el The element.
 * @param className The class to remove.
 */
export function removeClass(el: HTMLElement, className: string): void {
  el.classList.remove(className);
}

/**
 * Toggles a class on an element.
 * @param el The element.
 * @param className The class to toggle.
 */
export function toggleClass(el: HTMLElement, className: string): void {
  el.classList.toggle(className);
}

/**
 * Attaches an event listener to an element.
 * @param el The element.
 * @param event The event to listen for.
 * @param handler The event handler.
 */
export function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
): void {
  el.addEventListener(event, handler);
}

/**
 * Removes an event listener from an element.
 * @param el The element.
 * @param event The event to remove the listener from.
 * @param handler The event handler to remove.
 */
export function off<K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    event: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ): void {
    el.removeEventListener(event, handler);
  } 