/**
 * Transaction Model
 * Represents financial transactions
 */

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

export interface CreateTransactionDTO {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment';
  description?: string;
}

export interface TransactionHistory {
  id: string;
  accountId: string;
  amount: number;
  type: string;
  status: string;
  description?: string;
  createdAt: Date;
}
