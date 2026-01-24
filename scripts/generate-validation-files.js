const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const publicDir = path.join(__dirname, '..', 'public');
const wellKnownDir = path.join(publicDir, '.well-known');

// Create mainnet and testnet directories
const mainnetDir = path.join(publicDir, 'mainnet');
const testnetDir = path.join(publicDir, 'testnet');
const mainnetWellKnownDir = path.join(mainnetDir, '.well-known');
const testnetWellKnownDir = path.join(testnetDir, '.well-known');

// Ensure all directories exist
[publicDir, wellKnownDir, mainnetDir, testnetDir, mainnetWellKnownDir, testnetWellKnownDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Get validation keys from environment variables
const testnetKey = process.env.PI_TESTNET_VALIDATION_KEY;
const mainnetKey = process.env.PI_MAINNET_VALIDATION_KEY;

if (!testnetKey || !mainnetKey) {
  console.error('ERROR: Both PI_TESTNET_VALIDATION_KEY and PI_MAINNET_VALIDATION_KEY environment variables must be set!');
  console.error('Please set them in your .env file');
  process.exit(1);
}

// Generate mainnet validation files
fs.writeFileSync(path.join(mainnetDir, 'validation-key.txt'), mainnetKey.trim());
fs.writeFileSync(path.join(mainnetWellKnownDir, 'pi-domain-validation.txt'), mainnetKey.trim());
console.log('Generated mainnet/public/validation-key.txt with MAINNET key');
console.log('Generated mainnet/public/.well-known/pi-domain-validation.txt with MAINNET key');

// Generate testnet validation files
fs.writeFileSync(path.join(testnetDir, 'validation-key.txt'), testnetKey.trim());
fs.writeFileSync(path.join(testnetWellKnownDir, 'pi-domain-validation.txt'), testnetKey.trim());
console.log('Generated testnet/public/validation-key.txt with TESTNET key');
console.log('Generated testnet/public/.well-known/pi-domain-validation.txt with TESTNET key');

// For backward compatibility, also generate in root public directory (using mainnet as default)
fs.writeFileSync(path.join(publicDir, 'validation-key.txt'), mainnetKey.trim());
fs.writeFileSync(path.join(wellKnownDir, 'pi-domain-validation.txt'), mainnetKey.trim());
console.log('Generated public/validation-key.txt with MAINNET key (default)');
console.log('Generated public/.well-known/pi-domain-validation.txt with MAINNET key (default)');

console.log('Validation files generation complete for both mainnet and testnet');