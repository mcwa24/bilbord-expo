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

interface SortableBannerItemProps {
  banner: Banner | null;
  index: number;
  editingIndex: number | null;
  formData: { imageUrl: string; link: string; title: string };
  uploading: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onSubmit: (e: React.FormEvent, index: number) => void;
  onFileUpload: (file: File) => void;
  onFormDataChange: (data: { imageUrl: string; link: string; title: string }) => void;
  onCancelEdit: () => void;
}

function SortableBannerItem({
  banner,
  index,
  editingIndex,
  formData,
  uploading,
  onEdit,
  onDelete,
  onSubmit,
  onFileUpload,
  onFormDataChange,
  onCancelEdit,
}: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `banner-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[300px] flex flex-col relative"
    >
      {banner && editingIndex !== index && (
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-grab active:cursor-grabbing z-10"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} className="text-gray-600" />
        </button>
      )}

      {editingIndex === index ? (
        <form onSubmit={(e) => onSubmit(e, index)} className="space-y-4 flex-1 flex flex-col">
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
              Upload slike ili URL
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-[#1d1d1f]"
              disabled={uploading}
            />
            <input
              type="text"
              placeholder="ili unesite URL slike"
              value={formData.imageUrl}
              onChange={(e) => onFormDataChange({ ...formData, imageUrl: e.target.value })}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-[#1d1d1f]"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded"
              />
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
              onChange={(e) => onFormDataChange({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c344] focus:border-transparent text-[#1d1d1f]"
              placeholder="https://example.com"
            />
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
              onClick={onCancelEdit}
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
              <div className="relative w-full aspect-[4/5] mb-3 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Banner'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <p className="text-sm text-[#222] truncate mb-2">{banner.link}</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => onEdit(index)}
                    className="flex-1 px-4 py-2 bg-[#f9c344] text-[#1d1d1f] rounded-lg hover:bg-[#f0b830] transition-colors duration-200 font-medium"
                  >
                    Izmeni
                  </button>
                  <button
                    onClick={() => onDelete(index)}
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
                onClick={() => onEdit(index)}
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
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<(Banner | null)[]>(Array(9).fill(null));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    link: '',
    title: '',
  });
  const [uploading, setUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savingPositions, setSavingPositions] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isAdmin()) {
      router.replace('/prijava');
      return;
    }
    setIsAuthenticated(true);
    fetchBanners();
  }, [router]);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = parseInt(active.id.toString().replace('banner-', ''));
    const newIndex = parseInt(over.id.toString().replace('banner-', ''));

    if (oldIndex === newIndex) {
      return;
    }

    const newBanners = arrayMove(banners, oldIndex, newIndex);
    setBanners(newBanners);
    setHasUnsavedChanges(true);
  };

  const handleSavePositions = async () => {
    setSavingPositions(true);
    try {
      const bannersToUpdate = banners
        .map((banner, index) => banner ? { id: banner.id, position: index } : null)
        .filter(Boolean) as { id: string; position: number }[];

      const response = await fetch('/api/banners/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ banners: bannersToUpdate }),
      });

      if (response.ok) {
        setHasUnsavedChanges(false);
        alert('Pozicije banera su uspešno sačuvane!');
      } else {
        alert('Greška pri čuvanju pozicija.');
        fetchBanners();
      }
    } catch (error) {
      console.error('Error saving banner positions:', error);
      alert('Greška pri čuvanju pozicija.');
      fetchBanners();
    } finally {
      setSavingPositions(false);
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
        position: index,
      };

      let response;
      if (banners[index]) {
        response = await fetch(`/api/banners/${banners[index]?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        });
      } else {
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
        setFormData({ imageUrl: '', link: '', title: '' });
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
      setFormData({
        imageUrl: banner.imageUrl,
        link: banner.link,
        title: banner.title || '',
      });
    } else {
      setFormData({ imageUrl: '', link: '', title: '' });
    }
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setFormData({ imageUrl: '', link: '', title: '' });
  };

  if (!isAuthenticated) {
    return null;
  }

  const sortableIds = banners.map((_, index) => `banner-${index}`);

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
            <div>
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Baneri (9 mesta)</h2>
              <p className="text-sm text-gray-600 mt-1">Prevuci banere da promeniš njihov redosled</p>
              <p className="text-xs text-gray-500 mt-1">Preporučene dimenzije: 1080 × 1350px (4:5 aspect ratio)</p>
            </div>
            {hasUnsavedChanges && (
              <button
                onClick={handleSavePositions}
                disabled={savingPositions}
                className="px-6 py-2 bg-[#f9c344] text-[#1d1d1f] rounded-lg hover:bg-[#f0b830] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPositions ? 'Čuvanje...' : 'Sačuvaj pozicije'}
              </button>
            )}
          </div>
          
          {loading ? (
            <p className="text-[#222]">Učitavanje...</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((banner, index) => (
                    <SortableBannerItem
                      key={`banner-${index}`}
                      banner={banner}
                      index={index}
                      editingIndex={editingIndex}
                      formData={formData}
                      uploading={uploading}
                      onEdit={startEditing}
                      onDelete={handleDelete}
                      onSubmit={handleSubmit}
                      onFileUpload={handleFileUpload}
                      onFormDataChange={setFormData}
                      onCancelEdit={handleCancelEdit}
                    />
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
