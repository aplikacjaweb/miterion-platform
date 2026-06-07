import React, { useState } from 'react';

export const CookieBanner = () => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleAcceptAll = () => {
    // Logic to accept all cookies
    setConsentGiven(true);
  };

  const handleRejectAll = () => {
    // Logic to reject all cookies
    setConsentGiven(true);
  };

  const handlePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  if (consentGiven) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <p>
          We use cookies to analyze site traffic, personalize content, and serve targeted ads.
          You can choose to accept all, reject all, or manage your preferences.
        </p>
        <div className="cookie-banner-buttons">
          <button onClick={handleAcceptAll} className="cookie-button accept-button">Accept All</button>
          <button onClick={handleRejectAll} className="cookie-button reject-button">Reject All</button>
          <button onClick={handlePreferences} className="cookie-button preferences-button">Preferences</button>
        </div>
        {showPreferences && (
          <div className="cookie-preferences">
            <h3>Cookie Preferences</h3>
            <label>
              <input type="checkbox" /> Necessary
            </label>
            <label>
              <input type="checkbox" /> Analytics
            </label>
            <label>
              <input type="checkbox" /> Marketing
            </label>
            <button onClick={() => setShowPreferences(false)}>Save Preferences</button>
          </div>
        )}
      </div>
    </div>
  );
};