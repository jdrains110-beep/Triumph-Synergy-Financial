# Pi Domain Validation - Official Setup Guide

## ✅ FINAL: Environment Variable Configuration

**Important**: Validation keys are now properly stored in environment variables for security and proper configuration management.

## Domain Configuration

### Testnet (Development)
**Domain**: `testnet.triumphsynergydi8363.pinet.com`  
**Validation Key**: Loaded from `PI_TESTNET_VALIDATION_KEY` environment variable

### Mainnet (Production)
**Domain**: `triumphsynergydi8363.pinet.com`  
**Validation Key**: Loaded from `PI_MAINNET_VALIDATION_KEY` environment variable

## Environment Variables Required

Add these to your `.env` file:

```env
# Pi Domain Validation Keys - REQUIRED
# These keys are provided by Pi App Studio for domain validation
PI_TESTNET_VALIDATION_KEY=ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70
PI_MAINNET_VALIDATION_KEY=4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c
```

## DNS Setup Required

Both domains must point to your server IP:

```
A Record: triumphsynergydi8363.pinet.com → [YOUR_SERVER_IP]
A Record: testnet.triumphsynergydi8363.pinet.com → [YOUR_SERVER_IP]
```

## Server Implementation

The Express server now reads validation keys from environment variables:

```typescript
app.get('/.well-known/pi-domain-validation.txt', (req, res) => {
  const host = req.get('host') || '';
  
  if (host.startsWith('testnet.')) {
    const testnetKey = process.env.PI_TESTNET_VALIDATION_KEY;
    if (!testnetKey) {
      return res.status(500).send('Server configuration error');
    }
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'no-cache');
    res.send(testnetKey);
  } else {
    const mainnetKey = process.env.PI_MAINNET_VALIDATION_KEY;
    if (!mainnetKey) {
      return res.status(500).send('Server configuration error');
    }
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'no-cache');
    res.send(mainnetKey);
  }
});
```

## Available Endpoints

The server provides multiple validation endpoints for compatibility:

- `/.well-known/pi-domain-validation.txt` (Primary)
- `/pi-domain-validation.txt` (Alternative)
- `/testnet/.well-known/pi-domain-validation.txt` (Force testnet)
- `/mainnet/.well-known/pi-domain-validation.txt` (Force mainnet)
- `/validation-key.txt` (Legacy)

## Pi App Studio Setup

### Testnet Configuration
1. Open Pi Browser → `https://develop.pi`
2. Select your app → **Testnet Configuration**
3. **Domain**: `testnet.triumphsynergydi8363.pinet.com`
4. Click **Verify Domain**

### Mainnet Configuration
1. Select your app → **Mainnet Configuration**
2. **Domain**: `triumphsynergydi8363.pinet.com`
3. Click **Verify Domain**

## Testing

Run the test script to verify endpoints:

```powershell
.\test-pi-validation.ps1
```

Expected results:
- Testnet: Returns key starting with `ba5b2c8e...`
- Mainnet: Returns key starting with `4b4607...`

## Debug Endpoint

Check `/debug/pi-validation` for real-time validation status.

## Pi App Studio Configuration

### For Testnet

1. Open Pi Browser → `https://develop.pi`
2. Go to your app → **Testnet Configuration**
3. **Domain**: `testnet.triumphsynergydi8363.pinet.com`
4. Click **Verify Domain**
5. Pi will check: `https://testnet.triumphsynergydi8363.pinet.com/.well-known/pi-domain-validation.txt`
6. Server returns: `ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70`

### For Mainnet

1. In Pi App Studio → **Mainnet Configuration**
2. **Domain**: `triumphsynergydi8363.pinet.com`
3. Click **Verify Domain**
4. Pi will check: `https://triumphsynergydi8363.pinet.com/.well-known/pi-domain-validation.txt`
5. Server returns: `4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c`

## Setup Steps

### Step 1: Configure DNS

Add subdomain to your DNS provider:

**Type**: A Record  
**Name**: `testnet`  
**Value**: Your server IP address  
**TTL**: 3600 (or auto)

Wait for DNS propagation (can take 5-60 minutes).

### Step 2: Verify DNS

```powershell
# Test testnet subdomain resolves
nslookup testnet.triumphsynergydi8363.pinet.com

# Test mainnet domain resolves
nslookup triumphsynergydi8363.pinet.com
```

### Step 3: Deploy Updated Server

```bash
cd "c:\Users\13865\Downloads\Triumph-Synergy-Financial-main\Triumph-Synergy-Financial-main"
npm run build
npm start
```

### Step 4: Test Validation URLs

```powershell
# Test testnet validation
Invoke-WebRequest -Uri "https://testnet.triumphsynergydi8363.pinet.com/.well-known/pi-domain-validation.txt"
# Should return: ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70

# Test mainnet validation
Invoke-WebRequest -Uri "https://triumphsynergydi8363.pinet.com/.well-known/pi-domain-validation.txt"
# Should return: 4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c
```

### Step 5: Validate in Pi App Studio

Once both URLs return the correct keys, proceed with Pi App Studio validation.

## Alternative: If You Can't Set Up Subdomains

If DNS/subdomain configuration isn't available, you have these options:

### Option A: Use Framework Domain for Testnet

- **Testnet**: `triumphsynergy0576.pinet.com` (your framework domain)
- **Mainnet**: `triumphsynergydi8363.pinet.com` (your main app domain)

Deploy the same app to both domains with appropriate validation keys.

### Option B: Get a Second Domain

Register another domain specifically for testnet, like:
- `triumphsynergy-testnet.pinet.com`

### Option C: Use Different Paths (May Not Work)

Some developers report success with:
- **Testnet App URL**: `https://triumphsynergydi8363.pinet.com/testnet`
- **Mainnet App URL**: `https://triumphsynergydi8363.pinet.com`

But this requires Pi App Studio to check validation at the app URL path, which isn't guaranteed.

## Why This Matters

Pi Network validates domains to ensure:
1. You control the domain you're registering
2. Testnet and production environments are properly separated
3. Security: prevents domain hijacking

Each environment needs its own validation because:
- **Different security contexts**: Testnet uses test Pi, mainnet uses real Pi
- **Different API keys**: Your testnet and mainnet apps have different credentials
- **Separate verification**: Pi validates each environment independently

## Troubleshooting

### "Both environments showing same key"

**Cause**: Server isn't detecting subdomain correctly

**Solution**:
1. Check DNS is configured for `testnet.` subdomain
2. Test with curl and check Host header:
   ```bash
   curl -H "Host: testnet.triumphsynergydi8363.pinet.com" https://your-server/.well-known/pi-domain-validation.txt
   ```

### "Subdomain not accessible"

**Cause**: DNS not configured or not propagated

**Solution**:
1. Verify DNS record exists in your DNS provider
2. Wait for DNS propagation (up to 24-48 hours, usually much faster)
3. Use `nslookup` to verify subdomain resolves

### "HTTPS certificate error on subdomain"

**Cause**: SSL certificate doesn't cover subdomain

**Solution**:
1. Use wildcard certificate: `*.triumphsynergydi8363.pinet.com`
2. Or add subdomain to your certificate
3. Use Let's Encrypt with certbot to generate certificate covering both domains

## Your Validation Keys

**Testnet** (for `testnet.triumphsynergydi8363.pinet.com`):
```
ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70
```

**Mainnet** (for `triumphsynergydi8363.pinet.com`):
```
4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c
```

## Next Steps

1. **Set up DNS**: Add testnet subdomain
2. **Wait for propagation**: 5-60 minutes typically
3. **Deploy server**: Build and start with updated code
4. **Test URLs**: Verify both return correct keys
5. **Validate in Pi App Studio**: Should now work correctly

The subdomain-based approach is the standard and most reliable method for Pi Network domain validation! 🎉
