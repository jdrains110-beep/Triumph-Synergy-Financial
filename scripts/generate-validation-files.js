const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const publicDir = path.join(__dirname, '..', 'public');
const wellKnownDir = path.join(publicDir, '.well-known');

// Ensure directories exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

// Get validation keys from environment variables
const testnetKey = process.env.PI_TESTNET_VALIDATION_KEY;
const mainnetKey = process.env.PI_MAINNET_VALIDATION_KEY;

// For mainnet deployment (triumphsynergy.com), use mainnet key
// For testnet deployment (testnet.triumphsynergy.com), use testnet key
// Default to mainnet key if both are available
const validationKey = mainnetKey || testnetKey;

if (validationKey) {
  fs.writeFileSync(path.join(publicDir, 'validation-key.txt'), validationKey.trim());
  console.log('Generated public/validation-key.txt with ' + (mainnetKey ? 'MAINNET' : 'TESTNET') + ' key');
} else {
  console.error('ERROR: No validation key found in environment variables!');
  console.error('Please set PI_MAINNET_VALIDATION_KEY or PI_TESTNET_VALIDATION_KEY in your .env file');
  process.exit(1);
}

// Also generate .well-known/pi-domain-validation.txt with the same key
fs.writeFileSync(path.join(wellKnownDir, 'pi-domain-validation.txt'), validationKey.trim());
console.log('Generated public/.well-known/pi-domain-validation.txt with ' + (mainnetKey ? 'MAINNET' : 'TESTNET') + ' key');

console.log('Validation files generation complete');