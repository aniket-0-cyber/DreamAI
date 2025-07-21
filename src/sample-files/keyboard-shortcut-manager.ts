// src/sample-files/keyboard-shortcut-manager.ts

type ShortcutCallback = (event: KeyboardEvent) => void;

interface Shortcut {
  keys: string[];
  callback: ShortcutCallback;
  element?: HTMLElement;
}

class KeyboardShortcutManager {
  private shortcuts: Shortcut[] = [];

  public add(keys: string | string[], callback: ShortcutCallback, element?: HTMLElement): () => void {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    const shortcut: Shortcut = { keys: keyArray, callback, element };
    this.shortcuts.push(shortcut);

    const target = element || document.documentElement;
    const handler = (event: KeyboardEvent) => {
      const pressedKeys = this.getPressedKeys(event);
      if (this.isMatch(shortcut.keys, pressedKeys)) {
        event.preventDefault();
        callback(event);
      }
    };

    target.addEventListener('keydown', handler as EventListener);

    // Return a function to remove the shortcut
    return () => {
      target.removeEventListener('keydown', handler as EventListener);
      this.shortcuts = this.shortcuts.filter(s => s !== shortcut);
    };
  }

  private getPressedKeys(event: KeyboardEvent): string[] {
    const keys: string[] = [];
    if (event.ctrlKey) keys.push('Control');
    if (event.shiftKey) keys.push('Shift');
    if (event.altKey) keys.push('Alt');
    if (event.metaKey) keys.push('Meta');
    keys.push(event.key);
    return keys;
  }

  private isMatch(shortcutKeys: string[], pressedKeys: string[]): boolean {
    return shortcutKeys.every(key => pressedKeys.includes(key));
  }
}

export const shortcutManager = new KeyboardShortcutManager(); 