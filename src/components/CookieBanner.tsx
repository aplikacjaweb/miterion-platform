'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Cookies from 'js-cookie';

export default function CookieBanner() {
  const t = useTranslations('Common.cookieBanner');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'accepted', { expires: 365 });
    setShow(false);
  };

  const handleReject = () => {
    Cookies.set('cookie_consent', 'rejected', { expires: 365 });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            {t('message')}
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              className="btn-primary text-sm py-1"
            >
              {t('accept')}
            </button>
            <button
              onClick={handleReject}
              className="btn-secondary text-sm py-1"
            >
              {t('reject')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}