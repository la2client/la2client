import { NextRequest, NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';
import { Server } from '@/lib/types';
import {randomUUID} from "node:crypto";

const SERVERS_BLOB_KEY = 'servers.json';

async function getServersFromBlob(): Promise<Server[]> {
  try {
    const { blobs } = await list({ prefix: SERVERS_BLOB_KEY });
    if (blobs.length === 0) return [];
    
    const response = await fetch(blobs[0].url);
    return await response.json();
  } catch {
    return [];
  }
}

async function saveServersToBlob(servers: Server[]): Promise<void> {
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