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
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo-miterion.png" alt="Miterion Logo" width={200} height={50} />
        </Link>

        <div className="flex items-center gap-4">
          {/* Przycisk desktopowy – ukryty na mobile */}
          <ExpertSupportDialog 
            trigger={
              <Button className="hidden md:inline-flex bg-teal hover:opacity-90 text-white font-medium text-sm px-4 py-2 rounded-md transition-all">
                Request Custom Review
              </Button>
            }
          />

          {/* Przycisk hamburgera po prawej stronie (widoczny tylko na mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#deded8] bg-white text-slate-900 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobilne menu pod paskiem głównym (trzy zdegradowane pozycje bez rywalizacji wizualnej) */}
      {mobileMenuOpen && (
        <div className="border-t border-[#deded8] bg-white px-4 py-4 md:hidden">
          <nav className="mx-auto flex flex-col gap-1">
            
            {/* 1. Request Custom Review */}
            <ExpertSupportDialog
              trigger={
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-md px-4 py-3 text-left text-[15px] font-medium text-slate-800 hover:bg-slate-50 transition-all"
                >
                  Request Custom Review
                </button>
              }
            />

            {/* 2. Book a 20-min review call */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCal();
              }}
              className="w-full rounded-md px-4 py-3 text-left text-[15px] font-medium text-slate-800 hover:bg-slate-50 transition-all"
            >
              Book a 20-min review call
            </button>

            {/* 3. Generate Free Snapshot */}
            <a
              href="#snapshot"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full rounded-md px-4 py-3 text-left text-[15px] font-medium text-slate-800 hover:bg-slate-50 transition-all block"
            >
              Generate Free Snapshot
            </a>

          </nav>
        </div>
      )}
    </header>
  );
}