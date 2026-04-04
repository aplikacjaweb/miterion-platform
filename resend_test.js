
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = 'onboarding@resend.dev';
const targetEmail = 'aplikacjaweb@gmail.com'; // Zmieniono na docelowy adres e-mail

if (!resendApiKey) {
  console.error('Błąd: Zmienna środowiskowa RESEND_API_KEY nie jest ustawiona.');
  process.exit(1);
}

const resend = new Resend(resendApiKey);

async function sendTestEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: resendFromEmail,
      to: targetEmail,
      subject: 'Test Miterion',
      html: 'Resend działa',
    });

    if (error) {
      console.error('Błąd podczas wysyłania e-maila:', error);
      return;
    }

    console.log('E-mail testowy wysłany pomyślnie:', data);
  } catch (generalError) {
    console.error('Nieoczekiwany błąd ogólny podczas wysyłania e-maila:', generalError);
  }
}

sendTestEmail();
