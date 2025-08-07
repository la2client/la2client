import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

const WALLPAPER_PREFIX = 'wallpaper-';
const WALLPAPER_DATA_KEY = 'wallpaper-data.json';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: WALLPAPER_DATA_KEY });
    if (blobs.length === 0) return NextResponse.json(null);
    
    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Delete old wallpaper
    const { blobs: oldBlobs } = await list({ prefix: WALLPAPER_PREFIX });
    for (const blob of oldBlobs) {
      await del(blob.url);
    }
    
    // Upload new wallpaper
    const filename = `${WALLPAPER_PREFIX}${Date.now()}-${file.name}`;
    const { url } = await put(filename, file, { access: 'public' });
    const linkUrl = formData.get('linkUrl') as string;
    
    // Save wallpaper data
    const wallpaperData = {
      url,
        linkUrl,
      uploadedAt: new Date().toISOString(),
    };
    
    const dataBlob = new Blob([JSON.stringify(wallpaperData)], { type: 'application/json' });
    await put(WALLPAPER_DATA_KEY, dataBlob, { access: 'public' });
    
    return NextResponse.json(wallpaperData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload wallpaper' }, { status: 500 });
  }
}