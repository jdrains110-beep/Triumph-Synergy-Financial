/**
 * Payment Model
 * Represents payment processing including Pi Network cryptocurrency payments
 */

export interface Payment {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'digital_wallet' | 'pi_payment';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  recipient: string;
  description?: string;
  createdAt: Date;
  processedAt?: Date;
  
  // Pi Network specific fields
  piPaymentId?: string;
  piTransactionId?: string;
  piUserUid?: string;
  piPaymentMetadata?: Record<string, any>;
  piPaymentDirection?: 'user_to_app' | 'app_to_user';
}

export interface CreatePaymentDTO {
  userId: string;
  accountId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'digital_wallet' | 'pi_payment';
  recipient: string;
  description?: string;
  
  // Optional Pi Network fields
  piUserUid?: string;
  piPaymentMetadata?: Record<string, any>;
}

export interface PaymentResult {
  id: string;
  status: string;
  transactionId?: string;
  message: string;
  
  // Pi Network specific
  piPaymentId?: string;
  piTransactionId?: string;
}
