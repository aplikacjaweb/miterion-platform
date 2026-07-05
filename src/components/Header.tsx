'use client';

import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from "lucide-react";
import ExpertSupportDialog from './ExpertSupportDialog';
import { Button } from './ui/button';
import { getCalApi } from '@calcom/embed-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Funkcja wywołująca Cal.com
  const openCal = async () => {
    const cal = await getCalApi({ namespace: 'miterion-cal' });
    cal('modal', {
      calLink: 'web-app-xkqbra',
      config: { layout: 'month_view' }
    });
  };

  return (
    <>
      {/* Pasek główny */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#deded8]/60 sticky top-0 z-50 h-16 flex items-center transition-all duration-300">
        <div className="container mx-auto px-4 w-full flex items-center justify-between">
          
          {/* Lewa strona: Logo + Dyskretna nawigacja desktopowa */}
          <div className="flex items-center gap-8">
            <Link href="/">
              <Image src="/logo-miterion.png" alt="Miterion Logo" width={200} height={50} />
            </Link>

            {/* Menu widoczne tylko na desktopach */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/#starting-points"
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                Services
              </Link>
              <Link
                href="/#snapshot"
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                Free Tool
              </Link>
            </nav>
          </div>

          {/* Prawa strona: Akcje i Hamburger */}
          <div className="flex items-center gap-4">
            {/* Przycisk desktopowy – ukryty na mobile */}
            <ExpertSupportDialog 
              initialTab="notsure"
              trigger={
                <Button className="hidden md:inline-flex bg-teal hover:opacity-90 text-white font-medium text-sm px-4 py-2 rounded-md transition-all">
                  Request Custom Review
                </Button>
              }
            />

            {/* Przycisk hamburgera po prawej stronie (vidoczny tylko na mobile) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#deded8] bg-white text-slate-900 md:hidden z-50 relative"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobilne menu jako boczny panel wysuwany od prawej strony */}
      <div 
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-1/2 min-w-[240px] border-l border-[#deded8]/80 bg-white/80 backdrop-blur-md px-4 py-6 md:hidden shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-2">
          
          <a
            href="#starting-points"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full rounded-md px-4 py-3 text-left text-[15px] font-medium text-slate-800 hover:bg-slate-900/5 transition-all block"
          >
            Services
          </a>
          
          <ExpertSupportDialog
            initialTab="notsure"
            trigger={
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full rounded-md px-4 py-3 text-left text-[15px] font-medium text-slate-800 hover:bg-slate-900/5 transition-all"
              >
                Request Custom Review
              </button>
            }
          />

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openCal();
            }}
            className="w-full rounded-md px-4 py-3 text-left text-[15px] font-medium text-slate-800 hover:bg-slate-900/5 transition-all"
          >
            Book a 20-min review call
          </button>

          <a
            href="#snapshot"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full rounded-md px-4 py-3 text-left text-[15px] font-medium text-slate-800 hover:bg-slate-900/5 transition-all block"
          >
            Generate Free Snapshot
          </a>

        </nav>
      </div>
    </>
  );
}