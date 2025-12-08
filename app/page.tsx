import { getBanners } from '@/lib/storage';
import BannersClient from '@/components/BannersClient';
import { Banner } from '@/types/banner';

// Use ISR with 60 second revalidation for better performance
// This allows pages to be cached and served quickly, while still updating every minute
export const revalidate = 60;

export default async function Home() {
  let banners: Banner[] = [];
  
  try {
    banners = await getBanners();
  } catch (error) {
    console.error('[Home] Error fetching banners:', error);
  }

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="container mx-auto px-4 py-8">
        <BannersClient initialBanners={banners} />
      </div>
    </main>
  );
}
