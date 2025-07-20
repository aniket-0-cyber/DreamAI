/**
 * A configuration management system for the DreamAI application.
 * This provides a centralized way to manage application settings,
 * with support for environment-specific configs, validation, and hot-reloading.
 */

export interface AppConfig {
  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  
  // Feature Flags
  features: {
    enableAnalytics: boolean;
    enableRealTimeUpdates: boolean;
    enableDreamSharing: boolean;
  };
  
  // UI Configuration
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    maxDreamsPerPage: number;
  };
  
  // Storage Configuration
  storage: {
    type: 'localStorage' | 'indexedDB' | 'remote';
    syncInterval: number;
  };
}

export type Environment = 'development' | 'staging' | 'production';

export interface ConfigValidationRule {
  path: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  required?: boolean;
  validator?: (value: any) => boolean | string;
}

/**
 * The main configuration manager class.
 */
export class ConfigManager {
  private config: AppConfig;
  private environment: Environment;
  private validationRules: ConfigValidationRule[] = [];
  private changeListeners: Set<(config: AppConfig) => void> = new Set();

  constructor(environment: Environment = 'development') {
    this.environment = environment;
    this.config = this.loadConfig();
    this.setupValidationRules();
  }

  /**
   * Loads configuration based on the current environment.
   */
  private loadConfig(): AppConfig {
    const baseConfig: AppConfig = {
      api: {
        baseUrl: 'https://api.dreamai.com',
        timeout: 10000,
        retries: 3,
      },
      features: {
        enableAnalytics: true,
        enableRealTimeUpdates: true,
        enableDreamSharing: false,
      },
      ui: {
        theme: 'auto',
        language: 'en',
        maxDreamsPerPage: 20,
      },
      storage: {
        type: 'localStorage',
        syncInterval: 30000,
      },
    };

    // Environment-specific overrides
    const envOverrides: Record<Environment, Partial<AppConfig>> = {
      development: {
        api: { baseUrl: 'http://localhost:3001' },
        features: { enableAnalytics: false },
      },
      staging: {
        api: { baseUrl: 'https://staging-api.dreamai.com' },
        features: { enableDreamSharing: true },
      },
      production: {
        api: { baseUrl: 'https://api.dreamai.com' },
        features: { enableAnalytics: true, enableDreamSharing: true },
      },
    };

    return this.mergeConfig(baseConfig, envOverrides[this.environment]);
  }

  /**
   * Merges two configuration objects, with the second taking precedence.
   */
  private mergeConfig(base: AppConfig, overrides: Partial<AppConfig>): AppConfig {
    return {
      ...base,
      ...overrides,
      api: { ...base.api, ...overrides.api },
      features: { ...base.features, ...overrides.features },
      ui: { ...base.ui, ...overrides.ui },
      storage: { ...base.storage, ...overrides.storage },
    };
  }

  /**
   * Sets up validation rules for the configuration.
   */
  private setupValidationRules(): void {
    this.validationRules = [
      { path: 'api.baseUrl', type: 'string', required: true },
      { path: 'api.timeout', type: 'number', required: true, validator: (v) => v > 0 },
      { path: 'api.retries', type: 'number', required: true, validator: (v) => v >= 0 },
      { path: 'ui.theme', type: 'string', required: true, validator: (v) => ['light', 'dark', 'auto'].includes(v) },
      { path: 'ui.maxDreamsPerPage', type: 'number', required: true, validator: (v) => v > 0 && v <= 100 },
      { path: 'storage.syncInterval', type: 'number', required: true, validator: (v) => v >= 1000 },
    ];
  }

  /**
   * Validates the current configuration.
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of this.validationRules) {
      const value = this.getNestedValue(this.config, rule.path);
      
      if (rule.required && (value === undefined || value === null)) {
        errors.push(`Required config missing: ${rule.path}`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (typeof value !== rule.type) {
          errors.push(`Invalid type for ${rule.path}: expected ${rule.type}, got ${typeof value}`);
          continue;
        }

        if (rule.validator) {
          const validationResult = rule.validator(value);
          if (validationResult !== true) {
            errors.push(`Validation failed for ${rule.path}: ${validationResult}`);
          }
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Gets a nested value from an object using a dot-separated path.
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Gets the current configuration.
   */
  getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Gets a specific configuration value using a dot-separated path.
   */
  get<T = any>(path: string): T | undefined {
    return this.getNestedValue(this.config, path);
  }

  /**
   * Updates a configuration value.
   */
  set(path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((obj, key) => {
      if (!(key in obj)) obj[key] = {};
      return obj[key];
    }, this.config as any);

    target[lastKey] = value;
    this.notifyChangeListeners();
  }

  /**
   * Subscribes to configuration changes.
   */
  onChange(callback: (config: AppConfig) => void): () => void {
    this.changeListeners.add(callback);
    return () => this.changeListeners.delete(callback);
  }

  /**
   * Notifies all change listeners.
   */
  private notifyChangeListeners(): void {
    const validation = this.validate();
    if (!validation.isValid) {
      console.warn('Configuration validation failed:', validation.errors);
    }

    this.changeListeners.forEach(listener => listener(this.getConfig()));
  }

  /**
   * Gets the current environment.
   */
  getEnvironment(): Environment {
    return this.environment;
  }

  /**
   * Reloads the configuration from the source.
   */
  reload(): void {
    this.config = this.loadConfig();
    this.notifyChangeListeners();
  }
}

// --- Singleton Instance ---

let globalConfigManager: ConfigManager | null = null;

export function getConfigManager(): ConfigManager {
  if (!globalConfigManager) {
    const env = (process.env.NODE_ENV || 'development') as Environment;
    globalConfigManager = new ConfigManager(env);
  }
  return globalConfigManager;
}

// --- Example Usage ---
/*
  const config = getConfigManager();
  
  console.log('Current environment:', config.getEnvironment());
  console.log('API Base URL:', config.get<string>('api.baseUrl'));
  console.log('Analytics enabled:', config.get<boolean>('features.enableAnalytics'));
  
  // Subscribe to configuration changes
  const unsubscribe = config.onChange((newConfig) => {
    console.log('Configuration changed:', newConfig);
  });
  
  // Update a configuration value
  config.set('ui.theme', 'dark');
  config.set('ui.maxDreamsPerPage', 50);
  
  // Validate the configuration
  const validation = config.validate();
  if (!validation.isValid) {
    console.error('Configuration errors:', validation.errors);
  }
  
  // Clean up
  unsubscribe();
*/ 