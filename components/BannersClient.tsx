'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/types/banner';
import Link from 'next/link';

interface BannersClientProps {
  initialBanners: Banner[];
}

export default function BannersClient({ initialBanners }: BannersClientProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [loading, setLoading] = useState(false);

  // Fetch banners on client-side if initial banners are empty
  useEffect(() => {
    if (banners.length === 0) {
      setLoading(true);
      fetch('/api/banners')
        .then(res => res.json())
        .then(data => {
          setBanners(data || []);
        })
        .catch(err => {
          console.error('Error fetching banners:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [banners.length]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-[#222] text-lg">Učitavanje banera...</p>
      </div>
    );
  }

  if (banners.length === 0) {
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
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src={banner.imageUrl}
              alt={banner.title || 'Banner'}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

