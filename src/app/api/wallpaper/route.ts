import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

const WALLPAPER_PREFIX = 'wallpaper-';
const WALLPAPER_DATA_KEY = 'wallpaper-data.json';
const PUBLIC_BASE = (process.env.NEXT_PUBLIC_BLOB_BASE_URL || '').replace(/\/$/, '');
const SERVERS_URL = PUBLIC_BASE ? `${PUBLIC_BASE}/${WALLPAPER_DATA_KEY}` : '';

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

        /* ---- 1. Load existing metadata (if any) ------------------------ */
        let existing: any = null;
        {
            const { blobs } = await list({ prefix: WALLPAPER_DATA_KEY });
            if (blobs.length) {
                const resp = await fetch(blobs[0].url);
                existing = await resp.json();
            }
        }

        /* ---- 2. Decide which image URL to use -------------------------- */
        let url = existing?.url ?? '';          // default to old URL if present
        if (file && file.size) {
            // delete old image files
            const { blobs: old } = await list({ prefix: WALLPAPER_PREFIX });
            await Promise.all(old.map(b => del(b.pathname)));

            // upload new wallpaper
            const filename = `${WALLPAPER_PREFIX}${Date.now()}-${file.name}`;
            ({ url } = await put(filename, file, { access: 'public' }));
        }

        /* ---- 3. Build the new metadata object -------------------------- */
        const wallpaperData = {
            url,
            linkUrl:    linkUrl    ?? existing?.linkUrl    ?? undefined,
            validUntil: validUntil ?? existing?.validUntil ?? undefined,
            uploadedAt: new Date().toISOString(),
        };

        /* ---- 4. Save JSON manifest ------------------------------------- */
        // delete old manifest
        const { blobs: meta } = await list({ prefix: WALLPAPER_DATA_KEY });
        await Promise.all(meta.map(b => del(b.pathname)));

        const blob = new Blob([JSON.stringify(wallpaperData)], { type: 'application/json' });
        await put(WALLPAPER_DATA_KEY, blob, { access: 'public' });

        return NextResponse.json(wallpaperData);
    } catch (err) {
        console.error('Wallpaper POST failed:', err);
        return NextResponse.json({ error: 'Failed to upload wallpaper' }, { status: 500 });
    }
}

export async function DELETE() {
    await Promise.all([
        list({ prefix: WALLPAPER_PREFIX }).then(r => Promise.all(r.blobs.map(b => del(b.pathname)))),
        list({ prefix: WALLPAPER_DATA_KEY }).then(r => Promise.all(r.blobs.map(b => del(b.pathname)))),
    ]);
    return NextResponse.json({ success: true });
}