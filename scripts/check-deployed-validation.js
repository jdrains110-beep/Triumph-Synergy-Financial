const axios = require('axios');

// Usage: node scripts/check-deployed-validation.js --main=https://triumphsynergy.com --test=https://testnet.triumphsynergy.com

// Simple arg parsing to avoid external deps
const rawArgs = process.argv.slice(2);
const args = {};
for (let i = 0; i < rawArgs.length; i++) {
  const a = rawArgs[i];
  if (a.startsWith('--')) {
    const key = a.replace(/^--+/, '');
    const val = rawArgs[i + 1] && !rawArgs[i + 1].startsWith('--') ? rawArgs[i + 1] : true;
    args[key] = val;
    if (val !== true) i++;
  }
}

const mainUrl = args.main || process.env.MAIN_URL || 'https://triumphsynergy.com';
const testUrl = args.test || process.env.TEST_URL || 'https://testnet.triumphsynergy.com';

const expectedMain = process.env.PI_MAINNET_VALIDATION_KEY || '';
const expectedTest = process.env.PI_TESTNET_VALIDATION_KEY || '';

async function fetchTxt(url) {
  try {
    const resp = await axios.get(`${url.replace(/\/+$/, '')}/validation-key.txt`, { timeout: 10000 });
    return resp.data.trim();
  } catch (err) {
    return { error: err.message || String(err) };
  }
}

(async () => {
  console.log('Checking deployed validation keys...');

  const mainResp = await fetchTxt(mainUrl);
  const testResp = await fetchTxt(testUrl);

  if (mainResp && mainResp.error) {
    console.error(`MAIN fetch error: ${mainResp.error}`);
  } else {
    console.log(`MAIN key fetched: ${typeof mainResp === 'string' ? mainResp.substring(0, 40) + (mainResp.length>40? '...':'') : mainResp}`);
    if (expectedMain) {
      if (mainResp === expectedMain.trim()) console.log('MAIN key matches expected value');
      else console.error('MAIN key does NOT match expected value');
    } else {
      console.log('No expected mainnet key provided in env; only fetched value shown');
    }
  }

  if (testResp && testResp.error) {
    console.error(`TEST fetch error: ${testResp.error}`);
  } else {
    console.log(`TEST key fetched: ${typeof testResp === 'string' ? testResp.substring(0, 40) + (testResp.length>40? '...':'') : testResp}`);
    if (expectedTest) {
      if (testResp === expectedTest.trim()) console.log('TEST key matches expected value');
      else console.error('TEST key does NOT match expected value');
    } else {
      console.log('No expected testnet key provided in env; only fetched value shown');
    }
  }

  const okMain = typeof mainResp === 'string' && expectedMain && mainResp === expectedMain.trim();
  const okTest = typeof testResp === 'string' && expectedTest && testResp === expectedTest.trim();

  if (okMain && okTest) {
    console.log('\nBoth validation keys match expected values.');
    process.exit(0);
  }

  console.error('\nOne or both validation keys did not match or could not be fetched.');
  process.exit(2);
})();
