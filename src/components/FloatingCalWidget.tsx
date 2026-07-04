'use client';

import { useEffect, useRef } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { FaCalendarAlt } from "react-icons/fa";

export default function FloatingCalWidget() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    getCalApi({ namespace: 'miterion-cal' }).then((cal) => {
      if (cal) {
        cal('ui', {
          theme: 'light',
          styles: { branding: { brandColor: '#000000' } },
          hideEventTypeDetails: true,
          layout: 'month_view'
        });
      }
    });
  }, []);

  const openCal = async () => {
    const cal = await getCalApi({ namespace: 'miterion-cal' });
    cal('modal', {
      calLink: 'web-app-xkqbra',
      config: { layout: 'month_view' }
    });
  };

  return (
    // Wrapper ukrywający cały pływający widget na urządzeniach mobilnych (hidden md:block)
    <div className="hidden md:block">
      <button
        onClick={openCal}
        className="fixed bottom-48 md:bottom-28 right-4 md:right-6 z-[9999] bg-black text-white px-4 py-3 md:px-5 md:py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-medium text-xs md:text-sm flex items-center gap-2"
      >
        <FaCalendarAlt />
        Book a meeting
      </button>
    </div>
  );
}