const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rvhixnyxpluihvnwtiew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aGl4bnl4cGx1aWh2bnd0aWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA1MjI5NSwiZXhwIjoyMDg4NjI4Mjk1fQ._yXAn_ZAAAWCu-4anAYITkza6ImmVLMYEVYvHG_5J8k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- RPC METADATA CHECK ---');
  
  // Checking for common RPC names that might allow SQL execution or schema inspection
  const commonRpcs = ['exec_sql', 'execute_sql', 'run_sql', 'sql', 'query'];
  
  for (const rpcName of commonRpcs) {
    const { data, error } = await supabase.rpc(rpcName, { query: "SELECT 1" });
    if (error && error.message.includes('method not found')) {
      // Not this one
    } else {
      console.log(`RPC '${rpcName}' response:`, error ? error.message : 'SUCCESS');
    }
  }

  console.log('--- END CHECK ---');
}

run();
