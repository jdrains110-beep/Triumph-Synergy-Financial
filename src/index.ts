/**
 * Main Application Entry Point
 * 
 * Combines:
 * - Main App Foundation (triumphsynergydi8363.pinet.com)
 * - Framework Components (triumphsynergy0576.pinet.com)
 * 
 * Creates a superior digital financial ecosystem
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import { Framework } from './framework';
import { UserService } from './app/services/UserService';
import { AccountService } from './app/services/AccountService';
import { TransactionService } from './app/services/TransactionService';
import { PaymentService } from './app/services/PaymentService';

// Initialize Express application
const app = express();

// Rate limiting middleware for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later'
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://sdk.minepi.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.minepi.com"]
    }
  }
}));
app.use(cors({ origin: config.security.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pi Network Domain Validation Routes - MUST BE BEFORE static middleware
// These routes must be defined FIRST so they take precedence over static files

// Standard Pi validation path - checks Host header for environment
app.get('/.well-known/pi-domain-validation.txt', (req: Request, res: Response) => {
  try {
    const host = req.get('host') || '';
    console.log(`Pi validation request from host: ${host}`);

    // Check for testnet subdomain (correct Pi validation pattern)
    if (host.startsWith('testnet.') || host.includes('testnet.')) {
      const testnetKey = process.env.PI_TESTNET_VALIDATION_KEY;
      if (!testnetKey) {
        console.error('PI_TESTNET_VALIDATION_KEY environment variable not set');
        return res.status(500).send('Server configuration error');
      }
      console.log('Returning testnet validation key from environment');
      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.set('Cache-Control', 'no-cache');
      res.send(testnetKey);
    } else {
      const mainnetKey = process.env.PI_MAINNET_VALIDATION_KEY;
      if (!mainnetKey) {
        console.error('PI_MAINNET_VALIDATION_KEY environment variable not set');
        return res.status(500).send('Server configuration error');
      }
      console.log('Returning mainnet validation key from environment');
      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.set('Cache-Control', 'no-cache');
      res.send(mainnetKey);
    }
  } catch (error) {
    console.error('Error in Pi validation endpoint:', error);
    res.status(500).send('Internal server error');
  }
});

// Legacy validation path - MUST BE BEFORE static middleware
app.get('/validation-key.txt', (req: Request, res: Response) => {
  try {
    const host = req.get('host') || '';
    console.log(`Legacy validation from host header: ${host}`);

    if (host.startsWith('testnet.') || host.includes('testnet.')) {
      const testnetKey = process.env.PI_TESTNET_VALIDATION_KEY;
      if (!testnetKey) {
        console.error('PI_TESTNET_VALIDATION_KEY environment variable not set');
        return res.status(500).send('Server configuration error');
      }
      console.log('Returning TESTNET key');
      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.set('Cache-Control', 'no-cache');
      res.send(testnetKey);
    } else {
      const mainnetKey = process.env.PI_MAINNET_VALIDATION_KEY;
      if (!mainnetKey) {
        console.error('PI_MAINNET_VALIDATION_KEY environment variable not set');
        return res.status(500).send('Server configuration error');
      }
      console.log('Returning MAINNET key');
      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.set('Cache-Control', 'no-cache');
      res.send(mainnetKey);
    }
  } catch (error) {
    console.error('Error in validation-key.txt endpoint:', error);
    res.status(500).send('Internal server error');
  }
});

// Alternative validation paths that Pi might check
app.get('/pi-domain-validation.txt', (req: Request, res: Response) => {
  const host = req.get('host') || '';
  console.log(`Pi validation (alt path) from host: ${host}`);

  if (host.startsWith('testnet.') || host.includes('testnet.')) {
    const testnetKey = process.env.PI_TESTNET_VALIDATION_KEY;
    if (!testnetKey) {
      console.error('PI_TESTNET_VALIDATION_KEY environment variable not set');
      return res.status(500).send('Server configuration error');
    }
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'no-cache');
    res.send(testnetKey);
  } else {
    const mainnetKey = process.env.PI_MAINNET_VALIDATION_KEY;
    if (!mainnetKey) {
      console.error('PI_MAINNET_VALIDATION_KEY environment variable not set');
      return res.status(500).send('Server configuration error');
    }
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'no-cache');
    res.send(mainnetKey);
  }
});

// Serve static files with domain-based routing (for Pi Browser frontend)
// This MUST come AFTER validation routes
app.use('/validation-key.txt', (req: Request, res: Response, next: NextFunction) => {
  try {
    const host = req.get('host') || '';
    const isTestnet = host.startsWith('testnet.') || host.includes('testnet.');

    const staticPath = isTestnet
      ? path.join(__dirname, '../public/testnet/validation-key.txt')
      : path.join(__dirname, '../public/mainnet/validation-key.txt');

    if (fs.existsSync(staticPath)) {
      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.set('Cache-Control', 'no-cache');
      res.sendFile(staticPath);
    } else {
      next();
    }
  } catch (error) {
    console.error('Error serving validation-key.txt:', error);
    next();
  }
});

app.use('/.well-known/pi-domain-validation.txt', (req: Request, res: Response, next: NextFunction) => {
  try {
    const host = req.get('host') || '';
    const isTestnet = host.startsWith('testnet.') || host.includes('testnet.');

    const staticPath = isTestnet
      ? path.join(__dirname, '../public/testnet/.well-known/pi-domain-validation.txt')
      : path.join(__dirname, '../public/mainnet/.well-known/pi-domain-validation.txt');

    if (fs.existsSync(staticPath)) {
      res.set('Content-Type', 'text/plain; charset=utf-8');
      res.set('Cache-Control', 'no-cache');
      res.sendFile(staticPath);
    } else {
      next();
    }
  } catch (error) {
    console.error('Error serving pi-domain-validation.txt:', error);
    next();
  }
});

// Serve other static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Debug endpoint to check validation setup
app.get('/debug/pi-validation', (req: Request, res: Response) => {
  const host = req.get('host') || '';
  const userAgent = req.get('user-agent') || '';
  const isTestnet = host.startsWith('testnet.');

  const testnetKey = process.env.PI_TESTNET_VALIDATION_KEY;
  const mainnetKey = process.env.PI_MAINNET_VALIDATION_KEY;

  res.json({
    host,
    userAgent,
    isTestnet,
    testnetKey: testnetKey ? `${testnetKey.substring(0, 20)}...` : 'NOT SET',
    mainnetKey: mainnetKey ? `${mainnetKey.substring(0, 20)}...` : 'NOT SET',
    availableEndpoints: [
      '/.well-known/pi-domain-validation.txt',
      '/pi-domain-validation.txt',
      '/testnet/.well-known/pi-domain-validation.txt',
      '/mainnet/.well-known/pi-domain-validation.txt',
      '/validation-key.txt'
    ],
    correctDomains: {
      testnet: 'testnet.triumphsynergydi8363.pinet.com',
      mainnet: 'triumphsynergydi8363.pinet.com'
    },
    environmentVariables: {
      PI_TESTNET_VALIDATION_KEY: testnetKey ? 'SET' : 'NOT SET',
      PI_MAINNET_VALIDATION_KEY: mainnetKey ? 'SET' : 'NOT SET'
    }
  });
});

// Initialize Framework (from triumphsynergy0576.pinet.com)
const framework = new Framework({
  frameworkUrl: config.framework.url,
  apiKey: config.framework.apiKey,
  environment: config.nodeEnv,
  piApiKey: config.piNetwork.apiKey,
  piApiUrl: config.piNetwork.apiUrl
});

// Initialize Services (Main App from triumphsynergydi8363.pinet.com)
const userService = new UserService(framework);
const accountService = new AccountService(framework);
const transactionService = new TransactionService(framework, accountService);
const paymentService = new PaymentService(framework, accountService);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    const frameworkHealth = await framework.healthCheck();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mainApp: config.mainApp.url,
      framework: config.framework.url,
      frameworkComponents: frameworkHealth
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Service unavailable'
    });
  }
});

// API Information
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Triumph Synergy Financial - Digital Ecosystem',
    version: '1.0.0',
    description: 'Superior Digital Financial Ecosystem combining main app foundation with modular framework',
    mainApp: config.mainApp.url,
    framework: config.framework.url,
    endpoints: {
      health: '/health',
      users: '/api/users',
      accounts: '/api/accounts',
      transactions: '/api/transactions',
      payments: '/api/payments'
    }
  });
});

// User endpoints
app.post('/api/users/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.authenticate(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/api/users/:userId', async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Account endpoints
app.post('/api/accounts', async (req: Request, res: Response) => {
  try {
    const account = await accountService.createAccount(req.body);
    res.status(201).json(account);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/accounts/:accountId', async (req: Request, res: Response) => {
  try {
    const account = await accountService.getAccountById(req.params.accountId);
    res.json(account);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/users/:userId/accounts', async (req: Request, res: Response) => {
  try {
    const accounts = await accountService.getAccountsByUserId(req.params.userId);
    res.json(accounts);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Transaction endpoints
app.post('/api/transactions', async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/transactions/:transactionId', async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.transactionId);
    res.json(transaction);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/accounts/:accountId/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getTransactionsByAccountId(req.params.accountId);
    res.json(transactions);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Payment endpoints
app.post('/api/payments', async (req: Request, res: Response) => {
  try {
    const result = await paymentService.processPayment(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/payments/:paymentId', async (req: Request, res: Response) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.paymentId);
    res.json(payment);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/users/:userId/payments', async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getPaymentsByUserId(req.params.userId);
    res.json(payments);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Pi Network specific endpoints
app.post('/api/pi/auth', authLimiter, async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const piSdk = framework.getPiSdk();
    
    if (!piSdk) {
      return res.status(503).json({ error: 'Pi Network integration not configured' });
    }

    const authResult = await piSdk.verifyAuthentication(accessToken);
    
    // Create or update user with Pi credentials
    const user = await userService.createOrUpdatePiUser(authResult.user);
    
    // Generate JWT token for app authentication
    const token = framework.getSecurity().generateToken({ 
      userId: user.id, 
      email: user.email,
      role: user.role 
    });

    res.json({
      user,
      token,
      piUser: authResult.user
    });
  } catch (error: any) {
    framework.getLogger().error('Pi authentication failed', error);
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/pi/payments/:paymentId/approve', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const piSdk = framework.getPiSdk();
    
    if (!piSdk) {
      return res.status(503).json({ error: 'Pi Network integration not configured' });
    }

    const payment = await piSdk.approvePayment(paymentId);
    framework.getLogger().info('Pi payment approved', { paymentId });
    
    res.json(payment);
  } catch (error: any) {
    framework.getLogger().error('Pi payment approval failed', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/pi/payments/:paymentId/complete', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { txid } = req.body;
    const piSdk = framework.getPiSdk();
    
    if (!piSdk) {
      return res.status(503).json({ error: 'Pi Network integration not configured' });
    }

    const payment = await piSdk.completePayment(paymentId, txid);
    framework.getLogger().info('Pi payment completed', { paymentId, txid });
    
    res.json(payment);
  } catch (error: any) {
    framework.getLogger().error('Pi payment completion failed', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/pi/payments/:paymentId', async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const piSdk = framework.getPiSdk();
    
    if (!piSdk) {
      return res.status(503).json({ error: 'Pi Network integration not configured' });
    }

    const payment = await piSdk.getPayment(paymentId);
    res.json(payment);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/pi/payments/incomplete/:userUid', async (req: Request, res: Response) => {
  try {
    const { userUid } = req.params;
    const piSdk = framework.getPiSdk();
    
    if (!piSdk) {
      return res.status(503).json({ error: 'Pi Network integration not configured' });
    }

    const payments = await piSdk.getIncompletePayments(userUid);
    res.json(payments);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  framework.getLogger().error('Unhandled error', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// Start server
async function start() {
  try {
    // Initialize framework
    await framework.initialize();
    framework.getLogger().info('Framework initialized successfully');

    // Start server
    app.listen(config.port, () => {
      framework.getLogger().info(`Server started`, {
        port: config.port,
        environment: config.nodeEnv,
        mainApp: config.mainApp.url,
        framework: config.framework.url
      });
      
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Triumph Synergy Financial - Digital Ecosystem                 ║
║  Superior Digital Financial Platform                           ║
╠════════════════════════════════════════════════════════════════╣
║  Main App:    ${config.mainApp.url.padEnd(42)} ║
║  Framework:   ${config.framework.url.padEnd(42)} ║
║  Server:      http://localhost:${config.port.toString().padEnd(36)} ║
║  Environment: ${config.nodeEnv.padEnd(46)} ║
╚════════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      framework.getLogger().info('SIGTERM received, shutting down gracefully');
      await framework.shutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      framework.getLogger().info('SIGINT received, shutting down gracefully');
      await framework.shutdown();
      process.exit(0);
    });
  } catch (error) {
    framework.getLogger().error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the application
start();

export { app, framework };
