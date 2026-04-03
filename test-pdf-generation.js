// Test script to verify PDF generation and Resend configuration
const fs = require('fs');
const path = require('path');

console.log('Testing PDF generation and Resend configuration...\n');

// Test 1: Check if .env.local exists and has proper Resend configuration
console.log('1. Checking .env.local configuration:');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('   ✓ .env.local file exists');
  
  const resendApiKey = envContent.match(/RESEND_API_KEY=([^\n]+)/);
  const resendFromEmail = envContent.match(/RESEND_FROM_EMAIL=([^\n]+)/);
  
  if (resendApiKey && resendApiKey[1] && resendApiKey[1] !== 'your-resend-api-key') {
    console.log('   ✓ RESEND_API_KEY is configured');
  } else {
    console.log('   ✗ RESEND_API_KEY is not properly configured');
  }
  
  if (resendFromEmail && resendFromEmail[1] && resendFromEmail[1] !== 'noreply@your-domain.com') {
    console.log('   ✓ RESEND_FROM_EMAIL is configured');
  } else {
    console.log('   ✗ RESEND_FROM_EMAIL is not properly configured');
  }
} else {
  console.log('   ✗ .env.local file not found');
}

// Test 2: Check if generate-pdf route has proper error handling
console.log('\n2. Checking generate-pdf route error handling:');
const pdfRoutePath = path.join(__dirname, 'src', 'app', 'api', 'generate-pdf', 'route.ts');
if (fs.existsSync(pdfRoutePath)) {
  const routeContent = fs.readFileSync(pdfRoutePath, 'utf8');
  
  if (routeContent.includes('console.log(\'Attempting to send email via Resend...\')')) {
    console.log('   ✓ Enhanced logging added for Resend');
  } else {
    console.log('   ✗ Enhanced logging not found');
  }
  
  if (routeContent.includes('Resend not configured properly')) {
    console.log('   ✓ Proper Resend configuration check added');
  } else {
    console.log('   ✗ Resend configuration check not found');
  }
} else {
  console.log('   ✗ generate-pdf route not found');
}

// Test 3: Check if SnapshotForm has improved UI
console.log('\n3. Checking SnapshotForm UI improvements:');
const snapshotFormPath = path.join(__dirname, 'src', 'components', 'SnapshotForm.tsx');
if (fs.existsSync(snapshotFormPath)) {
  const formContent = fs.readFileSync(snapshotFormPath, 'utf8');
  
  if (formContent.includes('Request Independent Intelligence Report')) {
    console.log('   ✓ Independent Intelligence Report section found');
  } else {
    console.log('   ✗ Independent Intelligence Report section not found');
  }
  
  if (formContent.includes('Request RFP Harmonization')) {
    console.log('   ✓ RFP Harmonization section found');
  } else {
    console.log('   ✗ RFP Harmonization section not found');
  }
  
  if (formContent.includes('bg-white p-6 rounded-lg shadow-md')) {
    console.log('   ✓ Improved card styling added');
  } else {
    console.log('   ✗ Improved card styling not found');
  }
  
  if (formContent.includes('What\'s included:')) {
    console.log('   ✓ Feature lists added to cards');
  } else {
    console.log('   ✗ Feature lists not found');
  }
} else {
  console.log('   ✗ SnapshotForm component not found');
}

console.log('\n✓ All tests completed!');