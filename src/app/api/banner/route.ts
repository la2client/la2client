import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

const BANNER_PREFIX = 'banner-';
const BANNER_DATA_KEY = 'banner-data.json';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BANNER_DATA_KEY });
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
    const linkUrl = formData.get('linkUrl') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Delete old banner
    const { blobs: oldBlobs } = await list({ prefix: BANNER_PREFIX });
    for (const blob of oldBlobs) {
      await del(blob.url);
    }
    
    // Upload new banner
    const filename = `${BANNER_PREFIX}${Date.now()}-${file.name}`;
    const { url } = await put(filename, file, { access: 'public' });
    
    // Save banner data
    const bannerData = {
      url,
      linkUrl: linkUrl || undefined,
      uploadedAt: new Date().toISOString(),
    };
    
    const dataBlob = new Blob([JSON.stringify(bannerData)], { type: 'application/json' });
    await put(BANNER_DATA_KEY, dataBlob, { access: 'public' });
    
    return NextResponse.json(bannerData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload banner' }, { status: 500 });
  }
}