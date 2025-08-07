import { put, list, del } from '@vercel/blob';
import { Server, WallpaperData, BannerData } from './types';

// Server data storage
export async function getServers(): Promise<Server[]> {
  try {
    const response = await fetch('/api/servers');
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function saveServer(server: Omit<Server, 'id' | 'createdAt'>): Promise<Server> {
  const response = await fetch('/api/servers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(server),
  });
  return await response.json();
}

export async function deleteServer(id: string): Promise<void> {
  await fetch(`/api/servers/${id}`, { method: 'DELETE' });
}

// Wallpaper storage
export async function uploadWallpaper(file: File): Promise<WallpaperData> {
  const response = await fetch('/api/wallpaper', {
    method: 'POST',
    body: file,
  });
  return await response.json();
}

export async function getWallpaper(): Promise<WallpaperData | null> {
  try {
    const response = await fetch('/api/wallpaper');
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Banner storage
export async function uploadBanner(file: File, linkUrl?: string): Promise<BannerData> {
  const formData = new FormData();
  formData.append('file', file);
  if (linkUrl) formData.append('linkUrl', linkUrl);
  
  const response = await fetch('/api/banner', {
    method: 'POST',
    body: formData,
  });
  return await response.json();
}

export async function getBanner(): Promise<BannerData | null> {
  try {
    const response = await fetch('/api/banner');
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}