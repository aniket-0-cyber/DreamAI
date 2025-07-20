/**
 * A feature flag management system for the DreamAI application.
 * This allows enabling or disabling features dynamically without code changes.
 * It supports different providers (e.g., local config, remote service).
 */

// A map defining the available feature flags and their expected types.
export interface FeatureFlagMap {
  'enable-dream-sharing': boolean;
  'new-dashboard-layout': boolean;
  'ai-analysis-model': 'basic' | 'advanced' | 'experimental';
  'max-dream-entries': number;
  'show-promotional-banner': boolean;
}

export type FeatureFlagKey = keyof FeatureFlagMap;

/**
 * Interface for a feature flag provider.
 * This could be a local config file, a remote service like LaunchDarkly, etc.
 */
export interface FlagProvider {
  getFlag<K extends FeatureFlagKey>(key: K): FeatureFlagMap[K] | undefined;
  getAllFlags(): Promise<Partial<FeatureFlagMap>>;
  onUpdate?(callback: (flags: Partial<FeatureFlagMap>) => void): void;
}

/**
 * A provider that uses a simple in-memory object for flags.
 * Useful for development and testing.
 */
export class LocalStorageProvider implements FlagProvider {
  private flags: Partial<FeatureFlagMap>;
  private storageKey: string;

  constructor(initialFlags: Partial<FeatureFlagMap> = {}, storageKey = 'dreamai-feature-flags') {
    this.storageKey = storageKey;
    this.flags = this.loadFromStorage() || initialFlags;
  }

  private loadFromStorage(): Partial<FeatureFlagMap> | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.flags));
  }

  getFlag<K extends FeatureFlagKey>(key: K): FeatureFlagMap[K] | undefined {
    return this.flags[key] as FeatureFlagMap[K] | undefined;
  }

  async getAllFlags(): Promise<Partial<FeatureFlagMap>> {
    return { ...this.flags };
  }
  
  // Method to update flags for testing purposes
  setFlag<K extends FeatureFlagKey>(key: K, value: FeatureFlagMap[K]): void {
    this.flags[key] = value;
    this.saveToStorage();
  }
}

/**
 * A provider that fetches flags from a remote URL.
 */
export class RemoteProvider implements FlagProvider {
  private flags: Partial<FeatureFlagMap> = {};
  private updateCallbacks: ((flags: Partial<FeatureFlagMap>) => void)[] = [];

  constructor(private url: string, private refreshInterval: number = 5 * 60 * 1000) {
    this.fetchFlags();
    setInterval(() => this.fetchFlags(), this.refreshInterval);
  }

  private async fetchFlags() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) throw new Error('Failed to fetch flags');
      const newFlags = await response.json();
      this.flags = newFlags;
      this.updateCallbacks.forEach(cb => cb(this.flags));
    } catch (error) {
      console.error('Error fetching remote feature flags:', error);
    }
  }

  getFlag<K extends FeatureFlagKey>(key: K): FeatureFlagMap[K] | undefined {
    return this.flags[key] as FeatureFlagMap[K] | undefined;
  }

  async getAllFlags(): Promise<Partial<FeatureFlagMap>> {
    await this.fetchFlags(); // Ensure we have the latest before returning all
    return { ...this.flags };
  }

  onUpdate(callback: (flags: Partial<FeatureFlagMap>) => void): void {
    this.updateCallbacks.push(callback);
  }
}

/**
 * The main FeatureFlagManager class.
 * It orchestrates providers and provides a simple API for checking flags.
 */
export class FeatureFlagManager {
  private flags: Partial<FeatureFlagMap> = {};

  constructor(private provider: FlagProvider, private defaultValues: Partial<FeatureFlagMap> = {}) {
    this.initialize();
    if (this.provider.onUpdate) {
      this.provider.onUpdate(updatedFlags => {
        this.flags = { ...this.flags, ...updatedFlags };
      });
    }
  }

  private async initialize() {
    this.flags = await this.provider.getAllFlags();
  }

  /**
   * Checks if a feature is enabled.
   * For non-boolean flags, it checks if the value is not undefined.
   * @param key The feature flag to check.
   * @returns The value of the flag, or a default value if not set.
   */
  get<K extends FeatureFlagKey>(key: K): FeatureFlagMap[K] {
    const value = this.flags[key] ?? this.defaultValues[key];
    if (value === undefined) {
      throw new Error(`No value or default value found for feature flag: ${key}`);
    }
    return value as FeatureFlagMap[K];
  }

  /**
   * Checks a boolean flag. A shorthand for `get`.
   */
  isEnabled(key: Extract<FeatureFlagKey, string>): boolean {
    const flagValue = this.get(key as any);
    if (typeof flagValue !== 'boolean') {
      console.warn(`Calling isEnabled on a non-boolean flag: ${key}`);
      return flagValue !== undefined && flagValue !== false;
    }
    return flagValue;
  }
}

// --- Singleton Instance ---

let globalFlagManager: FeatureFlagManager | null = null;

export function initializeFeatureFlags(provider: FlagProvider, defaultValues: Partial<FeatureFlagMap>): void {
  globalFlagManager = new FeatureFlagManager(provider, defaultValues);
}

export function useFeatureFlag(): FeatureFlagManager {
  if (!globalFlagManager) {
    // Default to a local provider if not initialized
    console.warn('Feature flags not initialized. Using default local provider.');
    initializeFeatureFlags(new LocalStorageProvider(), {});
  }
  return globalFlagManager!;
}

// --- Example Usage ---
/*
  // In your application's entry point
  const remoteProvider = new RemoteProvider('https://api.example.com/flags');
  const defaultFlags = {
    'enable-dream-sharing': false,
    'ai-analysis-model': 'basic',
  };
  initializeFeatureFlags(remoteProvider, defaultFlags);

  // In a component
  const featureFlags = useFeatureFlag();

  if (featureFlags.isEnabled('new-dashboard-layout')) {
    // render NewDashboard
  } else {
    // render OldDashboard
  }

  const model = featureFlags.get('ai-analysis-model');
  // Use the 'model' variable to configure AI analysis
*/ 