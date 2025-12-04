import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { positions } = body;

    if (!positions || !Array.isArray(positions)) {
      return NextResponse.json(
        { error: 'Positions array is required' },
        { status: 400 }
      );
    }

    // Update each banner's position
    const updatePromises = positions.map(async ({ id, position }: { id: string; position: number }) => {
      const bannerId = parseInt(id) || id;
      const { error } = await supabase
        .from('banners')
        .update({ position })
        .eq('id', bannerId);
      
      if (error) {
        console.error(`Error updating banner ${bannerId}:`, error);
        throw error;
      }
      
      return { id: bannerId, position };
    });

    const results = await Promise.all(updatePromises);
    console.log('Successfully updated positions:', results);

    // Verify the updates by fetching the updated banners
    const verifyPromises = positions.map(async ({ id }: { id: string; position: number }) => {
      const bannerId = parseInt(id) || id;
      const { data, error } = await supabase
        .from('banners')
        .select('id, position')
        .eq('id', bannerId)
        .single();
      
      if (error) {
        console.error(`Error verifying banner ${bannerId}:`, error);
        return null;
      }
      return data;
    });

    const verified = await Promise.all(verifyPromises);
    console.log('Verified positions:', verified);

    return NextResponse.json({ success: true, updated: results.length, verified });
  } catch (error) {
    console.error('Error reordering banners:', error);
    return NextResponse.json(
      { error: 'Failed to reorder banners' },
      { status: 500 }
    );
  }
}

