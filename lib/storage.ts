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
      console.error('Error fetching banners:', error);
      return [];
    }

    console.log('Fetched banners:', data?.length || 0);
    
    const mapped = (data || []).map((banner: any) => ({
      id: banner.id.toString(),
      imageUrl: banner.image_url,
      link: banner.link,
      title: banner.title || '',
      createdAt: banner.created_at,
      position: banner.position ?? null,
    }));
    
    console.log('Mapped banners:', mapped.length);
    return mapped;
  } catch (error) {
    console.error('Error fetching banners:', error);
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
        console.error('Error saving banners:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error saving banners:', error);
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
      console.error('Error adding banner:', error);
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
    console.error('Error adding banner:', error);
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
      console.error('Error updating banner:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating banner:', error);
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
      console.error('Error deleting banner:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
}
