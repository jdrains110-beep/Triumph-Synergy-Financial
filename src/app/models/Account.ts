/**
 * Account Model
 * Represents a financial account
 */

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountDTO {
  userId: string;
  accountType: 'checking' | 'savings' | 'investment';
  currency: string;
  initialBalance?: number;
}

export interface AccountSummary {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
}
