'use client';

import Link from 'next/link';
import Image from 'next/image';
import ExpertSupportDialog from './ExpertSupportDialog';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo-miterion.png" alt="Miterion Logo" width={200} height={50} />
        </Link>
        <ExpertSupportDialog 
          initialTab="selection"
          trigger={
            <Button className="bg-teal hover:opacity-90 text-white font-medium text-sm px-4 py-2 rounded-md transition-all">
              Request Expert Support
            </Button>
          }
        />
      </div>
    </header>
  );
}