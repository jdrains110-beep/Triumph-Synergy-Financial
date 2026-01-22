# Triumph Synergy Financial - Digital Ecosystem

A superior digital financial ecosystem that combines a robust main application foundation with a modular framework to deliver comprehensive financial services.

## Overview

This platform integrates two powerful components:

1. **Main App Foundation** (`triumphsynergydi8363.pinet.com`) - The core application providing financial services
2. **Modular Framework** (`triumphsynergy0576.pinet.com`) - Reusable components and infrastructure

Together, they create a comprehensive digital financial ecosystem with:
- User account management
- Financial account handling (checking, savings, investment)
- Transaction processing
- Payment systems
- Security and authentication
- Comprehensive logging and monitoring

## Architecture

### Framework Components (triumphsynergy0576.pinet.com)

The framework provides modular, reusable components:

- **Core Module**: Framework initialization and orchestration
- **Logger**: Centralized logging using Winston
- **Database Manager**: Database connection and transaction handling
- **Security Module**: JWT authentication, password hashing, input sanitization
- **Validation Module**: Input validation and business rule enforcement

### Main Application (triumphsynergydi8363.pinet.com)

The main application leverages the framework to provide:

- **User Service**: Registration, authentication, profile management
- **Account Service**: Account creation, balance management, account types
- **Transaction Service**: Money transfers, deposits, withdrawals
- **Payment Service**: Payment processing with multiple methods

## Features

### User Management
- User registration with email validation
- Secure authentication with JWT tokens
- Password hashing with bcrypt
- User profile management

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
- Multiple payment methods (card, bank transfer, digital wallet)
- Payment status tracking
- Real-time payment processing
- Payment history

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Input sanitization to prevent XSS
- Secure API endpoints
- CORS and Helmet protection

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (optional, for production)

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

## API Endpoints

### Health & Info
- `GET /` - API information
- `GET /health` - Health check

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
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `MAIN_APP_URL` | Main app URL | `https://triumphsynergydi8363.pinet.com` |
| `FRAMEWORK_URL` | Framework URL | `https://triumphsynergy0576.pinet.com` |
| `JWT_SECRET` | JWT secret key | (required) |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `LOG_LEVEL` | Logging level | `info` |

## Project Structure

```
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
- **Security**: JWT, bcrypt, Helmet, CORS
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