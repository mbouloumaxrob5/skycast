// Système de logging conditionnel
// Les logs ne s'affichent qu'en développement (NODE_ENV !== 'production')

const isProduction = process.env.NODE_ENV === 'production';
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true';

// Types de log
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  enabled?: boolean;
}

class Logger {
  private prefix: string;
  private enabled: boolean;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix ? `[${options.prefix}] ` : '';
    // En production, désactivé par défaut sauf si DEBUG=true explicitement
    this.enabled = options.enabled ?? (!isProduction || isDebugEnabled);
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    
    // En production, seuls error et warn sont loggés par défaut
    if (isProduction && !isDebugEnabled) {
      return level === 'error' || level === 'warn';
    }
    
    return true;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} ${level.toUpperCase()} ${this.prefix}${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }
}

// Logger singleton pour l'application
export const logger = new Logger({ prefix: 'SkyCast' });

// Loggers spécifiques par module
export const createLogger = (prefix: string): Logger => {
  return new Logger({ prefix });
};

// Logger spécifiques
export const securityLogger = createLogger('Security');
export const apiLogger = createLogger('API');
export const weatherLogger = createLogger('Weather');
export const pushLogger = createLogger('Push');
export const swLogger = createLogger('ServiceWorker');

// Fonction utilitaire pour logger les erreurs avec contexte
export function logError(
  error: Error | unknown,
  context?: string,
  additionalData?: Record<string, unknown>
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  const logData = {
    context,
    error: errorMessage,
    stack: errorStack,
    ...additionalData,
    timestamp: new Date().toISOString(),
  };
  
  // En production, on pourrait envoyer à un service de monitoring
  if (isProduction) {
    // TODO: Envoyer à Sentry, LogRocket, ou autre service
    // Exemple: Sentry.captureException(error, { extra: additionalData });
  }
  
  logger.error('Error caught:', logData);
}

// Fonction pour logger les performances
export function logPerformance(operation: string, durationMs: number): void {
  if (!isProduction || isDebugEnabled) {
    logger.debug(`Performance: ${operation} took ${durationMs}ms`);
  }
}

export default logger;
