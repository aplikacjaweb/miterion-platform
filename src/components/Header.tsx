'use client';

import Link from 'next/link';

export default function Header() {


  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-navy">
          Miterion
        </Link>
      </div>
    </header>
  );
}
