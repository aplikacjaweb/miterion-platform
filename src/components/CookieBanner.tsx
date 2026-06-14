'use client';
import { useState, useEffect } from 'react';

export const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the user has already made a decision
    if (!localStorage.getItem('cookie-consent')) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-gray-100 p-4 sm:p-6 z-[9999] shadow-2xl border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-20 sm:pb-0">
        <div className="text-sm text-center sm:text-left flex-1">
          <p className="font-medium text-white mb-1">We value your privacy</p>
          <p className="text-gray-400">
            This website uses cookies to ensure you get the best experience on our website and for analytical purposes.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto justify-center">
          <button
            onClick={() => {
              localStorage.setItem('cookie-consent', 'reject');
              setShow(false);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
          >
            Reject
          </button>
          <button
            onClick={() => {
              localStorage.setItem('cookie-consent', 'accept');
              setShow(false);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors w-full sm:w-auto shadow-md"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};