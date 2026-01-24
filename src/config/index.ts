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
    testnetApiKey: string;
    mainnetApiKey: string;
    apiUrl: string;
    sandboxMode: boolean;
    appName: string;
    testnetWalletAddress: string;
    appId: string;
    ownerPiAddress: string;
    ownerUserId: string;
    ownerUsername: string;
    backendUrl: string;
    apiBaseUrl: string;
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
    apiKey: process.env.PI_API_KEY || 'hinycem5ehwhtyqnqjjutebqc6abqwboooo7le9ir4ltfoy6ieetqxl36zirwevh',
    testnetApiKey: process.env.PI_TESTNET_API_KEY || 'du1td5k3lptmqgl7327zwsdwqxczmizgrstgexfjshkqqso3qei8jzafqkyh3lv6',
    mainnetApiKey: process.env.PI_MAINNET_API_KEY || 'hinycem5ehwhtyqnqjjutebqc6abqwboooo7le9ir4ltfoy6ieetqxl36zirwevh',
    apiUrl: process.env.PI_API_URL || 'https://api.minepi.com',
    sandboxMode: process.env.PI_SANDBOX_MODE === 'true',
    appName: process.env.PI_APP_NAME || 'Triumph Synergy Financial',
    testnetWalletAddress: process.env.PI_TESTNET_WALLET_ADDRESS || 'GCWRILOEJQICSRHPZZ262DJGZMCVPZZASGHWBHMLGVH7DABSSELPK4TD',
    appId: process.env.NEXT_PUBLIC_PI_APP_ID || 'Triumph-synergy digital financial ecosystem',
    ownerPiAddress: process.env.NEXT_PUBLIC_OWNER_PI_ADDRESS || 'GDINCI6L7M3J3YTUEMSX3SP2OD7VBJEVX6DTC3BHLD4SD4CMVQ2DVTMF',
    ownerUserId: process.env.NEXT_PUBLIC_OWNER_USER_ID || 'Jdrains30',
    ownerUsername: process.env.NEXT_PUBLIC_OWNER_USERNAME || 'jdrains30',
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend-url.com',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api-url.com'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'triumph_synergy_financial',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET || 'triumph_synergy_jwt_secret_2026_production_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
