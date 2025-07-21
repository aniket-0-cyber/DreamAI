// src/sample-files/feature-flags.ts

interface FeatureFlags {
  [key: string]: boolean;
}

class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: FeatureFlags = {};

  private constructor() {
    // In a real application, you would fetch these from a remote config,
    // like LaunchDarkly, Firebase Remote Config, or your own service.
    this.flags = {
      'new-dashboard-view': true,
      'beta-user-profile': false,
      'enable-analytics-tracking': true,
      'show-experimental-feature-x': false,
    };
  }

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  public isEnabled(flagName: string): boolean {
    return this.flags[flagName] || false;
  }

  public getFlags(): FeatureFlags {
    return { ...this.flags };
  }

  // This would likely be protected and only used by your config fetching service.
  public setFlags(newFlags: FeatureFlags) {
    this.flags = { ...this.flags, ...newFlags };
  }
}

export const featureFlags = FeatureFlagManager.getInstance(); 