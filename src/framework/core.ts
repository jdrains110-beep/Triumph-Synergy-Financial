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
import { PiSDKService } from './pi-sdk';

export interface FrameworkConfig {
  frameworkUrl: string;
  apiKey: string;
  environment: string;
  piApiKey?: string;
  piApiUrl?: string;
}

export class Framework {
  private logger: Logger;
  private database: DatabaseManager;
  private security: SecurityModule;
  private validation: ValidationModule;
  private piSdk?: PiSDKService;
  private config: FrameworkConfig;

  constructor(config: FrameworkConfig) {
    this.config = config;
    this.logger = new Logger();
    this.database = new DatabaseManager();
    this.security = new SecurityModule();
    this.validation = new ValidationModule();
    
    // Initialize Pi SDK if API key is provided
    if (config.piApiKey) {
      this.piSdk = new PiSDKService({
        apiKey: config.piApiKey,
        apiUrl: config.piApiUrl,
        environment: config.environment === 'production' ? 'production' : 'sandbox',
        logger: this.logger
      });
    }
    
    this.logger.info('Framework initialized', { 
      url: config.frameworkUrl,
      environment: config.environment,
      piSdkEnabled: !!this.piSdk
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
   * Get Pi SDK service
   */
  getPiSdk(): PiSDKService | undefined {
    return this.piSdk;
  }

  /**
   * Health check for framework components
   */
  async healthCheck(): Promise<{ status: string; components: Record<string, boolean> }> {
    const components: Record<string, boolean> = {
      logger: true,
      database: await this.database.isConnected(),
      security: true,
      validation: true,
      piSdk: !!this.piSdk
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
