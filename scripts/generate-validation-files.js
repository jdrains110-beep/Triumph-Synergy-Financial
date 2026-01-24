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

// Get validation keys from environment variables (tolerant)
const testnetKey = process.env.PI_TESTNET_VALIDATION_KEY;
const mainnetKey = process.env.PI_MAINNET_VALIDATION_KEY;

if (!testnetKey || !mainnetKey) {
  console.warn('WARNING: One or both PI_TESTNET_VALIDATION_KEY / PI_MAINNET_VALIDATION_KEY are not set.');
  console.warn('The script will generate placeholder files so the build does not fail.');
  console.warn('For proper domain validation, set the environment variables in your deployment environment (Vercel) to the real keys.');
}

// Generate mainnet validation files (use placeholder if key missing)
const mainnetValue = mainnetKey ? mainnetKey.trim() : 'MISSING_PI_MAINNET_VALIDATION_KEY';
fs.writeFileSync(path.join(mainnetDir, 'validation-key.txt'), mainnetValue);
fs.writeFileSync(path.join(mainnetWellKnownDir, 'pi-domain-validation.txt'), mainnetValue);
console.log('Generated mainnet/validation-key.txt (mainnet)');
console.log('Generated mainnet/.well-known/pi-domain-validation.txt (mainnet)');

// Generate testnet validation files (use placeholder if key missing)
const testnetValue = testnetKey ? testnetKey.trim() : 'MISSING_PI_TESTNET_VALIDATION_KEY';
fs.writeFileSync(path.join(testnetDir, 'validation-key.txt'), testnetValue);
fs.writeFileSync(path.join(testnetWellKnownDir, 'pi-domain-validation.txt'), testnetValue);
console.log('Generated testnet/validation-key.txt (testnet)');
console.log('Generated testnet/.well-known/pi-domain-validation.txt (testnet)');

// For backward compatibility, also generate in root public directory (using mainnet as default)
// For backward compatibility, also generate in root public directory (using mainnet as default or placeholder)
fs.writeFileSync(path.join(publicDir, 'validation-key.txt'), mainnetValue);
fs.writeFileSync(path.join(wellKnownDir, 'pi-domain-validation.txt'), mainnetValue);
console.log('Generated public/validation-key.txt (default/mainnet or placeholder)');
console.log('Generated public/.well-known/pi-domain-validation.txt (default/mainnet or placeholder)');

console.log('Validation files generation complete for both mainnet and testnet');