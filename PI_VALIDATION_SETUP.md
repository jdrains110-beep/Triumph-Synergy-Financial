# Pi Network Domain Validation Setup

## Current Configuration

### Domains
- **Mainnet**: `triumphsynergy.com` 
- **Testnet**: `testnet.triumphsynergy.com`

### Validation Keys (from Pi App Studio)

**Mainnet Key**: 
```
4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c
```

**Testnet Key**:
```
ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70
```

## How It Works

### For Mainnet Domain (`triumphsynergy.com`)

The server uses **Host header detection** to serve the correct validation key:

1. **Static Files** (fallback):
   - `/public/validation-key.txt` - Contains mainnet key
   - `/public/.well-known/pi-domain-validation.txt` - Contains mainnet key

2. **Dynamic Endpoint** (primary):
   - `/pi-domain-validation` - Detects domain from Host header
   - When `Host: triumphsynergy.com` → Returns `PI_MAINNET_VALIDATION_KEY`
   - When `Host: testnet.triumphsynergy.com` → Returns `PI_TESTNET_VALIDATION_KEY`

### Vercel Configuration

`vercel.json` routes both validation file requests to the dynamic endpoint:
- `https://triumphsynergy.com/validation-key.txt` → `/pi-domain-validation`
- `https://testnet.triumphsynergy.com/validation-key.txt` → `/pi-domain-validation`

This ensures each domain serves its correct validation key.

## Deployment Steps

### 1. Vercel Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
PI_API_KEY=du1td5k3lptmqgl7327zwsdwqxczmizgrstgexfjshkqqso3qei8jzafqkyh3lv6
PI_API_URL=https://api.minepi.com
PI_TESTNET_VALIDATION_KEY=ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70
PI_MAINNET_VALIDATION_KEY=4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c
```

### 2. Domain Configuration

In Vercel Dashboard → Settings → Domains:
- Add `triumphsynergy.com` (mainnet)
- Add `testnet.triumphsynergy.com` (testnet subdomain)

### 3. DNS Configuration

Point both domains to Vercel:
```
triumphsynergy.com          A     76.76.21.21
testnet.triumphsynergy.com  CNAME cname.vercel-dns.com
```

### 4. Deploy

```bash
git add .
git commit -m "Configure Pi Network domain validation"
git push origin main
```

Vercel will automatically deploy to both domains.

### 5. Verify in Pi App Studio

1. **For Mainnet** (`triumphsynergy.com`):
   - Go to Pi App Studio → Your App → Mainnet Domain
   - Click "Verify Domain"
   - Pi will check `https://triumphsynergy.com/validation-key.txt`
   - Should return the mainnet key

2. **For Testnet** (`testnet.triumphsynergy.com`):
   - Go to Pi App Studio → Your App → Testnet Domain  
   - Click "Verify Domain"
   - Pi will check `https://testnet.triumphsynergy.com/validation-key.txt`
   - Should return the testnet key

## Testing Locally

```bash
# Start the server
npm run dev

# Test mainnet validation
curl -H "Host: triumphsynergy.com" http://localhost:3000/validation-key.txt

# Test testnet validation
curl -H "Host: testnet.triumphsynergy.com" http://localhost:3000/validation-key.txt
```

## Troubleshooting

### Issue: "Failed to validate the Validation Key"

**Causes**:
1. Validation key doesn't match Pi App Studio
2. File not accessible (404 error)
3. Wrong Content-Type header
4. CORS or redirect issues

**Solutions**:
1. Verify keys match exactly (no extra spaces/newlines)
2. Check file is served at exact URL: `/validation-key.txt`
3. Ensure plain text response: `Content-Type: text/plain`
4. Test with curl: `curl -v https://triumphsynergy.com/validation-key.txt`

### Issue: Both domains return same key

**Cause**: Host header not detected correctly

**Solution**: Check Vercel logs to see what Host header is being received. Vercel should automatically set the correct Host header based on the domain used to access the site.

## Files Modified

1. `.env` - Added validation keys
2. `scripts/generate-validation-files.js` - Updated to prioritize mainnet key
3. `src/index.ts` - Dynamic endpoint with Host header detection (already configured)
4. `vercel.json` - Route validation requests to dynamic endpoint
5. `public/validation-key.txt` - Static mainnet key (fallback)
6. `public/.well-known/pi-domain-validation.txt` - Static mainnet key (fallback)
