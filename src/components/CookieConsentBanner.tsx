'use client';

import React from 'react';
import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Reject All"
      enableDeclineButton
      cookieName="miterionCookieConsent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      declineButtonStyle={{ color: "#4e503b", fontSize: "13px", backgroundColor: "#f0f0f0" }}
      expires={365}
      onAccept={() => {
        // You can add logic here to enable analytics/advertising cookies
        console.log("User accepted all cookies.");
      }}
      onDecline={() => {
        // You can add logic here to disable non-essential cookies
        console.log("User declined non-essential cookies.");
      }}
      flipButtons
    >
      This website uses cookies to enhance the user experience and analyze site usage. By clicking "Accept All", you agree to the storing of cookies on your device. You can manage your preferences or learn more in our{" "}
      <Link href="/cookies" className="text-teal-400 hover:underline">
        Cookie Policy
      </Link>
      .
    </CookieConsent>
  );
}
