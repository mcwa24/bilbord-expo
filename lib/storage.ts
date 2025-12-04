import { Banner } from '@/types/banner';
import { supabase } from './supabase-server';

// Delete expired banners
export async function deleteExpiredBanners(): Promise<void> {
  try {
    const now = new Date().toISOString();
    
    // Only delete banners where expires_at is NOT null AND expires_at < now
    // This ensures we don't delete banners without expiration dates
    const { data, error } = await supabase
      .from('banners')
      .select('id, expires_at')
      .not('expires_at', 'is', null)
      .lt('expires_at', now);

    if (error) {
      console.error('Error fetching expired banners:', error);
      return;
    }

    if (data && data.length > 0) {
      // Delete expired banners by ID
      const expiredIds = data.map(b => b.id);
      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .in('id', expiredIds);

      if (deleteError) {
        console.error('Error deleting expired banners:', deleteError);
      } else {
        console.log(`Deleted ${expiredIds.length} expired banner(s)`);
      }
    }
  } catch (error) {
    console.error('Error deleting expired banners:', error);
  }
}

// Supabase storage functions
export async function getBanners(): Promise<Banner[]> {
  try {
    // First, delete expired banners (only if expires_at column exists and has values)
    // This is safe - it only deletes banners with expires_at set AND expired
    try {
      await deleteExpiredBanners();
    } catch (err) {
      // If expires_at column doesn't exist yet, ignore the error
      console.log('Skipping expired banners deletion (column may not exist yet)');
    }

    // Try direct HTTP request first (more reliable for server-side)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqpmbcknztcofausqzfa.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcG1iY2tuenRjb2ZhdXNxemZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODEzNDksImV4cCI6MjA3OTI1NzM0OX0.6fOBiostBVt68cnKJXFD8GSBtAR4PUpyBLhk3y4hvu8';
    
    // Use REST API directly for better RLS compatibility
    // Fetch all banners first, then filter expired ones
    // Order by created_at DESC so newest banners appear first
    const response = await fetch(
      `${supabaseUrl}/rest/v1/banners?select=*&order=created_at.desc`,
      {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      console.error('HTTP Error fetching banners:', response.status, response.statusText);
      // Fallback to Supabase client
      return await getBannersFallback();
    }

    const data = await response.json();
    console.log('Fetched banners count (HTTP):', data?.length || 0);
    
    // Filter out expired banners
    const now = new Date();
    const activeBanners = (data || []).filter((banner: any) => {
      if (!banner.expires_at) return true; // No expiration date = always active
      const expiresAt = new Date(banner.expires_at);
      return expiresAt > now; // Only include if expiration is in the future
    });
    
    return activeBanners.map((banner: any) => ({
      id: banner.id.toString(),
      imageUrl: banner.image_url,
      link: banner.link,
      title: banner.title || '',
      createdAt: banner.created_at,
      expiresAt: banner.expires_at || null,
    }));
  } catch (error) {
    console.error('Error fetching banners (HTTP):', error);
    // Fallback to Supabase client
    return await getBannersFallback();
  }
}

// Fallback function using Supabase client
async function getBannersFallback(): Promise<Banner[]> {
  try {
    // Delete expired banners first (only if expires_at column exists)
    try {
      await deleteExpiredBanners();
    } catch (err) {
      // If expires_at column doesn't exist yet, ignore the error
      console.log('Skipping expired banners deletion (column may not exist yet)');
    }

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false }); // Newest first

    if (error) {
      console.error('Error fetching banners (fallback):', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return [];
    }

    console.log('Fetched banners count (fallback):', data?.length || 0);
    
    // Filter out expired banners
    const now = new Date();
    const activeBanners = (data || []).filter((banner: any) => {
      if (!banner.expires_at) return true; // No expiration date = always active
      const expiresAt = new Date(banner.expires_at);
      return expiresAt > now; // Only include if expiration is in the future
    });
    
    return activeBanners.map((banner: any) => ({
      id: banner.id.toString(),
      imageUrl: banner.image_url,
      link: banner.link,
      title: banner.title || '',
      createdAt: banner.created_at,
      expiresAt: banner.expires_at || null,
    }));
  } catch (error) {
    console.error('Error fetching banners (fallback):', error);
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
      expires_at: banner.expiresAt || null,
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
      expiresAt: data.expires_at || null,
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
        expires_at: banner.expiresAt || null,
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
