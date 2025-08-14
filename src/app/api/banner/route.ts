import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

const BANNER_PREFIX = 'banner-';
const BANNER_DATA_KEY = 'banner-data.json';
const PUBLIC_BASE = (process.env.NEXT_PUBLIC_BLOB_BASE_URL || '').replace(/\/$/, '');
const SERVERS_URL = PUBLIC_BASE ? `${PUBLIC_BASE}/${BANNER_DATA_KEY}` : '';

export async function GET() {
    try {
        if (!SERVERS_URL) return NextResponse.json(null);

        const res = await fetch(SERVERS_URL, { cache: 'no-store' });
        if (!res.ok) return NextResponse.json(null);

        const data = await res.json();
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
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