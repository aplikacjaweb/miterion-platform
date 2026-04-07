const fetch = require('node-fetch').default;

async function getUploadUrl() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://dummy-project.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwiYXVkIjoic3VwYWJhc2UtZGVtbyIsImlhdCI6MTY2NDUxMjA1NywiZXhwIjoxOTg1MDM4NDU3LCJyb2xlIjoic2VydmljZV9yb2xlIn0.dummy_service_role_key_for_testing';

  try {
    const response = await fetch('http://localhost:3000/api/upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename: 'test-file.pdf' }),
    });

    const jsonResponse = await response.json();
    console.log(JSON.stringify(jsonResponse));

  } catch (e) {
    console.error('Error getting upload URL:', e.message);
  }
}

getUploadUrl();
