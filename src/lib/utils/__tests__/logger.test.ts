import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger, logger, createLogger, logError, logPerformance } from '../logger';

describe('Logger', () => {
  const originalEnv = process.env.NODE_ENV;
  
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Logger class', () => {
    it('should log in development mode', () => {
      process.env.NODE_ENV = 'development';
      const testLogger = new Logger({ prefix: 'Test' });
      
      testLogger.info('Test message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should not log debug in production by default', () => {
      process.env.NODE_ENV = 'production';
      const testLogger = new Logger({ prefix: 'Test' });
      
      testLogger.debug('Debug message');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should log errors in production', () => {
      process.env.NODE_ENV = 'production';
      const testLogger = new Logger({ prefix: 'Test' });
      
      testLogger.error('Error message');
      expect(console.error).toHaveBeenCalled();
    });

    it('should respect enabled option', () => {
      const disabledLogger = new Logger({ enabled: false });
      
      disabledLogger.info('Test');
      disabledLogger.error('Error');
      
      expect(console.log).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('logError', () => {
    it('should log error with context', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Test error');
      
      logError(error, 'test-context', { extraData: 'value' });
      
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle non-Error objects', () => {
      process.env.NODE_ENV = 'development';
      
      logError('String error', 'test-context');
      
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('logPerformance', () => {
    it('should log performance in development', () => {
      process.env.NODE_ENV = 'development';
      
      logPerformance('operation', 150);
      
      expect(console.log).toHaveBeenCalled();
    });

    it('should not log performance in production', () => {
      process.env.NODE_ENV = 'production';
      
      logPerformance('operation', 150);
      
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('createLogger', () => {
    it('should create logger with prefix', () => {
      process.env.NODE_ENV = 'development';
      const customLogger = createLogger('Custom');
      
      customLogger.info('Test');
      
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Predefined loggers', () => {
    it('should export logger singleton', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
    });
  });
});
