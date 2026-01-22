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
import { config } from './config';
import { Framework } from './framework';
import { UserService } from './app/services/UserService';
import { AccountService } from './app/services/AccountService';
import { TransactionService } from './app/services/TransactionService';
import { PaymentService } from './app/services/PaymentService';

// Initialize Express application
const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.security.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Framework (from triumphsynergy0576.pinet.com)
const framework = new Framework({
  frameworkUrl: config.framework.url,
  apiKey: config.framework.apiKey,
  environment: config.nodeEnv
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
app.post('/api/users/register', async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req: Request, res: Response) => {
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
