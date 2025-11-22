'use client'

import Link from 'next/link'
import { Banner } from '@/types/banner'

interface BannerItemProps {
  banner: Banner
}

export default function BannerItem({ banner }: BannerItemProps) {
  return (
    <Link
      href={banner.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div 
        className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-100"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        <img
          src={banner.imageUrl}
          alt={banner.title || 'Banner'}
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    </Link>
  )
}

