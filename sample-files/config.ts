export interface AppConfig {
  apiUrl: string;
  timeout: number;
  retryAttempts: number;
  features: {
    enableLogging: boolean;
    enableAnalytics: boolean;
    maxFileSize: number;
  };
}

export const config: AppConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retryAttempts: 3,
  features: {
    enableLogging: true,
    enableAnalytics: false,
    maxFileSize: 10485760 // 10MB
  }
};

export const getConfig = (): AppConfig => config; 