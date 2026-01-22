/**
 * Framework Core Module
 * 
 * This is the modular framework from triumphsynergy0576.pinet.com
 * Provides reusable components for building financial applications
 */

import { Logger } from './logger';
import { DatabaseManager } from './database';
import { SecurityModule } from './security';
import { ValidationModule } from './validation';

export interface FrameworkConfig {
  frameworkUrl: string;
  apiKey: string;
  environment: string;
}

export class Framework {
  private logger: Logger;
  private database: DatabaseManager;
  private security: SecurityModule;
  private validation: ValidationModule;
  private config: FrameworkConfig;

  constructor(config: FrameworkConfig) {
    this.config = config;
    this.logger = new Logger();
    this.database = new DatabaseManager();
    this.security = new SecurityModule();
    this.validation = new ValidationModule();
    
    this.logger.info('Framework initialized', { 
      url: config.frameworkUrl,
      environment: config.environment 
    });
  }

  /**
   * Initialize framework components
   */
  async initialize(): Promise<void> {
    try {
      await this.database.connect();
      this.logger.info('Framework database connected');
    } catch (error) {
      this.logger.error('Framework initialization failed', error);
      throw error;
    }
  }

  /**
   * Get logger instance
   */
  getLogger(): Logger {
    return this.logger;
  }

  /**
   * Get database manager
   */
  getDatabase(): DatabaseManager {
    return this.database;
  }

  /**
   * Get security module
   */
  getSecurity(): SecurityModule {
    return this.security;
  }

  /**
   * Get validation module
   */
  getValidation(): ValidationModule {
    return this.validation;
  }

  /**
   * Health check for framework components
   */
  async healthCheck(): Promise<{ status: string; components: Record<string, boolean> }> {
    const components = {
      logger: true,
      database: await this.database.isConnected(),
      security: true,
      validation: true
    };

    const allHealthy = Object.values(components).every(status => status === true);

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      components
    };
  }

  /**
   * Shutdown framework gracefully
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down framework...');
    await this.database.disconnect();
    this.logger.info('Framework shutdown complete');
  }
}
