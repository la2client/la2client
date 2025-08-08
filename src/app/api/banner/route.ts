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
      const form = await request.formData();
      const file       = form.get('file')       as File   | null;
      const linkUrl    = form.get('linkUrl')    as string | null;
      const validUntil = form.get('validUntil') as string | null;

      /* 1. Load existing metadata (if any) */
      let existing: any = null;
      {
          const {blobs} = await list({prefix: BANNER_DATA_KEY});
          if (blobs.length) {
              const resp = await fetch(blobs[0].url);
              existing = await resp.json();
          }
      }

      /* 2. Decide which image URL to use */
      let url = existing?.url ?? '';
      if (file && file.size) {
          // delete old banner images
          const {blobs: oldFiles} = await list({prefix: BANNER_PREFIX});
          await Promise.all(oldFiles.map(b => del(b.pathname)));

          const filename = `${BANNER_PREFIX}${Date.now()}-${file.name}`;
          ({url} = await put(filename, file, {access: 'public'}));
      }

    // Save banner data
    const bannerData = {
        url,
        linkUrl:    linkUrl    ?? existing?.linkUrl    ?? undefined,
        validUntil: validUntil ?? existing?.validUntil ?? undefined,
        uploadedAt: new Date().toISOString(),
    };

      /* 4. Save manifest */
      const { blobs: manifests } = await list({ prefix: BANNER_DATA_KEY });
      await Promise.all(manifests.map(b => del(b.pathname)));

      const blob = new Blob([JSON.stringify(bannerData)], { type: 'application/json' });
      await put(BANNER_DATA_KEY, blob, { access: 'public' });

    return NextResponse.json(bannerData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload banner' }, { status: 500 });
  }
}


export async function DELETE() {
    try {
        await Promise.all([
            list({ prefix: BANNER_PREFIX }).then(r => Promise.all(r.blobs.map(b => del(b.pathname)))),
            list({ prefix: BANNER_DATA_KEY }).then(r => Promise.all(r.blobs.map(b => del(b.pathname)))),
        ]);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }
}