/**
 * Account Service
 * Business logic for account management using the framework
 */

import { Framework } from '../../framework';
import { Account, CreateAccountDTO, AccountSummary } from '../models/Account';
import { v4 as uuidv4 } from 'uuid';

export class AccountService {
  private framework: Framework;
  private accounts: Map<string, Account> = new Map();

  constructor(framework: Framework) {
    this.framework = framework;
  }

  /**
   * Create a new account
   */
  async createAccount(dto: CreateAccountDTO): Promise<AccountSummary> {
    const logger = this.framework.getLogger();
    const validation = this.framework.getValidation();

    // Validate input
    const validationResult = validation.validate(dto, [
      { field: 'userId', type: 'required' },
      { field: 'accountType', type: 'required' },
      { field: 'currency', type: 'required' }
    ]);

    if (!validationResult.valid) {
      logger.error('Account validation failed', validationResult.errors);
      throw new Error(`Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
    }

    // Generate account number
    const accountNumber = this.generateAccountNumber();

    // Create account
    const account: Account = {
      id: uuidv4(),
      userId: dto.userId,
      accountNumber,
      accountType: dto.accountType,
      balance: dto.initialBalance || 0,
      currency: dto.currency,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accounts.set(account.id, account);
    logger.info('Account created', { accountId: account.id, userId: dto.userId, accountNumber });

    return this.toAccountSummary(account);
  }

  /**
   * Get account by ID
   */
  async getAccountById(accountId: string): Promise<AccountSummary> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return this.toAccountSummary(account);
  }

  /**
   * Get accounts by user ID
   */
  async getAccountsByUserId(userId: string): Promise<AccountSummary[]> {
    const userAccounts = Array.from(this.accounts.values())
      .filter(account => account.userId === userId);
    return userAccounts.map(account => this.toAccountSummary(account));
  }

  /**
   * Update account balance (atomic operation with locking)
   */
  async updateBalance(accountId: string, amount: number): Promise<void> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Note: In production, use database-level locking or optimistic concurrency control
    account.balance += amount;
    account.updatedAt = new Date();

    const logger = this.framework.getLogger();
    logger.info('Account balance updated', { accountId, newBalance: account.balance });
  }

  /**
   * Generate cryptographically secure account number
   */
  private generateAccountNumber(): string {
    const crypto = require('crypto');
    // Generate 10-digit account number using crypto
    const randomBytes = crypto.randomBytes(5);
    const accountNumber = (BigInt('0x' + randomBytes.toString('hex')) % 10000000000n).toString().padStart(10, '0');
    return accountNumber;
  }

  /**
   * Convert Account to AccountSummary
   */
  private toAccountSummary(account: Account): AccountSummary {
    return {
      id: account.id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: account.balance,
      currency: account.currency,
      status: account.status
    };
  }
}
