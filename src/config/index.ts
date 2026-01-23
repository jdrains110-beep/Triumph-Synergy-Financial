/**
 * Application Configuration
 * Integrates main app (triumphsynergydi8363.pinet.com) with framework (triumphsynergy0576.pinet.com)
 */

import * as dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  // Server Configuration
  port: number;
  nodeEnv: string;
  
  // Main App Configuration (triumphsynergydi8363.pinet.com)
  mainApp: {
    url: string;
    apiKey: string;
  };
  
  // Framework Configuration (triumphsynergy0576.pinet.com)
  framework: {
    url: string;
    apiKey: string;
  };
  
  // Pi Network Configuration
  piNetwork: {
    apiKey: string;
    apiUrl: string;
    sandboxMode: boolean;
    appName: string;
  };
  
  // Database Configuration
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  
  // Security Configuration
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptRounds: number;
    corsOrigin: string;
  };
  
  // Logging Configuration
  logging: {
    level: string;
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mainApp: {
    url: process.env.MAIN_APP_URL || 'https://triumphsynergydi8363.pinet.com',
    apiKey: process.env.MAIN_APP_API_KEY || ''
  },
  
  framework: {
    url: process.env.FRAMEWORK_URL || 'https://triumphsynergy0576.pinet.com',
    apiKey: process.env.FRAMEWORK_API_KEY || ''
  },
  
  piNetwork: {
    apiKey: (() => {
      if (process.env.NODE_ENV === 'production' && !process.env.PI_API_KEY) {
        throw new Error('PI_API_KEY must be set in production environment');
      }
      return process.env.PI_API_KEY || '';
    })(),
    apiUrl: process.env.PI_API_URL || 'https://api.minepi.com',
    sandboxMode: process.env.PI_SANDBOX_MODE === 'true',
    appName: process.env.PI_APP_NAME || 'Triumph Synergy Financial'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'triumph_synergy_financial',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  
  security: {
    jwtSecret: (() => {
      if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set in production environment');
      }
      return process.env.JWT_SECRET || 'default_secret_change_in_production';
    })(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
