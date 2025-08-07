// import { NextRequest, NextResponse } from 'next/server';
// import { put, list } from '@vercel/blob';
// import { Server } from '@/lib/types';
//
// const SERVERS_BLOB_KEY = 'servers.json';
//
// async function getServersFromBlob(): Promise<Server[]> {
//   try {
//     const { blobs } = await list({ prefix: SERVERS_BLOB_KEY });
//     if (blobs.length === 0) return [];
//
//     const response = await fetch(blobs[0].url);
//     return await response.json();
//   } catch {
//     return [];
//   }
// }
//
// async function saveServersToBlob(servers: Server[]): Promise<void> {
//   const blob = new Blob([JSON.stringify(servers, null, 2)], { type: 'application/json' });
//   await put(SERVERS_BLOB_KEY, blob, { access: 'public' });
// }
//
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const servers = await getServersFromBlob();
//     const filteredServers = servers.filter(server => server.id !== params.id);
//     await saveServersToBlob(filteredServers);
//
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to delete server' }, { status: 500 });
//   }
// }