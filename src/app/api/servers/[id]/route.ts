import { NextRequest, NextResponse } from 'next/server';
import {Server} from "@/lib/types";
import {del, list, put} from "@vercel/blob";

const SERVERS_BLOB_KEY = 'servers.json';
const PUBLIC_BASE = (process.env.NEXT_PUBLIC_BLOB_BASE_URL || '').replace(/\/$/, '');
const SERVERS_URL = PUBLIC_BASE ? `${PUBLIC_BASE}/${SERVERS_BLOB_KEY}` : '';

async function getServersFromBlob(): Promise<Server[]> {
    if (!SERVERS_URL) return [];
    try {
        // Read directly from the stable public URL; avoid advanced ops
        const res = await fetch(SERVERS_URL, { cache: 'no-store' });
        if (!res.ok) return [];
        const json = (await res.json()) as unknown;
        return Array.isArray(json) ? (json as Server[]) : [];
    } catch {
        return [];
    }
}

async function saveServersToBlob(servers: Server[]): Promise<void> {
    const { blobs } = await list({ prefix: SERVERS_BLOB_KEY });
    await Promise.all(blobs.map((b) => del(b.pathname)));

    const blob = new Blob([JSON.stringify(servers, null, 2)], { type: 'application/json' });
    await put(SERVERS_BLOB_KEY, blob, { access: 'public' });
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const servers = await getServersFromBlob();
        const filteredServers = servers.filter((s) => s.id !== params.id);

        // optional 404 if id wasn’t found
        if (filteredServers.length === servers.length) {
            return NextResponse.json({ error: 'Server not found' }, { status: 404 });
        }

        await saveServersToBlob(filteredServers);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/servers/[id] failed:', error);
        return NextResponse.json(
            { error: 'Failed to delete server' },
            { status: 500 },
        );
    }
}