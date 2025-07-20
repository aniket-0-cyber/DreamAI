/**
 * A logger utility for the DreamAI application.
 * This provides structured logging with different levels, formats, and transports.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  timestamp: Date;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

/**
 * Interface for a log transport, which defines where logs are sent.
 */
export interface LogTransport {
  log(entry: LogEntry): void;
}

/**
 * A transport that logs to the browser console with colors.
 */
export class ConsoleTransport implements LogTransport {
  private levelColors: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: 'gray',
    [LogLevel.INFO]: 'blue',
    [LogLevel.WARN]: 'orange',
    [LogLevel.ERROR]: 'red',
    [LogLevel.FATAL]: 'darkred',
  };

  log(entry: LogEntry): void {
    const { level, timestamp, message, context, error } = entry;
    const levelName = LogLevel[level];
    
    const color = this.levelColors[level] || 'black';
    const time = timestamp.toLocaleTimeString();

    console.groupCollapsed(
      `%c[${levelName}]%c ${time}: ${message}`,
      `color: ${color}; font-weight: bold;`,
      'color: inherit; font-weight: normal;'
    );

    if (context) {
      console.log('Context:', context);
    }
    if (error) {
      console.error(error);
    }

    console.groupEnd();
  }
}

/**
 * A transport that sends logs to a remote API endpoint.
 */
export class HttpTransport implements LogTransport {
  constructor(private endpointUrl: string, private batchSize: number = 10, private batchInterval: number = 5000) {
    this.buffer = [];
    setInterval(() => this.flush(), this.batchInterval);
  }

  private buffer: LogEntry[];

  async log(entry: LogEntry): Promise<void> {
    this.buffer.push(entry);
    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const batch = this.buffer.splice(0, this.batchSize);
    
    try {
      await fetch(this.endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      });
    } catch (error) {
      console.error('Failed to send logs to remote endpoint:', error);
      // Optional: Add logs back to the buffer for retry
      // this.buffer.unshift(...batch);
    }
  }
}

/**
 * The main Logger class.
 */
export class Logger {
  private transports: LogTransport[] = [];
  private minLevel: LogLevel = LogLevel.INFO;

  constructor(options?: { transports?: LogTransport[], minLevel?: LogLevel }) {
    if (options?.transports) {
      this.transports = options.transports;
    }
    if (options?.minLevel) {
      this.minLevel = options.minLevel;
    }
  }

  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  setLogLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return { level, message, context, error, timestamp: new Date() };
  }

  private write(entry: LogEntry): void {
    if (entry.level < this.minLevel) {
      return;
    }
    this.transports.forEach(transport => transport.log(entry));
  }

  debug(message: string, context?: Record<string, any>): void {
    this.write(this.createLogEntry(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: Record<string, any>): void {
    this.write(this.createLogEntry(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: Record<string, any>): void {
    this.write(this.createLogEntry(LogLevel.WARN, message, context));
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.write(this.createLogEntry(LogLevel.ERROR, message, context, error));
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.write(this.createLogEntry(LogLevel.FATAL, message, context, error));
  }

  /**
   * Creates a child logger with a persistent context.
   */
  createChild(context: Record<string, any>): Logger {
    const childLogger = new Logger({ transports: this.transports, minLevel: this.minLevel });
    
    const originalWrite = childLogger.write.bind(childLogger);
    childLogger.write = (entry: LogEntry) => {
      entry.context = { ...context, ...entry.context };
      originalWrite(entry);
    };

    return childLogger;
  }
}

// --- Singleton Logger Instance ---
// Provides a globally accessible logger.

let globalLogger: Logger | null = null;

export function getGlobalLogger(): Logger {
  if (!globalLogger) {
    globalLogger = new Logger({
      transports: [new ConsoleTransport()],
      minLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
    });
  }
  return globalLogger;
}

export function configureGlobalLogger(options: { transports?: LogTransport[], minLevel?: LogLevel }): void {
  globalLogger = new Logger(options);
}

// --- Example Usage ---
/*
  const logger = getGlobalLogger();
  logger.info('User logged in', { userId: '123' });
  logger.warn('API response is slow', { latency: 3000 });
  
  try {
    throw new Error('Something went wrong!');
  } catch (e) {
    logger.error('An unexpected error occurred', e as Error);
  }

  const userLogger = logger.createChild({ component: 'UserProfile' });
  userLogger.debug('Component mounted');
*/ 