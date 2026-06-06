'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {


  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo-miterion.png" alt="Miterion Logo" width={200} height={50} />
        </Link>
      </div>
    </header>
  );
}
