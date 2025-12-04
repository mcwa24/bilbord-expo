'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/types/banner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdmin, logoutAdmin } from '@/lib/admin';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

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
  const [positionsChanged, setPositionsChanged] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/prijava');
      return;
    }
    fetchBanners();
  }, [router]);

  const fetchBanners = async (skipLoading = false) => {
    try {
      if (!skipLoading) setLoading(true);
      // Add cache busting to ensure fresh data - use timestamp
      const cacheBuster = `?t=${Date.now()}&_=${Math.random()}`;
      const response = await fetch(`/api/banners${cacheBuster}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched banners:', data);
        console.log('Banners with positions:', data.map((b: Banner) => ({ id: b.id, position: b.position })));
        
        // Sort banners by position first, then by created_at DESC
        const sortedData = [...data].sort((a: Banner, b: Banner) => {
          // If both have position, sort by position
          if (a.position !== null && a.position !== undefined && 
              b.position !== null && b.position !== undefined) {
            return a.position - b.position;
          }
          // If only one has position, it comes first
          if (a.position !== null && a.position !== undefined && 
              (b.position === null || b.position === undefined)) return -1;
          if ((a.position === null || a.position === undefined) && 
              b.position !== null && b.position !== undefined) return 1;
          // If neither has position, sort by created_at DESC (newest first)
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        });
        
        console.log('Sorted banners:', sortedData.map((b: Banner) => ({ id: b.id, position: b.position })));
        
        // Fill array with banners, keeping null for empty slots
        const bannersArray: (Banner | null)[] = Array(9).fill(null);
        sortedData.forEach((banner: Banner, index: number) => {
          if (index < 9) {
            bannersArray[index] = banner;
          }
        });
        console.log('Setting banners array:', bannersArray.map((b, i) => ({ index: i, id: b?.id, position: b?.position })));
        setBanners(bannersArray);
        setPositionsChanged(false); // Reset when banners are loaded
      } else {
        console.error('Failed to fetch banners:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      if (!skipLoading) setLoading(false);
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = banners.findIndex((_, idx) => idx.toString() === active.id);
      const newIndex = banners.findIndex((_, idx) => idx.toString() === over.id);
      
      const newBanners = arrayMove(banners, oldIndex, newIndex);
      setBanners(newBanners);
      setPositionsChanged(true); // Mark that positions have changed
    }
  };

  const handleSavePositions = async () => {
    try {
      const updates = banners
        .map((banner, index) => {
          if (!banner) return null;
          return {
            id: banner.id,
            position: index,
          };
        })
        .filter(Boolean);

      console.log('Saving positions:', updates);

      const response = await fetch('/api/banners/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ positions: updates }),
      });

      const result = await response.json();
      console.log('Save response:', result);

      if (response.ok) {
        console.log('Positions saved successfully, verified:', result.verified);
        
        // Keep current order in state (it's already correct)
        // Just mark that positions are saved
        setPositionsChanged(false);
        
        // Wait longer for database to commit the transaction
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Now fetch fresh data from server with aggressive cache busting
        const freshResponse = await fetch(`/api/banners?t=${Date.now()}&_=${Math.random()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });
        
        if (freshResponse.ok) {
          const freshData = await freshResponse.json();
          console.log('Fresh banners after save (raw):', freshData.map((b: Banner) => ({ id: b.id, position: b.position, positionType: typeof b.position })));
          
          // Sort banners by position first, then by created_at DESC
          const sortedData = [...freshData].sort((a: Banner, b: Banner) => {
            // Handle position 0 correctly - it's a valid position
            const aPos = a.position !== null && a.position !== undefined ? a.position : Infinity;
            const bPos = b.position !== null && b.position !== undefined ? b.position : Infinity;
            
            if (aPos !== Infinity && bPos !== Infinity) {
              return aPos - bPos;
            }
            if (aPos !== Infinity && bPos === Infinity) return -1;
            if (aPos === Infinity && bPos !== Infinity) return 1;
            
            // If neither has position, sort by created_at DESC (newest first)
            const aDate = new Date(a.createdAt || 0).getTime();
            const bDate = new Date(b.createdAt || 0).getTime();
            return bDate - aDate;
          });
          
          console.log('Fresh sorted banners:', sortedData.map((b: Banner) => ({ id: b.id, position: b.position })));
          
          // Fill array with banners
          const bannersArray: (Banner | null)[] = Array(9).fill(null);
          sortedData.forEach((banner: Banner, index: number) => {
            if (index < 9) {
              bannersArray[index] = banner;
            }
          });
          
          console.log('Final banners array:', bannersArray.map((b, i) => ({ index: i, id: b?.id, position: b?.position })));
          setBanners(bannersArray);
        }
        
        // Show alert after refresh
        setTimeout(() => {
          alert('Redosled banera je uspešno sačuvan!');
        }, 100);
      } else {
        console.error('Failed to save positions:', result);
        alert(`Greška pri čuvanju redosleda banera: ${result.error || 'Nepoznata greška'}`);
      }
    } catch (error) {
      console.error('Error saving banner positions:', error);
      alert(`Greška pri čuvanju redosleda banera: ${error instanceof Error ? error.message : 'Nepoznata greška'}`);
    }
  };

  // Sortable item component
  function SortableBannerItem({ banner, index }: { banner: Banner | null; index: number }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: index.toString(), disabled: editingIndex !== null });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-dashed border-gray-300 rounded-xl p-3 min-h-[200px] flex flex-col relative"
      >
        {banner && editingIndex === null && (
          <button
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing z-10 bg-white rounded shadow-sm"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}
        {editingIndex === index ? (
          <form onSubmit={(e) => handleSubmit(e, index)} className="space-y-3 flex-1 flex flex-col text-sm">
            <div>
              <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                Upload slike ili URL
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-[#1d1d1f]"
                disabled={uploading}
              />
              <input
                type="text"
                placeholder="ili unesite URL slike"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full mt-1.5 px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-xs text-[#1d1d1f]"
              />
              {formData.imageUrl && (
                <div className="mt-1.5 w-full aspect-[3/4] overflow-hidden rounded-lg border border-gray-200 max-h-32">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                Link *
              </label>
              <input
                type="url"
                required
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-xs text-[#1d1d1f]"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                Datum isteka (opciono)
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-xs text-[#1d1d1f]"
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
                className="flex-1 px-3 py-1.5 bg-[#f9c344] text-[#1d1d1f] rounded-lg hover:bg-[#f0b830] transition-colors duration-200 disabled:opacity-50 text-xs font-medium"
              >
                Sačuvaj
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setFormData({ imageUrl: '', link: '', title: '', expiresAt: '' });
                }}
                className="px-3 py-1.5 bg-gray-200 text-[#1d1d1f] rounded-lg hover:bg-gray-300 transition-colors duration-200 text-xs"
              >
                Otkaži
              </button>
            </div>
          </form>
        ) : (
          <>
            {banner ? (
              <div className="flex-1 flex flex-col">
                <div className="relative w-full aspect-[3/4] mb-2 overflow-hidden rounded-lg max-h-32">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-xs text-[#222] truncate mb-1">{banner.link}</p>
                  {banner.expiresAt && (
                    <p className="text-xs text-orange-600 mb-1">
                      Ističe: {new Date(banner.expiresAt).toLocaleDateString('sr-RS')}
                    </p>
                  )}
                  <div className="flex gap-1.5 mt-auto">
                    <button
                      onClick={() => startEditing(index)}
                      className="flex-1 px-2 py-1.5 bg-[#f9c344] text-[#1d1d1f] rounded-lg hover:bg-[#f0b830] transition-colors duration-200 text-xs font-medium"
                    >
                      Izmeni
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-2 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-xs"
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
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium">Dodaj baner</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#1d1d1f]">Baneri (9 mesta)</h2>
            {positionsChanged && (
              <button
                onClick={handleSavePositions}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sačuvaj redosled
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4">💡 Koristi ikonu za rearanžiranje banera (drag & drop), zatim klikni "Sačuvaj redosled"</p>
          
          {loading ? (
            <p className="text-[#222]">Učitavanje...</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={banners.map((_, index) => index.toString())}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {banners.map((banner, index) => (
                    <SortableBannerItem key={index} banner={banner} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </main>
  );
}

