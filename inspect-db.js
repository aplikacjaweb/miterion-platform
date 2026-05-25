const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rvhixnyxpluihvnwtiew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aGl4bnl4cGx1aWh2bnd0aWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA1MjI5NSwiZXhwIjoyMDg4NjI4Mjk1fQ._yXAn_ZAAAWCu-4anAYITkza6ImmVLMYEVYvHG_5J8k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- DIRECT DATABASE CHECK ---');
  
  // 1. Check to_regclass via RPC (requires an RPC named 'exec_sql' or similar to be present)
  // Since we can't assume custom RPCs, we try a common pattern if available.
  // But usually, without a 'query' RPC, we can only check via API visibility.
  
  console.log('1. Checking visibility of "uploads" table via API...');
  const { data, error } = await supabase.from('uploads').select('id').limit(1);
  
  if (error) {
    console.log('API Visibility Check: FAILED');
    console.log('Error Message:', error.message);
    if (error.hint) console.log('Hint:', error.hint);
  } else {
    console.log('API Visibility Check: SUCCESS (Table is visible)');
  }

  // 2. Checking "leads" table as a baseline
  console.log('\n2. Baseline check ("leads" table)...');
  const { data: leadsData, error: leadsError } = await supabase.from('leads').select('id').limit(1);
  console.log('Leads Table Status:', leadsError ? 'FAILED: ' + leadsError.message : 'OK');

  console.log('---------------------------');
}

run();
