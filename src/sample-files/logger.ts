// src/sample-files/logger.ts

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  extra?: Record<string, any>;
}

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, extra?: Record<string, any>) {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      extra,
    };
    console.log(JSON.stringify(logEntry, null, 2));
  }

  public info(message: string, extra?: Record<string, any>) {
    this.log(LogLevel.INFO, message, extra);
  }

  public warn(message: string, extra?: Record<string, any>) {
    this.log(LogLevel.WARN, message, extra);
  }

  public error(message: string, extra?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, extra);
  }

  public debug(message: string, extra?: Record<string, any>) {
    // In a real app, you might want to check an environment variable
    // before logging debug messages.
    this.log(LogLevel.DEBUG, message, extra);
  }
}

export const logger = Logger.getInstance(); 