// src/sample-files/theme-provider.ts

interface Theme {
  name: string;
  colors: {
    primary: string;
    background: string;
    text: string;
    accent: string;
  };
}

const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#007bff',
    background: '#ffffff',
    text: '#333333',
    accent: '#ffc107',
  },
};

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#61dafb',
    background: '#282c34',
    text: '#ffffff',
    accent: '#ff8a65',
  },
};

class ThemeProvider {
  private currentTheme: Theme = lightTheme;
  private subscribers: ((theme: Theme) => void)[] = [];

  public getTheme(): Theme {
    return this.currentTheme;
  }

  public setTheme(themeName: 'light' | 'dark'): void {
    this.currentTheme = themeName === 'dark' ? darkTheme : lightTheme;
    this.notifySubscribers();
  }

  public subscribe(callback: (theme: Theme) => void): () => void {
    this.subscribers.push(callback);
    callback(this.currentTheme); // Immediately notify with current theme

    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.currentTheme));
  }
}

export const themeProvider = new ThemeProvider(); 