'use client';
import React, { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';
import Script from 'next/script';

export default function CookieConsentBanner() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('CookieConsent') === 'true') {
      setConsentGiven(true);
    }
  }, []);

  return (
    <>
      <CookieConsent
        onAccept={() => setConsentGiven(true)}
        location='bottom'
        buttonText='Accept All'
        cookieName='CookieConsent'
      >
        This website uses cookies. Read more in our <Link href='/privacy-policy'>Cookie Policy</Link>.
      </CookieConsent>
      {consentGiven && (
        <>
          <Script src='https://connect.facebook.net/en_US/fbevents.js' strategy='afterInteractive' />
        </>
      )}
    </>
  );
}
