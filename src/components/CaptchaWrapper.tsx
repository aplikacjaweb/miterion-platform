'use client';
import { Turnstile } from '@marsidev/react-turnstile';

export default function CaptchaWrapper({ onVerify }: { onVerify: (token: string) => void }) {
  return (
    <Turnstile 
      siteKey="0x4AAAAAADoSriRgvTkLLDSW" 
      onSuccess={(token) => onVerify(token)}
    />
  );
}
