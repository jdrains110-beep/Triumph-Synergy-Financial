# Triumph Synergy Financial - Digital Ecosystem

A superior digital financial ecosystem that combines a robust main application foundation with a modular framework to deliver comprehensive financial services, **now fully integrated with Pi Network for cryptocurrency payments**.

## Overview

This platform integrates three powerful components:

1. **Main App Foundation** (`triumphsynergy.com`) - The core application providing financial services
2. **Modular Framework** (`testnet.triumphsynergy.com`) - Reusable components and infrastructure
3. **Pi Network Integration** - Full Pi cryptocurrency support for payments and authentication

Together, they create a comprehensive digital financial ecosystem with:

- User account management
- Financial account handling (checking, savings, investment)
- Transaction processing
- **Pi Network cryptocurrency payments**
- **Pi Browser authentication**
- Payment systems (traditional + Pi)
- Security and authentication
- Comprehensive logging and monitoring

## Architecture

### Framework Components (triumphsynergy0576.pinet.com)

The framework provides modular, reusable components:

- **Core Module**: Framework initialization and orchestration
- **Logger**: Centralized logging using Winston
- **Database Manager**: Database connection and transaction handling
-- **Security Module**: password hashing, input sanitization
- **Validation Module**: Input validation and business rule enforcement
- **Pi SDK Service**: Pi Network authentication and payment processing

### Main Application (triumphsynergydi8363.pinet.com)

The main application leverages the framework to provide:

- **User Service**: Registration, authentication, profile management, **Pi user authentication**
- **Account Service**: Account creation, balance management, account types
- **Transaction Service**: Money transfers, deposits, withdrawals
- **Payment Service**: Payment processing with multiple methods including **Pi cryptocurrency**

### Pi Network Integration

Full integration with Pi Network Platform:

- **Frontend**: Pi Browser-compatible HTML interface (`public/index.html`)
- **Backend API**: Pi authentication and payment endpoints
- **SDK Integration**: Official Pi SDK for secure transactions
- **Payment Flow**: Complete User-to-App payment implementation
- **Authentication**: Pi Network user authentication via Pi Browser

## Features

### Pi Network Features 🥧

- **Pi Authentication**: Login with Pi Network account
- **Pi Payments**: Send Pi cryptocurrency to the app
- **Pi Browser Support**: Fully functional in Pi Browser
- **Server-Side Approval**: Secure payment approval flow
- **Server-Side Completion**: Transaction verification on blockchain
- **Incomplete Payment Recovery**: Automatic handling of interrupted payments

### User Management

- User registration with email validation
-- Secure authentication (no JWT)
- Password hashing with bcrypt
- User profile management
- **Pi Network user authentication**

### Account Management

- Multiple account types (checking, savings, investment)
- Multi-currency support
- Real-time balance tracking
- Account status management

### Transaction Processing

- Secure fund transfers between accounts
- Transaction validation and verification
- Transaction history tracking
- Amount limits and validation

### Payment Processing

- Multiple payment methods (card, bank transfer, digital wallet, **Pi cryptocurrency**)
- Payment status tracking
- Real-time payment processing
- Payment history
- **Pi blockchain transaction verification**

### Security

-- Secure authentication (no JWT)
- Password hashing with bcrypt
- Input sanitization to prevent XSS
- Secure API endpoints
- CORS and Helmet protection
- **Rate limiting on authentication endpoints**
- **Pi Network secure payment approval flow**

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (optional, for production)
- **Pi Network Developer Account** (get API key from <https://develop.pi> in Pi Browser)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jdrains110-beep/Triumph-Synergy-Financial.git
   cd Triumph-Synergy-Financial
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   # IMPORTANT: Add your Pi Network API key from https://develop.pi
   ```

   Required Pi Network environment variables:

   ```env
   PI_API_KEY=du1td5k3lptmqgl7327zwsdwqxczmizgrstgexfjshkqqso3qei8jzafqkyh3lv6
   PI_API_URL=https://api.minepi.com
   PI_SANDBOX_MODE=false
   PI_APP_NAME=Triumph Synergy Financial
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Start the server:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000` by default.

### Pi Network Domain Validation

This application supports Pi Network domain validation for both mainnet and testnet environments:

1. **Domains Configuration**:
   - Mainnet: `triumphsynergy.com`
   - Testnet: `testnet.triumphsynergy.com`

2. **Environment Variables** (add to `.env`):
   ```env
   PI_TESTNET_VALIDATION_KEY=your_testnet_validation_key_from_pi_app_studio
   PI_MAINNET_VALIDATION_KEY=your_mainnet_validation_key_from_pi_app_studio
   ```

3. **Validation Files**:
   - Static files are automatically generated during build: `public/validation-key.txt` and `public/.well-known/pi-domain-validation.txt`
   - Dynamic validation endpoint: `/pi-domain-validation` (serves different keys based on Host header)

4. **Testing Validation**:
   ```bash
   # Run the test script
   ./test-validation.bat
   ```

### Pi Browser Setup

1. Open Pi Browser on your mobile device
2. Navigate to your server URL (e.g., `https://triumphsynergy.com` or `https://testnet.triumphsynergy.com`)
3. The Pi-enabled frontend will automatically load
4. Click "Authenticate with Pi Network" to connect
5. Start making Pi payments!

### Registering Your App on Pi Network

1. Open Pi Browser and navigate to `https://develop.pi`
2. Click "Register a new app"
3. Fill in your app details:
   - App Name: Triumph Synergy Financial
   - App URL: Your server URL
   - Redirect URLs: Your callback URLs
4. Copy your API Key
5. Add it to your `.env` file as `PI_API_KEY`

## API Endpoints

### Health & Info

- `GET /` - API information (now includes Pi integration status)
- `GET /health` - Health check

### Pi Network Endpoints 🥧

- `POST /api/pi/auth` - Authenticate Pi Network user
- `POST /api/pi/payments/:paymentId/approve` - Approve Pi payment (server-side)
- `POST /api/pi/payments/:paymentId/complete` - Complete Pi payment (server-side)
- `GET /api/pi/payments/:paymentId` - Get Pi payment details
- `GET /api/pi/payments/incomplete/:userUid` - Get incomplete Pi payments

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/:userId` - Get user profile

### Accounts

- `POST /api/accounts` - Create account
- `GET /api/accounts/:accountId` - Get account details
- `GET /api/users/:userId/accounts` - Get user accounts

### Transactions

- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:transactionId` - Get transaction details
- `GET /api/accounts/:accountId/transactions` - Get account transactions

### Payments

- `POST /api/payments` - Process payment
- `GET /api/payments/:paymentId` - Get payment details
- `GET /api/users/:userId/payments` - Get user payments

## API Usage Examples

### Register a User

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Create an Account

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "accountType": "checking",
    "currency": "USD",
    "initialBalance": 1000
  }'
```

### Process a Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": "account-id-1",
    "toAccountId": "account-id-2",
    "amount": 100,
    "currency": "USD",
    "type": "transfer",
    "description": "Payment for services"
  }'
```

## Configuration

The application is configured through environment variables:

| Variable | Description | Default |
| --- | --- | --- |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `MAIN_APP_URL` | Main app URL | `https://triumphsynergydi8363.pinet.com` |
| `FRAMEWORK_URL` | Framework URL | `https://triumphsynergy0576.pinet.com` |

| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `LOG_LEVEL` | Logging level | `info` |

## Project Structure

```text
.
├── src/
│   ├── framework/          # Framework components (triumphsynergy0576.pinet.com)
│   │   ├── core.ts        # Framework core
│   │   ├── logger.ts      # Logging module
│   │   ├── database.ts    # Database manager
│   │   ├── security.ts    # Security utilities
│   │   └── validation.ts  # Validation module
│   ├── app/               # Main application (triumphsynergydi8363.pinet.com)
│   │   ├── models/        # Data models
│   │   ├── services/      # Business logic
│   │   ├── controllers/   # Request handlers
│   │   └── routes/        # API routes
│   ├── config/            # Configuration
│   │   └── index.ts       # App configuration
│   └── index.ts           # Application entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
-- **Security**: bcrypt, Helmet, CORS
- **Logging**: Winston
- **Database**: PostgreSQL with TypeORM
- **Validation**: Custom validation module

## Development

### Build

```bash
npm run build
```

### Run in Development Mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
