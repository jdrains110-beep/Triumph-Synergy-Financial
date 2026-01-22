/**
 * Transaction Service
 * Business logic for transaction processing using the framework
 */

import { Framework } from '../../framework';
import { Transaction, CreateTransactionDTO, TransactionHistory } from '../models/Transaction';
import { AccountService } from './AccountService';
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
  private framework: Framework;
  private accountService: AccountService;
  private transactions: Map<string, Transaction> = new Map();

  constructor(framework: Framework, accountService: AccountService) {
    this.framework = framework;
    this.accountService = accountService;
  }

  /**
   * Create and process a transaction
   */
  async createTransaction(dto: CreateTransactionDTO): Promise<TransactionHistory> {
    const logger = this.framework.getLogger();
    const validation = this.framework.getValidation();

    // Validate input
    const validationResult = validation.validate(dto, [
      { field: 'fromAccountId', type: 'required' },
      { field: 'toAccountId', type: 'required' },
      { field: 'amount', type: 'required' },
      { field: 'amount', type: 'positive' },
      { field: 'currency', type: 'required' },
      { field: 'type', type: 'required' }
    ]);

    if (!validationResult.valid) {
      logger.error('Transaction validation failed', validationResult.errors);
      throw new Error(`Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
    }

    // Validate transaction amount
    const amountValidation = validation.validateTransactionAmount(dto.amount);
    if (!amountValidation.valid) {
      throw new Error(`Amount validation failed: ${amountValidation.errors.map(e => e.message).join(', ')}`);
    }

    // Create transaction
    const transaction: Transaction = {
      id: uuidv4(),
      fromAccountId: dto.fromAccountId,
      toAccountId: dto.toAccountId,
      amount: dto.amount,
      currency: dto.currency,
      type: dto.type,
      status: 'pending',
      description: dto.description,
      createdAt: new Date()
    };

    this.transactions.set(transaction.id, transaction);
    logger.info('Transaction created', { transactionId: transaction.id, amount: dto.amount });

    // Process transaction
    try {
      await this.processTransaction(transaction);
      transaction.status = 'completed';
      transaction.completedAt = new Date();
      logger.info('Transaction completed', { transactionId: transaction.id });
    } catch (error) {
      transaction.status = 'failed';
      logger.error('Transaction failed', error);
      throw error;
    }

    return this.toTransactionHistory(transaction);
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<TransactionHistory> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return this.toTransactionHistory(transaction);
  }

  /**
   * Get transactions by account ID
   */
  async getTransactionsByAccountId(accountId: string): Promise<TransactionHistory[]> {
    const accountTransactions = Array.from(this.transactions.values())
      .filter(t => t.fromAccountId === accountId || t.toAccountId === accountId);
    return accountTransactions.map(t => this.toTransactionHistory(t));
  }

  /**
   * Process transaction - update account balances atomically
   */
  private async processTransaction(transaction: Transaction): Promise<void> {
    const database = this.framework.getDatabase();
    
    // Use database transaction for atomicity
    // In production, this would use proper database transactions
    await database.transaction(async () => {
      // Deduct from source account
      await this.accountService.updateBalance(transaction.fromAccountId, -transaction.amount);
      
      // Add to destination account
      await this.accountService.updateBalance(transaction.toAccountId, transaction.amount);
    });
  }

  /**
   * Convert Transaction to TransactionHistory
   */
  private toTransactionHistory(transaction: Transaction): TransactionHistory {
    return {
      id: transaction.id,
      accountId: transaction.fromAccountId,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      description: transaction.description,
      createdAt: transaction.createdAt
    };
  }
}
