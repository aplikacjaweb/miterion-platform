// Cookie Consent Management

export const setCookieConsent = (consent: boolean, preferences?: any) => {
  if (consent) {
    localStorage.setItem('cookieConsent', 'true');
    if (preferences) {
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    }
  } else {
    localStorage.setItem('cookieConsent', 'false');
  }
};

export const getCookieConsent = () => {
  return localStorage.getItem('cookieConsent');
};

export const getCookiePreferences = () => {
  const preferences = localStorage.getItem('cookiePreferences');
  return preferences ? JSON.parse(preferences) : null;
};

export const loadScripts = () => {
  const consent = getCookieConsent();
  if (consent === 'true') {
    // Load scripts here
    console.log('Loading scripts...');
  }
};