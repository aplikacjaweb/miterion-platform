const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectAndFix() {
  console.log('--- DATABASE VISIBILITY INSPECTION ---');
  console.log('Project:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  // 1. Check if table physically exists via raw SQL if possible, or inference
  console.log('1. Checking table existence...');
  const { data: reg, error: regError } = await supabase.rpc('execute_sql', { 
    sql: "SELECT to_regclass('public.uploads') as reg;" 
  });

  if (regError) {
    console.log('   SQL_CHECK_FAILED:', regError.message);
    console.log('   (Falling back to direct table select attempt...)');
    const { error: directError } = await supabase.from('uploads').select('id').limit(1);
    console.log('   DIRECT_SELECT_RESULT:', directError ? directError.message : 'SUCCESS');
  } else {
    console.log('   TABLE_REGCLASS:', reg);
  }

  // 2. Attempt Schema Reload via RPC if available
  console.log('2. Attempting PostgREST schema reload...');
  const { error: reloadError } = await supabase.rpc('reload_schema');
  if (reloadError) {
    console.log('   RELOAD_RPC_FAILED:', reloadError.message);
    console.log('   (Note: Reload usually requires Dashboard action or a specific admin RPC)');
  } else {
    console.log('   RELOAD_RPC_SUCCESS');
  }

  console.log('--- INSPECTION COMPLETE ---');
}

inspectAndFix();
