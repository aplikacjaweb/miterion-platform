'use client';
import React, { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';
import Script from 'next/script';

export default function CookieConsentBanner() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie_consent');
    if (storedConsent === 'granted') {
      setConsentGiven(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setConsentGiven(true);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
  };

  return (
    <>
      <CookieConsent
        onAccept={handleAccept}
        onDecline={handleDecline}
        location='bottom'
        buttonText='Accept All'
        declineButtonText='Decline'
        cookieName='cookie_consent'
      >
        This website uses cookies to enhance your experience. By clicking "Accept All", you consent to the use of cookies for analytics and marketing purposes. Read more in our <Link href='/privacy-policy'>Privacy Policy</Link>.
      </CookieConsent>
      {consentGiven && (
        <>
          <Script src='https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID' strategy='afterInteractive' />
          <Script id='google-analytics' strategy='afterInteractive'>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `}
          </Script>
          <Script src='https://connect.facebook.net/en_US/fbevents.js' strategy='afterInteractive' />
          <Script id='facebook-pixel' strategy='afterInteractive'>
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_FACEBOOK_PIXEL_ID');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}
    </>
  );
}