const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rvhixnyxpluihvnwtiew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aGl4bnl4cGx1aWh2bnd0aWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTIyOTUsImV4cCI6MjA4ODYyODI5NX0.ox6Ac4XWEMXncPozXWC2c6Cbx7toALhkFbOYIK-14v0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test(name, payload) {
 const res = await supabase.from('leads').insert([payload]);
 console.log(name);
 console.log(JSON.stringify(res, null, 2));
}

(async () => {
 await test('fullReportMappedPayload', {
    email: "test@example.com",
    company: "Mechanism: Test Mechanism, Planned Start: Q3 2026",
    indication: "FULL_REPORT_SUBMITTED",
    phase: "REPORT_REQUESTED",
    country: null,
    country_code: null,
    user_question: "Missing required data from external sources.",
    pdf_path: null
 });
})();