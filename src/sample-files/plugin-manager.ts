/**
 * A plugin management system for the DreamAI application.
 * This demonstrates the Adapter or Strategy pattern, allowing for modular
 * and extensible functionality. New features can be added as self-contained plugins.
 */

// The context object that will be passed to every plugin.
// This allows plugins to interact with the core application in a controlled way.
export interface AppContext {
  getAppName: () => string;
  log: (message: string) => void;
  // In a real app, this could include API services, event bus, etc.
}

/**
 * The interface that all plugins must implement.
 */
export interface Plugin {
  readonly name: string;
  initialize(context: AppContext): Promise<void>;
  destroy(): Promise<void>;
}

/**
 * The PluginManager class discovers, registers, and manages the lifecycle of plugins.
 */
export class PluginManager {
  private registeredPlugins = new Map<string, Plugin>();

  /**
   * Registers one or more plugins.
   */
  register(plugins: Plugin[]): this {
    for (const plugin of plugins) {
      if (this.registeredPlugins.has(plugin.name)) {
        console.warn(`Plugin "${plugin.name}" is already registered. Skipping.`);
        continue;
      }
      this.registeredPlugins.set(plugin.name, plugin);
    }
    return this;
  }

  /**
   * Initializes all registered plugins.
   * @param context The application context to provide to the plugins.
   */
  async initializeAll(context: AppContext): Promise<void> {
    for (const [name, plugin] of this.registeredPlugins.entries()) {
      try {
        context.log(`Initializing plugin: ${name}...`);
        await plugin.initialize(context);
        context.log(`Plugin "${name}" initialized successfully.`);
      } catch (error) {
        console.error(`Failed to initialize plugin "${name}":`, error);
      }
    }
  }

  /**
   * Destroys all registered plugins, for graceful shutdown.
   */
  async destroyAll(): Promise<void> {
    for (const [name, plugin] of this.registeredPlugins.entries()) {
      try {
        console.log(`Destroying plugin: ${name}...`);
        await plugin.destroy();
      } catch (error) {
        console.error(`Failed to destroy plugin "${name}":`, error);
      }
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.registeredPlugins.get(name);
  }
}

// --- Example Plugins ---

/**
 * An example plugin for sending analytics events.
 */
export class AnalyticsPlugin implements Plugin {
  readonly name = 'Analytics';
  private context?: AppContext;

  async initialize(context: AppContext): Promise<void> {
    this.context = context;
    this.trackEvent('plugin_initialized', { app: context.getAppName() });
  }

  async destroy(): Promise<void> {
    this.trackEvent('plugin_destroyed');
    this.context = undefined;
  }

  trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    this.context?.log(`[Analytics] Event: ${eventName}, Properties: ${JSON.stringify(properties)}`);
    // In a real scenario, this would send data to an analytics service.
  }
}

/**
 * An example plugin for automatic data backup.
 */
export class DataBackupPlugin implements Plugin {
  readonly name = 'DataBackup';
  private backupInterval?: ReturnType<typeof setInterval>;

  async initialize(context: AppContext): Promise<void> {
    this.backupInterval = setInterval(() => {
      context.log('[DataBackup] Performing scheduled backup of application data...');
      // Simulate backup logic here
    }, 30 * 1000); // Backup every 30 seconds
  }

  async destroy(): Promise<void> {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }
    console.log('[DataBackup] Backup process stopped.');
  }
}


// --- Example Usage ---
/*
  async function runPluginSystem() {
    const appContext: AppContext = {
      getAppName: () => 'DreamAI v2.0',
      log: (message) => console.log(`[App Core] ${message}`),
    };

    const pluginManager = new PluginManager();
    
    // Register plugins
    pluginManager.register([
      new AnalyticsPlugin(),
      new DataBackupPlugin(),
    ]);

    // Initialize all plugins
    await pluginManager.initializeAll(appContext);

    // Let the app run for a bit...
    // You'll see the backup plugin logging messages periodically.
    const analytics = pluginManager.getPlugin('Analytics') as AnalyticsPlugin;
    analytics?.trackEvent('user_logged_in', { userId: '12345' });

    // Simulate app shutdown
    setTimeout(async () => {
      console.log('\n--- Shutting down application ---');
      await pluginManager.destroyAll();
    }, 65 * 1000);
  }

  runPluginSystem();
*/ 