
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Błąd: Zmienne środowiskowe NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY nie są ustawione.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testSupabaseAccess() {
  try {
    // 1. Wypisz listę bucketów Storage
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Błąd podczas pobierania listy bucketów:', bucketsError);
      return;
    }
    console.log('--- Lista bucketów Supabase ---');
    if (buckets.length === 0) {
      console.log('Brak bucketów.');
    } else {
      buckets.forEach(bucket => console.log(`- ${bucket.name}`));
    }

    // 2. Wypisz liczbę plików w bucketach: snapshots i reports
    console.log('\n--- Liczba plików w bucketach ---');
    const targetBuckets = ['snapshots', 'reports'];

    for (const bucketName of targetBuckets) {
      try {
        const { data: files, error: filesError } = await supabase.storage.from(bucketName).list();
        if (filesError) {
          if (filesError.statusCode === '404') {
             console.log(`Bucket "${bucketName}" nie istnieje.`);
          } else {
             console.error(`Błąd podczas pobierania plików z bucketa "${bucketName}":`, filesError);
          }
          continue;
        }
        console.log(`Bucket "${bucketName}": ${files.length} plików.`);
      } catch (fileListError) {
        console.error(`Nieoczekiwany błąd podczas dostępu do bucketa "${bucketName}":`, fileListError);
      }
    }

  } catch (generalError) {
    console.error('Nieoczekiwany błąd ogólny:', generalError);
  }
}

testSupabaseAccess();
