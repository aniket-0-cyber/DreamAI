// src/sample-files/accessibility-utils.ts

/**
 * Traps focus within a given element.
 * @param element The element to trap focus within.
 */
export function trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
  
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }
  
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };
  
    element.addEventListener('keydown', handleKeyDown);
  
    // Return a cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }
  
  /**
   * Announces a message to screen readers.
   * @param message The message to announce.
   */
  export function announce(message: string) {
    const announcer = document.createElement('div');
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  
    announcer.textContent = message;
  
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  } 