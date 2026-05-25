
const { createClient } = require('@supabase/supabase-js');

async function test() {
  const url = 'https://abc.supabase.co';
  const key = 'abc';
  
  try {
    const supabase = createClient(url, key);
    console.log('Client created');
    
    console.log('Storage exists:', !!supabase.storage);
    const bucket = supabase.storage.from('test');
    console.log('Bucket object exists:', !!bucket);
    console.log('uploadToSignedUrl exists:', typeof bucket.uploadToSignedUrl);
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
