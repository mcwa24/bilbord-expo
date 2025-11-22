import { getBanners } from '@/lib/storage';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const banners = await getBanners();

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="container mx-auto px-4 py-8">
        {banners.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#222] text-lg">Nema banera za prikaz.</p>
            <Link 
              href="/admin" 
              className="mt-4 inline-block text-[#1d1d1f] hover:underline"
            >
              Dodaj baner
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {banners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-100">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
