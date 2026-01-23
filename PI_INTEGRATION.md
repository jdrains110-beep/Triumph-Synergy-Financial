# Pi Network Integration Guide

## Overview

Triumph Synergy Financial is now fully integrated with the Pi Network platform, enabling seamless Pi cryptocurrency payments and authentication through the Pi Browser.

## Integration Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Pi Browser (Client)                     │
│  - Pi SDK v2.0 JavaScript                                   │
│  - User authentication UI                                    │
│  - Payment creation interface                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Triumph Synergy Financial Backend               │
│  - Express REST API                                          │
│  - Pi authentication endpoints                               │
│  - Payment approval/completion endpoints                     │
│  - Pi SDK Service (src/framework/pi-sdk.ts)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Pi Network Platform                       │
│  - API: https://api.minepi.com                              │
│  - Authentication verification                               │
│  - Payment processing                                        │
│  - Pi Blockchain                                             │
└─────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Register Your App on Pi Network

1. Open **Pi Browser** on your mobile device
2. Navigate to: `https://develop.pi`
3. Click **"Register a new app"**
4. Fill in application details:
   - **App Name**: Triumph Synergy Financial
   - **App URL**: Your production server URL (e.g., https://yourapp.com)
   - **Redirect URLs**: Your callback URLs
   - **Description**: Digital Financial Ecosystem on Pi Network
5. **Save** and copy your **API Key**

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Pi Network Configuration
PI_API_KEY=du1td5k3lptmqgl7327zwsdwqxczmizgrstgexfjshkqqso3qei8jzafqkyh3lv6
PI_API_URL=https://api.minepi.com
PI_SANDBOX_MODE=false
PI_APP_NAME=Triumph Synergy Financial
```

**Important:** Never commit your API key to version control!

### 3. Install Dependencies

```bash
npm install
```

The following Pi-related dependencies are included:
- `axios`: For Pi Platform API calls
- `express-rate-limit`: Rate limiting for security

### 4. Build and Deploy

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Pi Network Features

### 1. Authentication Flow

#### Frontend (Pi Browser)
```javascript
// Initialize Pi SDK
Pi.init({ version: "2.0" });

// Authenticate user
const auth = await Pi.authenticate(['payments', 'username'], onIncompletePaymentFound);
// Returns: { accessToken, user: { uid, username } }
```

#### Backend API
```
POST /api/pi/auth
Body: { accessToken: "user_access_token" }
Response: { user, token, piUser }
```

**How it works:**
1. User clicks "Authenticate with Pi Network"
2. Pi Browser shows authentication dialog
3. User approves sharing data
4. Frontend receives accessToken
5. Frontend sends token to backend
6. Backend verifies with Pi Platform API
7. Backend creates/updates user in database
8. Backend returns JWT token for app authentication

### 2. Payment Flow (User-to-App)

#### Complete Payment Flow

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌─────────┐
│ User    │────▶│ Frontend │────▶│ Backend │────▶│ Pi API  │
│         │     │ (Pi SDK) │     │         │     │         │
└─────────┘     └──────────┘     └─────────┘     └─────────┘
    │               │                 │                │
    │ 1. Click Pay  │                 │                │
    │──────────────▶│                 │                │
    │               │ 2. createPayment│                │
    │               │────────────────▶│                │
    │               │                 │ 3. approve     │
    │               │                 │───────────────▶│
    │ 4. Sign Tx    │                 │                │
    │◀──────────────│                 │                │
    │               │ 5. onReadyForServerCompletion   │
    │               │────────────────▶│                │
    │               │                 │ 6. complete    │
    │               │                 │───────────────▶│
    │               │                 │                │
    │               │ 7. Success      │                │
    │◀──────────────┴─────────────────┘                │
```

#### Frontend Implementation
```javascript
Pi.createPayment({
  amount: 3.14,
  memo: "Payment for service",
  metadata: { orderId: "12345" }
}, {
  onReadyForServerApproval: async (paymentId) => {
    await fetch('/api/pi/payments/' + paymentId + '/approve', {
      method: 'POST'
    });
  },
  onReadyForServerCompletion: async (paymentId, txid) => {
    await fetch('/api/pi/payments/' + paymentId + '/complete', {
      method: 'POST',
      body: JSON.stringify({ txid })
    });
  },
  onCancel: (paymentId) => {
    console.log('Payment cancelled');
  },
  onError: (error) => {
    console.error('Payment error:', error);
  }
});
```

#### Backend Endpoints

**Approve Payment**
```
POST /api/pi/payments/:paymentId/approve
```
- Validates payment details
- Approves payment on Pi Network
- Returns: Payment object with approval status

**Complete Payment**
```
POST /api/pi/payments/:paymentId/complete
Body: { txid: "blockchain_transaction_id" }
```
- Verifies transaction on blockchain
- Marks payment as complete
- Returns: Completed payment object

**Get Payment Status**
```
GET /api/pi/payments/:paymentId
```
- Returns: Full payment object with status

**Get Incomplete Payments**
```
GET /api/pi/payments/incomplete/:userUid
```
- Returns: Array of incomplete payments for user

### 3. App-to-User Payments

Send Pi from your app to users:

```typescript
const piSdk = framework.getPiSdk();

const payment = await piSdk.createAppToUserPayment(
  userUid,      // Pi user UID
  10.0,         // Amount in Pi
  "Reward",     // Memo
  { reason: "completion_bonus" }  // Metadata
);
```

## API Reference

### Pi SDK Service Methods

Located in: `src/framework/pi-sdk.ts`

#### `verifyAuthentication(accessToken: string)`
Verifies Pi Network access token and returns user information.

**Returns:**
```typescript
{
  accessToken: string;
  user: {
    uid: string;
    username: string;
  }
}
```

#### `approvePayment(paymentId: string)`
Approves a payment request (server-side approval).

**Returns:** `PiPayment` object

#### `completePayment(paymentId: string, txid: string)`
Completes a payment after blockchain submission.

**Returns:** `PiPayment` object

#### `getPayment(paymentId: string)`
Retrieves payment details.

**Returns:** `PiPayment` object

#### `getIncompletePayments(userUid: string)`
Gets all incomplete payments for a user.

**Returns:** `PiPayment[]` array

#### `cancelPayment(paymentId: string)`
Cancels a pending payment.

**Returns:** `PiPayment` object

#### `createAppToUserPayment(userUid, amount, memo, metadata)`
Creates an App-to-User payment.

**Returns:** `PiPayment` object

## Frontend Files

### Main Pi Browser Interface

File: `public/index.html`

Features:
- Modern, responsive design
- Pi Network authentication
- Payment creation form
- Real-time status updates
- Incomplete payment handling
- Mobile-optimized for Pi Browser

## Security Considerations

### Rate Limiting
Authentication endpoints are protected with rate limiting:
- 5 attempts per 15 minutes per IP
- Prevents brute force attacks

### Content Security Policy
Helmet middleware configured to allow:
- Pi SDK scripts from `https://sdk.minepi.com`
- API calls to `https://api.minepi.com`

### API Key Security
- Never expose Pi API key in frontend code
- Store in environment variables
- Required in production environment
- Validated on startup

### Payment Verification
- Two-step approval process (frontend + backend)
- Server-side verification of all payments
- Blockchain transaction validation
- Prevents payment manipulation

## Testing

### Sandbox Mode
Enable Pi sandbox mode for testing:
```env
PI_SANDBOX_MODE=true
```

In sandbox mode:
- Use test Pi (not real Pi)
- Test all payment flows
- No real blockchain transactions

### Testing Checklist
- [ ] User authentication works
- [ ] Payment creation succeeds
- [ ] Server approval processes
- [ ] Server completion works
- [ ] Payment cancellation handles correctly
- [ ] Incomplete payments recover
- [ ] Error handling works properly

## Troubleshooting

### Common Issues

**Issue: "Pi SDK not initialized"**
- Solution: Ensure Pi SDK script loads before app code
- Check: `<script src="https://sdk.minepi.com/pi-sdk.js"></script>`

**Issue: "Authentication failed"**
- Solution: Verify PI_API_KEY is correct
- Check: Environment variable is set
- Test: API key from develop.pi portal

**Issue: "Payment approval failed"**
- Solution: Check backend logs for errors
- Verify: Server can reach Pi Platform API
- Check: Payment amount is valid (> 0)

**Issue: "CORS error"**
- Solution: Update CORS_ORIGIN in .env
- Set to your frontend URL or '*' for development

## Best Practices

### 1. Error Handling
Always implement all payment callbacks:
```javascript
{
  onReadyForServerApproval,
  onReadyForServerCompletion,
  onCancel,
  onError
}
```

### 2. User Feedback
Provide clear status updates:
- "Authenticating..."
- "Creating payment..."
- "Approving payment..."
- "Payment completed!"

### 3. Incomplete Payments
Handle incomplete payments on app startup:
```javascript
function onIncompletePaymentFound(payment) {
  // Resume payment flow
  handlePaymentFlow(payment.identifier);
}
```

### 4. Logging
Use framework logger for all Pi operations:
```typescript
framework.getLogger().info('Pi payment processed', { paymentId });
```

## Support

For Pi Network specific issues:
- Developer Forum: https://developers.minepi.com
- Documentation: https://github.com/pi-apps/pi-platform-docs

For Triumph Synergy Financial issues:
- Check application logs
- Review API endpoint responses
- Enable debug logging: `LOG_LEVEL=debug`

## Resources

- **Pi Network Developer Portal**: https://develop.pi (Pi Browser)
- **Pi SDK Documentation**: https://github.com/pi-apps/pi-platform-docs
- **Pi Platform API**: https://api.minepi.com
- **Demo App**: https://github.com/pi-apps/demo

## Version History

- **v1.0.0** - Full Pi Network integration
  - Authentication support
  - User-to-App payments
  - Server-side approval/completion
  - Frontend Pi Browser interface
  - Complete API implementation
