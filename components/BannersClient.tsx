'use client';

import { Banner } from '@/types/banner';
import Link from 'next/link';
import Image from 'next/image';

interface BannersClientProps {
  initialBanners: Banner[];
}

export default function BannersClient({ initialBanners }: BannersClientProps) {
  if (initialBanners.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#222] text-lg">Nema banera za prikaz.</p>
        <Link 
          href="/admin" 
          className="mt-4 inline-block text-[#1d1d1f] hover:underline"
        >
          Dodaj baner
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {initialBanners.map((banner, index) => (
        <Link
          key={banner.id}
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image
              src={banner.imageUrl}
              alt={banner.title || 'Banner'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              loading={index < 6 ? 'eager' : 'lazy'}
              priority={index < 3}
              quality={85}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

