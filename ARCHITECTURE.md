# Architecture Documentation

## System Architecture

The Triumph Synergy Financial ecosystem combines three key components into a unified digital financial platform with full Pi Network cryptocurrency integration:

### Component Integration

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Digital Financial Ecosystem                        │
│          (Triumph Synergy Financial + Pi Network Integration)         │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                 │
┌───────────▼─────────┐  ┌──▼──────────────┐ ┌▼───────────────────────┐
│   Main App          │  │   Framework     │ │   Pi Network           │
│ triumphsynergydi8363│◄─┤ triumphsynergy  │◄┤   Platform             │
│    .pinet.com       │  │  0576.pinet.com │ │  (api.minepi.com)      │
└─────────────────────┘  └─────────────────┘ └────────────────────────┘
│                         │                    │
│  • User Management      │  • Core Module    │  • Authentication      │
│  • Account Services     │  • Logger         │  • Payment Processing  │
│  • Transactions         │  • Database Mgr   │  • Blockchain Txs      │
│  • Payment Processing   │  • Security       │  • User Management     │
│  • Pi Integration       │  • Validation     │  • Pi Browser          │
│                         │  • Pi SDK Service │                        │
└─────────────────────────┴───────────────────┴────────────────────────┘
```

### Framework Layer (triumphsynergy0576.pinet.com)

The framework provides reusable, modular components:

1. **Core Module**
   - Framework initialization
   - Component orchestration
   - Health monitoring
   - Graceful shutdown
   - Pi SDK integration

2. **Logger**
   - Centralized logging with Winston
   - Multiple log levels (info, error, warn, debug)
   - Structured logging with JSON format
   - Console and file transports

3. **Database Manager**
   - Connection pooling
   - Query execution
   - Transaction support
   - Connection health checks

4. **Security Module**
   - JWT token generation and verification
   - Password hashing with bcrypt
   - Input sanitization (XSS prevention)
   - Email validation
   - Rate limiting on authentication endpoints

5. **Validation Module**
   - Generic validation rules
   - Financial-specific validators
   - Transaction amount validation
   - Account number validation

6. **Pi SDK Service** 🥧
   - Pi Network authentication verification
   - Payment approval (server-side)
   - Payment completion (server-side)
   - Transaction verification on Pi blockchain
   - Incomplete payment recovery
   - App-to-User payment creation

### Application Layer (triumphsynergydi8363.pinet.com)

The main application leverages the framework:

1. **User Service**
   - User registration with validation
   - Authentication with JWT
   - User profile management
   - Password security
   - **Pi Network user authentication**
   - **Pi user creation and management**

2. **Account Service**
   - Account creation (checking, savings, investment)
   - Balance management
   - Multi-currency support (including Pi)
   - Account status tracking

3. **Transaction Service**
   - Fund transfers between accounts
   - Transaction validation
   - Balance updates
   - Transaction history

4. **Payment Service**
   - Payment processing
   - Multiple payment methods (card, bank, wallet, **Pi**)
   - Payment status tracking
   - Payment history
   - **Pi cryptocurrency payments**

### Pi Network Integration Layer

The Pi Network integration provides:

1. **Frontend Integration**
   - Pi Browser compatible HTML interface
   - Pi SDK initialization (version 2.0)
   - User authentication flow
   - Payment creation UI
   - Real-time payment status updates

2. **Backend Integration**
   - RESTful API endpoints for Pi operations
   - Server-side approval flow
   - Server-side completion flow
   - Payment verification
   - Incomplete payment handling

3. **Security Flow**
   ```
   Pi Browser → Frontend (Pi SDK) → Backend API → Pi Platform API → Pi Blockchain
   ```

### Data Flow

```
Client Request (Pi Browser or Web)
      │
      ▼
┌─────────────┐
│  Express    │
│  Middleware │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Routes    │
└──────┬──────┘
       │
       ▼
┌─────────────┐       ┌──────────────┐
│  Services   │◄─────►│  Framework   │
│  (Main App) │       │  Components  │
└──────┬──────┘       └──────────────┘
       │
       ▼
┌─────────────┐
│  Response   │
└─────────────┘
```

### Security Architecture

```
┌──────────────────────────────────────────────┐
│         Security Layers                      │
├──────────────────────────────────────────────┤
│  1. HTTPS/TLS (Transport Security)          │
│  2. Helmet (HTTP Headers Security)          │
│  3. CORS (Cross-Origin Resource Sharing)    │
│  4. JWT Authentication                       │
│  5. Password Hashing (bcrypt)               │
│  6. Input Validation & Sanitization         │
│  7. Transaction Validation                   │
└──────────────────────────────────────────────┘
```

## Key Design Principles

### 1. Modularity
The framework is designed as independent, reusable modules that can be composed together.

### 2. Separation of Concerns
- Framework: Infrastructure and utilities
- Application: Business logic and domain models
- Clear boundaries between layers

### 3. Security First
- All inputs are validated
- Passwords are never stored in plain text
- JWT tokens for stateless authentication
- XSS prevention through input sanitization

### 4. Scalability
- Stateless design for horizontal scaling
- Database connection pooling
- Async/await for non-blocking operations

### 5. Maintainability
- TypeScript for type safety
- Clear module boundaries
- Comprehensive logging
- Consistent error handling

## Integration Points

### Framework → Application Integration

The application imports and uses framework components:

```typescript
import { Framework } from './framework';

const framework = new Framework({
  frameworkUrl: 'https://triumphsynergy0576.pinet.com',
  apiKey: config.framework.apiKey,
  environment: config.nodeEnv
});

// Services use framework components
const logger = framework.getLogger();
const security = framework.getSecurity();
const validation = framework.getValidation();
```

### Configuration Integration

Both components are configured through a unified configuration system:

```typescript
export const config: AppConfig = {
  mainApp: {
    url: 'https://triumphsynergydi8363.pinet.com',
    apiKey: process.env.MAIN_APP_API_KEY
  },
  framework: {
    url: 'https://triumphsynergy0576.pinet.com',
    apiKey: process.env.FRAMEWORK_API_KEY
  }
};
```

## Deployment Architecture

### Development Environment
- Local Node.js server
- In-memory data storage
- Console logging
- Development-friendly error messages

### Production Environment
- Node.js cluster for multi-core usage
- PostgreSQL database
- File and remote logging
- Secure error handling
- Load balancer integration
- Health check endpoints

## API Architecture

### RESTful Design
- Resource-based URLs
- HTTP methods for operations
- JSON request/response format
- Consistent error responses

### Endpoint Structure
```
/api/{resource}/{id?}/{subresource?}

Examples:
- POST   /api/users/register
- GET    /api/accounts/:accountId
- POST   /api/transactions
- GET    /api/users/:userId/accounts
```

## Error Handling

### Layered Error Handling
1. **Validation Layer**: Input validation errors
2. **Service Layer**: Business logic errors
3. **Framework Layer**: Infrastructure errors
4. **Express Middleware**: Unhandled errors

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional details (dev mode only)"
}
```

## Monitoring & Observability

### Logging
- All operations are logged
- Structured JSON logging
- Multiple log levels
- Request/response logging

### Health Checks
- Framework component health
- Database connectivity
- Service availability

### Metrics (Future)
- Request latency
- Error rates
- Transaction volumes
- System resources
