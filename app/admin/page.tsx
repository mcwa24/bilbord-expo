'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/types/banner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdmin, logoutAdmin } from '@/lib/admin';

export default function AdminPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<(Banner | null)[]>(Array(9).fill(null));
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    link: '',
    title: '',
    expiresAt: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/prijava');
      return;
    }
    fetchBanners();
  }, [router]);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
        // Fill array with banners, keeping null for empty slots
        const bannersArray: (Banner | null)[] = Array(9).fill(null);
        data.forEach((banner: Banner, index: number) => {
          if (index < 9) {
            bannersArray[index] = banner;
          }
        });
        setBanners(bannersArray);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('Greška pri upload-u slike.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Greška pri upload-u slike.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, index: number) => {
    e.preventDefault();
    
    if (!formData.imageUrl || !formData.link) {
      alert('Slika i link su obavezni.');
      return;
    }

    try {
      const bannerData = {
        imageUrl: formData.imageUrl,
        link: formData.link,
        title: formData.title || '',
        expiresAt: formData.expiresAt || null,
      };

      let response;
      if (banners[index]) {
        // Update existing banner
        response = await fetch(`/api/banners/${banners[index]?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        });
      } else {
        // Create new banner
        response = await fetch('/api/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        });
      }

      if (response.ok) {
        setEditingIndex(null);
        setFormData({ imageUrl: '', link: '', title: '', expiresAt: '' });
        fetchBanners();
        alert('Baner je uspešno sačuvan!');
      } else {
        alert('Greška pri čuvanju banera.');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Greška pri čuvanju banera.');
    }
  };

  const handleDelete = async (index: number) => {
    if (!banners[index]) return;
    
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj baner?')) {
      return;
    }

    try {
      const response = await fetch(`/api/banners/${banners[index]?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBanners();
        alert('Baner je uspešno obrisan!');
      } else {
        alert('Greška pri brisanju banera.');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Greška pri brisanju banera.');
    }
  };

  const startEditing = (index: number) => {
    const banner = banners[index];
    if (banner) {
      // Format expiresAt date for input field (YYYY-MM-DDTHH:mm)
      const expiresAtValue = banner.expiresAt 
        ? new Date(banner.expiresAt).toISOString().slice(0, 16)
        : '';
      setFormData({
        imageUrl: banner.imageUrl,
        link: banner.link,
        title: banner.title || '',
        expiresAt: expiresAtValue,
      });
    } else {
      setFormData({ imageUrl: '', link: '', title: '', expiresAt: '' });
    }
    setEditingIndex(index);
  };

  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#1d1d1f]">Admin Panel</h1>
          <div className="flex gap-4 items-center">
            <Link
              href="/"
              className="px-4 py-2 text-[#1d1d1f] hover:underline transition-colors duration-200"
            >
              Nazad na sajt
            </Link>
            <button
              onClick={() => {
                logoutAdmin();
                router.push('/prijava');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Odjava
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-[#1d1d1f]">Baneri (9 mesta)</h2>
          
          {loading ? (
            <p className="text-[#222]">Učitavanje...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[300px] flex flex-col"
                >
                  {editingIndex === index ? (
                    <form onSubmit={(e) => handleSubmit(e, index)} className="space-y-4 flex-1 flex flex-col">
                      <div>
                        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                          Upload slike ili URL
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-[#1d1d1f]"
                          disabled={uploading}
                        />
                        <input
                          type="text"
                          placeholder="ili unesite URL slike"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-[#1d1d1f]"
                        />
                        {formData.imageUrl && (
                          <div className="mt-2 w-full aspect-[3/4] overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={formData.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                          Link *
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.link}
                          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-[#1d1d1f]"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                          Datum isteka (opciono)
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.expiresAt}
                          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-[#1d1d1f]"
                          placeholder="Izaberi datum i vreme"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Ako se izabere datum, baner će se automatski obrisati kada istekne.
                        </p>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <button
                          type="submit"
                          disabled={uploading}
                          className="flex-1 px-4 py-2 bg-[#f9c344] text-[#1d1d1f] rounded-lg hover:bg-[#f0b830] transition-colors duration-200 disabled:opacity-50 font-medium"
                        >
                          Sačuvaj
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIndex(null);
                            setFormData({ imageUrl: '', link: '', title: '', expiresAt: '' });
                          }}
                          className="px-4 py-2 bg-gray-200 text-[#1d1d1f] rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                          Otkaži
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {banner ? (
                        <div className="flex-1 flex flex-col">
                          <div className="relative w-full aspect-[3/4] mb-3 overflow-hidden rounded-lg">
                            <img
                              src={banner.imageUrl}
                              alt={banner.title || 'Banner'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <p className="text-sm text-[#222] truncate mb-2">{banner.link}</p>
                            {banner.expiresAt && (
                              <p className="text-xs text-orange-600 mb-2">
                                Ističe: {new Date(banner.expiresAt).toLocaleString('sr-RS')}
                              </p>
                            )}
                            <div className="flex gap-2 mt-auto">
                              <button
                                onClick={() => startEditing(index)}
                                className="flex-1 px-4 py-2 bg-[#f9c344] text-[#1d1d1f] rounded-lg hover:bg-[#f0b830] transition-colors duration-200 font-medium"
                              >
                                Izmeni
                              </button>
                              <button
                                onClick={() => handleDelete(index)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                              >
                                Obriši
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <button
                            onClick={() => startEditing(index)}
                            className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#f9c344] transition-colors duration-200 text-gray-400 hover:text-[#1d1d1f]"
                          >
                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-sm font-medium">Dodaj baner</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

