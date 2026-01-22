/**
 * Payment Model
 * Represents payment processing
 */

export interface Payment {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'digital_wallet';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recipient: string;
  description?: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface CreatePaymentDTO {
  userId: string;
  accountId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'digital_wallet';
  recipient: string;
  description?: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  transactionId?: string;
  message: string;
}
