'use client';

import { useEffect, useState } from 'react';
import { getCalApi } from '@calcom/embed-react';

export default function FloatingCalWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Wstępne załadowanie API Cal.com w tle
    (async function () {
      const cal = await getCalApi({ namespace: 'miterion-cal' });
      if (cal) {
        cal('ui', { 
          theme: 'light', 
          styles: { branding: { brandColor: '#000000' } }, 
          hideEventTypeDetails: true, 
          layout: 'month_view' 
        });
      }
    })();
  }, []);

  const openCal = async () => {
    const cal = await getCalApi({ namespace: 'miterion-cal' });
    cal('modal', { 
      calLink: 'web-app-xkqbra',
      config: { layout: 'month_view' }
    });
  };

  return (
    <button 
      onClick={openCal}
      className="fixed bottom-6 right-6 z-[9999] bg-black text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-medium text-sm"
    >
      Book a meeting
    </button>
  );
}