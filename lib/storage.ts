import { Banner } from '@/types/banner';
import { supabase } from './supabase-server';

// Supabase storage functions
export async function getBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('position', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });

    if (error) {
      return [];
    }
    
    const mapped = (data || []).map((banner: any) => ({
      id: banner.id.toString(),
      imageUrl: banner.image_url,
      link: banner.link,
      title: banner.title || '',
      createdAt: banner.created_at,
      position: banner.position ?? null,
    }));
    
    return mapped;
  } catch (error) {
    return [];
  }
}

export async function saveBanners(banners: Banner[]): Promise<void> {
  try {
    // Delete all existing banners
    await supabase.from('banners').delete().neq('id', 0);

    // Insert new banners
    const bannersToInsert = banners.map((banner) => ({
      image_url: banner.imageUrl,
      link: banner.link,
      title: banner.title || '',
    }));

    if (bannersToInsert.length > 0) {
      const { error } = await supabase.from('banners').insert(bannersToInsert);
      if (error) {
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function addBanner(banner: Banner): Promise<Banner> {
  try {
    const { data, error } = await supabase.from('banners').insert({
      image_url: banner.imageUrl,
      link: banner.link,
      title: banner.title || '',
      position: banner.position ?? null,
    }).select().single();

    if (error) {
      throw error;
    }

    return {
      id: data.id.toString(),
      imageUrl: data.image_url,
      link: data.link,
      title: data.title || '',
      createdAt: data.created_at,
      position: data.position ?? null,
    };
  } catch (error) {
    throw error;
  }
}

export async function updateBanner(id: string, banner: Banner): Promise<void> {
  try {
    const bannerId = parseInt(id) || id;
    const { error } = await supabase
      .from('banners')
      .update({
        image_url: banner.imageUrl,
        link: banner.link,
        title: banner.title || '',
        position: banner.position ?? null,
      })
      .eq('id', bannerId);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteBanner(id: string): Promise<void> {
  try {
    const bannerId = parseInt(id) || id;
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', bannerId);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
