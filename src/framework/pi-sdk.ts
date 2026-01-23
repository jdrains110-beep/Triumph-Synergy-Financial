/**
 * Pi Network SDK Integration
 * 
 * Handles Pi Network authentication and payment processing
 * Integrates with Pi Platform API (https://api.minepi.com)
 * 
 * Documentation: https://github.com/pi-apps/pi-platform-docs
 */

import axios, { AxiosInstance } from 'axios';
import { Logger } from './logger';

// Pi Network API Types
export interface PiAuthResult {
  accessToken: string;
  user: PiUser;
}

export interface PiUser {
  uid: string;
  username: string;
}

export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  from_address: string;
  to_address: string;
  direction: 'user_to_app' | 'app_to_user';
  created_at: string;
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction?: {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export interface CreatePaymentDTO {
  amount: number;
  memo: string;
  metadata: Record<string, any>;
}

export interface ApprovePaymentDTO {
  identifier: string;
}

export interface CompletePaymentDTO {
  identifier: string;
  txid: string;
}

export interface PiSDKConfig {
  apiKey: string;
  apiUrl?: string;
  environment?: 'production' | 'sandbox';
  logger?: Logger;
}

/**
 * Pi Network SDK Service
 * 
 * Provides methods for:
 * - Authenticating users via Pi Browser
 * - Creating and managing Pi payments
 * - Verifying payment transactions
 */
export class PiSDKService {
  private apiKey: string;
  private apiUrl: string;
  private client: AxiosInstance;
  private logger?: Logger;

  constructor(config: PiSDKConfig) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || 'https://api.minepi.com';
    this.logger = config.logger;

    // Initialize axios client for Pi Platform API
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Key ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    this.logger?.info('Pi SDK Service initialized', { 
      apiUrl: this.apiUrl,
      environment: config.environment 
    });
  }

  /**
   * Verify Pi Network user authentication token
   * Called after frontend authenticates user with Pi.authenticate()
   */
  async verifyAuthentication(accessToken: string): Promise<PiAuthResult> {
    try {
      this.logger?.info('Verifying Pi authentication token');

      const response = await this.client.get('/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const user = response.data;
      this.logger?.info('Pi authentication verified', { uid: user.uid });

      return {
        accessToken,
        user: {
          uid: user.uid,
          username: user.username
        }
      };
    } catch (error: any) {
      this.logger?.error('Pi authentication verification failed', error);
      throw new Error('Failed to verify Pi authentication: ' + error.message);
    }
  }

  /**
   * Approve a payment request (Server-Side Approval)
   * Called when user initiates payment on frontend
   */
  async approvePayment(paymentId: string): Promise<PiPayment> {
    try {
      this.logger?.info('Approving Pi payment', { paymentId });

      const response = await this.client.post(`/v2/payments/${paymentId}/approve`);
      const payment = response.data;

      this.logger?.info('Pi payment approved', { 
        paymentId, 
        amount: payment.amount 
      });

      return payment;
    } catch (error: any) {
      this.logger?.error('Pi payment approval failed', { paymentId, error });
      throw new Error('Failed to approve Pi payment: ' + error.message);
    }
  }

  /**
   * Complete a payment (Server-Side Completion)
   * Called after transaction is submitted to blockchain
   */
  async completePayment(paymentId: string, txid: string): Promise<PiPayment> {
    try {
      this.logger?.info('Completing Pi payment', { paymentId, txid });

      const response = await this.client.post(`/v2/payments/${paymentId}/complete`, {
        txid
      });

      const payment = response.data;

      this.logger?.info('Pi payment completed', { 
        paymentId, 
        txid,
        verified: payment.transaction?.verified 
      });

      return payment;
    } catch (error: any) {
      this.logger?.error('Pi payment completion failed', { paymentId, txid, error });
      throw new Error('Failed to complete Pi payment: ' + error.message);
    }
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<PiPayment> {
    try {
      this.logger?.info('Fetching Pi payment', { paymentId });

      const response = await this.client.get(`/v2/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      this.logger?.error('Failed to fetch Pi payment', { paymentId, error });
      throw new Error('Failed to get Pi payment: ' + error.message);
    }
  }

  /**
   * Cancel a payment
   */
  async cancelPayment(paymentId: string): Promise<PiPayment> {
    try {
      this.logger?.info('Cancelling Pi payment', { paymentId });

      const response = await this.client.post(`/v2/payments/${paymentId}/cancel`);
      const payment = response.data;

      this.logger?.info('Pi payment cancelled', { paymentId });
      return payment;
    } catch (error: any) {
      this.logger?.error('Failed to cancel Pi payment', { paymentId, error });
      throw new Error('Failed to cancel Pi payment: ' + error.message);
    }
  }

  /**
   * Create an App-to-User payment
   * Transfer Pi from app wallet to user
   */
  async createAppToUserPayment(
    userUid: string, 
    amount: number, 
    memo: string, 
    metadata: Record<string, any> = {}
  ): Promise<PiPayment> {
    try {
      this.logger?.info('Creating app-to-user Pi payment', { userUid, amount });

      const response = await this.client.post('/v2/payments', {
        payment: {
          amount,
          memo,
          metadata,
          uid: userUid
        }
      });

      const payment = response.data;

      this.logger?.info('App-to-user Pi payment created', { 
        paymentId: payment.identifier,
        amount 
      });

      return payment;
    } catch (error: any) {
      this.logger?.error('Failed to create app-to-user payment', { userUid, amount, error });
      throw new Error('Failed to create app-to-user Pi payment: ' + error.message);
    }
  }

  /**
   * Get incomplete payments for a user
   * Useful for recovering from interrupted payment flows
   */
  async getIncompletePayments(userUid: string): Promise<PiPayment[]> {
    try {
      this.logger?.info('Fetching incomplete Pi payments', { userUid });

      const response = await this.client.get('/v2/payments/incomplete', {
        params: { uid: userUid }
      });

      return response.data || [];
    } catch (error: any) {
      this.logger?.error('Failed to fetch incomplete payments', { userUid, error });
      throw new Error('Failed to get incomplete Pi payments: ' + error.message);
    }
  }

  /**
   * Verify a transaction on Pi blockchain
   */
  async verifyTransaction(txid: string): Promise<boolean> {
    try {
      this.logger?.info('Verifying Pi transaction', { txid });

      // Transaction verification is typically done by the Pi Network
      // when completing a payment. This method can be used for
      // additional verification if needed.
      
      const response = await this.client.get(`/v2/transactions/${txid}`);
      const transaction = response.data;

      this.logger?.info('Pi transaction verified', { 
        txid, 
        verified: transaction.verified 
      });

      return transaction.verified;
    } catch (error: any) {
      this.logger?.error('Failed to verify transaction', { txid, error });
      return false;
    }
  }

  /**
   * Health check for Pi SDK service
   */
  async healthCheck(): Promise<{ status: string; apiUrl: string }> {
    try {
      // Simple health check - verify API key is configured
      if (!this.apiKey) {
        return { 
          status: 'error', 
          apiUrl: this.apiUrl 
        };
      }

      return { 
        status: 'healthy', 
        apiUrl: this.apiUrl 
      };
    } catch (error) {
      return { 
        status: 'error', 
        apiUrl: this.apiUrl 
      };
    }
  }
}
