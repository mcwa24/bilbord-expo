import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { banners } = body;

    if (!Array.isArray(banners)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Update positions for all banners
    const updatePromises = banners.map(async ({ id, position }: { id: string; position: number }) => {
      const { error } = await supabase
        .from('banners')
        .update({ position })
        .eq('id', parseInt(id));
      
      if (error) {
        console.error(`Error updating banner ${id}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error reordering banners:', error);
    return NextResponse.json(
      { error: 'Failed to reorder banners' },
      { status: 500 }
    );
  }
}

