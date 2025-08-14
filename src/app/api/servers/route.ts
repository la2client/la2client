import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { Server } from '@/lib/types';
import {randomUUID} from "node:crypto";

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

export async function GET() {
    try {
        const servers = await getServersFromBlob();
        // Sort VIP servers first, then by opening date
        const sortedServers = servers.sort((a, b) => {
            if (a.isVip && !b.isVip) return -1;
            if (!a.isVip && b.isVip) return 1;
            return new Date(a.openingDate).getTime() - new Date(b.openingDate).getTime();
        });
        return NextResponse.json(sortedServers);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const serverData = await request.json();
        const servers = await getServersFromBlob();

        const newServer: Server = {
            id: randomUUID(),
            createdAt: new Date().toISOString(),
            ...serverData,
        };

        servers.push(newServer);
        await saveServersToBlob(servers);

        return NextResponse.json(newServer);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create server' }, { status: 500 });
    }
}