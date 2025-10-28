/**
 * Pesapal Integration Test Script
 * Run this to test your Pesapal integration
 * 
 * Usage: node scripts/test-pesapal.js
 */

const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || 'https://cybqa.pesapal.com/pesapalv3';

console.log('🧪 Testing Pesapal Integration...\n');

// Test 1: Check Environment Variables
console.log('✅ Test 1: Environment Variables');
console.log(`   PESAPAL_CONSUMER_KEY: ${PESAPAL_CONSUMER_KEY ? '✓ Set' : '✗ Missing'}`);
console.log(`   PESAPAL_CONSUMER_SECRET: ${PESAPAL_CONSUMER_SECRET ? '✓ Set' : '✗ Missing'}`);
console.log(`   PESAPAL_BASE_URL: ${PESAPAL_BASE_URL}`);

if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
  console.error('\n❌ Missing Pesapal credentials in .env.local');
  process.exit(1);
}

// Test 2: Test Authentication
console.log('\n✅ Test 2: Authentication');
console.log('   Requesting token from Pesapal...');

const authData = JSON.stringify({
  consumer_key: PESAPAL_CONSUMER_KEY,
  consumer_secret: PESAPAL_CONSUMER_SECRET
});

const authUrl = new URL(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`);

const authOptions = {
  hostname: authUrl.hostname,
  path: authUrl.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': authData.length,
    'Accept': 'application/json'
  }
};

const authRequest = https.request(authOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const result = JSON.parse(data);
        console.log(`   ✓ Authentication successful!`);
        console.log(`   Token: ${result.token.substring(0, 20)}...`);
        console.log(`   Expires: ${result.expiryDate}`);
        
        console.log('\n🎉 All tests passed!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Register IPN URL in Pesapal dashboard');
        console.log('   2. Test payment flow in your browser');
        console.log('   3. Monitor logs for payment confirmations');
      } catch (error) {
        console.error(`   ✗ Failed to parse response: ${error.message}`);
        console.error(`   Response: ${data}`);
      }
    } else {
      console.error(`   ✗ Authentication failed!`);
      console.error(`   Status: ${res.statusCode} ${res.statusMessage}`);
      console.error(`   Response: ${data}`);
    }
  });
});

authRequest.on('error', (error) => {
  console.error(`   ✗ Request failed: ${error.message}`);
});

authRequest.write(authData);
authRequest.end();
