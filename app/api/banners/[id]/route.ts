import { NextRequest, NextResponse } from 'next/server';
import { deleteBanner, getBanners, updateBanner } from '@/lib/storage';
import { Banner } from '@/types/banner';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { imageUrl, link, title } = body;

    if (!imageUrl || !link) {
      return NextResponse.json(
        { error: 'Image URL and link are required' },
        { status: 400 }
      );
    }

    const banner: Banner = {
      id,
      imageUrl,
      link,
      title: title || '',
      createdAt: new Date().toISOString(),
    };

    await updateBanner(id, banner);

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteBanner(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
