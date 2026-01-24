/**
 * Integration Example
 * 
 * Demonstrates how to use the integrated ecosystem
 * Shows the combination of Main App (triumphsynergydi8363.pinet.com) 
 * with Framework (triumphsynergy0576.pinet.com)
 */

import { Framework } from '../framework';
import { UserService } from '../app/services/UserService';
import { AccountService } from '../app/services/AccountService';
import { TransactionService } from '../app/services/TransactionService';
import { PaymentService } from '../app/services/PaymentService';

/**
 * Example: Complete user journey through the financial ecosystem
 */
export async function demonstrateIntegration() {
  // Initialize Framework (triumphsynergy0576.pinet.com)
  console.log('🔧 Initializing Framework from triumphsynergy0576.pinet.com...');
  const framework = new Framework({
    frameworkUrl: 'https://triumphsynergy0576.pinet.com',
    apiKey: 'demo-api-key',
    environment: 'development'
  });

  await framework.initialize();
  console.log('✅ Framework initialized successfully\n');

  // Initialize Main App Services (triumphsynergydi8363.pinet.com)
  console.log('🚀 Initializing Main App from triumphsynergydi8363.pinet.com...');
  const userService = new UserService(framework);
  const accountService = new AccountService(framework);
  const transactionService = new TransactionService(framework, accountService);
  const paymentService = new PaymentService(framework, accountService);
  console.log('✅ Main App services initialized successfully\n');

  try {
    // Step 1: Register a new user
    console.log('👤 Step 1: Registering new user...');
    const user = await userService.createUser({
      email: 'john.doe@example.com',
      password: 'SecurePassword123!',
      firstName: 'John',
      lastName: 'Doe'
    });
    console.log('✅ User registered:', user);
    console.log('');

    // Step 2: Authenticate user
    console.log('🔐 Step 2: Authenticating user...');
    const authResult = await userService.authenticate('john.doe@example.com', 'SecurePassword123!');
    console.log('✅ User authenticated');
    console.log('   Token:', authResult.token.substring(0, 20) + '...');
    console.log('');

    // Step 3: Create checking account
    console.log('💰 Step 3: Creating checking account...');
    const checkingAccount = await accountService.createAccount({
      userId: user.id,
      accountType: 'checking',
      currency: 'USD',
      initialBalance: 5000
    });
    console.log('✅ Checking account created:', checkingAccount);
    console.log('');

    // Step 4: Create savings account
    console.log('💰 Step 4: Creating savings account...');
    const savingsAccount = await accountService.createAccount({
      userId: user.id,
      accountType: 'savings',
      currency: 'USD',
      initialBalance: 10000
    });
    console.log('✅ Savings account created:', savingsAccount);
    console.log('');

    // Step 5: Transfer money between accounts
    console.log('💸 Step 5: Transferring $1000 from savings to checking...');
    const transaction = await transactionService.createTransaction({
      fromAccountId: savingsAccount.id,
      toAccountId: checkingAccount.id,
      amount: 1000,
      currency: 'USD',
      type: 'transfer',
      description: 'Monthly transfer'
    });
    console.log('✅ Transaction completed:', transaction);
    console.log('');

    // Step 6: Process a payment
    console.log('💳 Step 6: Processing payment...');
    const payment = await paymentService.processPayment({
      userId: user.id,
      accountId: checkingAccount.id,
      amount: 150.50,
      currency: 'USD',
      paymentMethod: 'card',
      recipient: 'Electric Company',
      description: 'Utility bill payment'
    });
    console.log('✅ Payment processed:', payment);
    console.log('');

    // Step 7: Check final account balances
    console.log('📊 Step 7: Checking final account balances...');
    const checkingFinal = await accountService.getAccountById(checkingAccount.id);
    const savingsFinal = await accountService.getAccountById(savingsAccount.id);
    console.log('✅ Checking account balance:', checkingFinal.balance, checkingFinal.currency);
    console.log('✅ Savings account balance:', savingsFinal.balance, savingsFinal.currency);
    console.log('');

    // Step 8: Get transaction history
    console.log('📋 Step 8: Getting transaction history...');
    const transactions = await transactionService.getTransactionsByAccountId(checkingAccount.id);
    console.log('✅ Transaction count:', transactions.length);
    console.log('');

    // Step 9: Framework health check
    console.log('🏥 Step 9: Checking framework health...');
    const health = await framework.healthCheck();
    console.log('✅ Framework health:', health);
    console.log('');

    console.log('🎉 Integration demonstration completed successfully!');
    console.log('');
    console.log('Summary:');
    console.log('--------');
    console.log('✅ Framework (triumphsynergy0576.pinet.com) provided:');
    console.log('   - Logging');
    console.log('   - Security (password hashing)');
    console.log('   - Validation');
    console.log('   - Database management');
    console.log('');
    console.log('✅ Main App (triumphsynergydi8363.pinet.com) provided:');
    console.log('   - User management');
    console.log('   - Account services');
    console.log('   - Transaction processing');
    console.log('   - Payment processing');
    console.log('');
    console.log('🏆 Superior Digital Financial Ecosystem achieved!');

  } catch (error) {
    console.error('❌ Error during integration:', error);
  } finally {
    // Cleanup
    await framework.shutdown();
    console.log('👋 Framework shut down gracefully');
  }
}

// Run demonstration if executed directly
if (require.main === module) {
  demonstrateIntegration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
