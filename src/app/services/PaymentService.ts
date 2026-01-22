/**
 * Payment Service
 * Business logic for payment processing using the framework
 */

import { Framework } from '../../framework';
import { Payment, CreatePaymentDTO, PaymentResult } from '../models/Payment';
import { AccountService } from './AccountService';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
  private framework: Framework;
  private accountService: AccountService;
  private payments: Map<string, Payment> = new Map();

  constructor(framework: Framework, accountService: AccountService) {
    this.framework = framework;
    this.accountService = accountService;
  }

  /**
   * Process a payment
   */
  async processPayment(dto: CreatePaymentDTO): Promise<PaymentResult> {
    const logger = this.framework.getLogger();
    const validation = this.framework.getValidation();

    // Validate input
    const validationResult = validation.validate(dto, [
      { field: 'userId', type: 'required' },
      { field: 'accountId', type: 'required' },
      { field: 'amount', type: 'required' },
      { field: 'amount', type: 'positive' },
      { field: 'currency', type: 'required' },
      { field: 'paymentMethod', type: 'required' },
      { field: 'recipient', type: 'required' }
    ]);

    if (!validationResult.valid) {
      logger.error('Payment validation failed', validationResult.errors);
      throw new Error(`Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
    }

    // Create payment
    const payment: Payment = {
      id: uuidv4(),
      userId: dto.userId,
      accountId: dto.accountId,
      amount: dto.amount,
      currency: dto.currency,
      paymentMethod: dto.paymentMethod,
      status: 'pending',
      recipient: dto.recipient,
      description: dto.description,
      createdAt: new Date()
    };

    this.payments.set(payment.id, payment);
    logger.info('Payment created', { paymentId: payment.id, amount: dto.amount });

    // Process payment
    try {
      payment.status = 'processing';
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Deduct amount from account
      await this.accountService.updateBalance(payment.accountId, -payment.amount);
      
      payment.status = 'completed';
      payment.processedAt = new Date();
      
      logger.info('Payment completed', { paymentId: payment.id });

      return {
        id: payment.id,
        status: payment.status,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      payment.status = 'failed';
      logger.error('Payment failed', error);
      
      return {
        id: payment.id,
        status: payment.status,
        message: 'Payment processing failed'
      };
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  /**
   * Get payments by user ID
   */
  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId);
  }
}
