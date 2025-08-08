import { NextRequest, NextResponse } from 'next/server';
import {saveServersToBlob, getServersFromBlob} from "@/app/api/servers/route";

// const SERVERS_BLOB_KEY = 'servers.json';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
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