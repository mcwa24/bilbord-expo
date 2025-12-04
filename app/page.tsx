import { getBanners } from '@/lib/storage';
import Link from 'next/link';
import BannersClient from '@/components/BannersClient';

export default async function Home() {
  let banners = [];
  
  try {
    banners = await getBanners();
    console.log('[Home] Banners fetched:', banners.length);
  } catch (error) {
    console.error('[Home] Error fetching banners:', error);
  }

  // Pass banners as initial data to client component for hydration
  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="container mx-auto px-4 py-8">
        <BannersClient initialBanners={banners} />
      </div>
    </main>
  );
}
