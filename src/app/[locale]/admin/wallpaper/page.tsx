'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Upload, Image as ImageIcon, ExternalLink} from 'lucide-react';
import {uploadWallpaper, getWallpaper, deleteWallpaper} from '@/lib/storage';
import { WallpaperData } from '@/lib/types';
import Image from 'next/image';
import {Button} from "@/components/ui/button";
import {useBlobJson} from "@/hooks/useBlobJson";

export default function AdminWallpaperPage() {
    const {
        data: wallpaper,
        loading: wLoading,
        error: wError,
        mutate,
        revalidate
    } = useBlobJson<WallpaperData | null>('/wallpaper-data.json');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
      if (wallpaper?.linkUrl) setLinkUrl(wallpaper.linkUrl);
      else setLinkUrl('');
      if (wallpaper?.validUntil) setValidUntil(wallpaper.validUntil.slice(0, 10));
      else setValidUntil('');
  }, [wallpaper]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSelectedFile(e.target.files?.[0] ?? null);

    const handleSave = async () => {
        setUploading(true); setMessage('');
        try {
            const saved = await uploadWallpaper(selectedFile, linkUrl.trim(), validUntil);
            await revalidate();
            mutate(saved);
            setSelectedFile(null);
            setMessage('Wallpaper saved successfully!');
        } catch { setMessage('Failed to save.'); }
        finally { setUploading(false); }
    };

    const handleDelete = async () => {
        if (!confirm('Delete current wallpaper?')) return;
        try {
            await deleteWallpaper();
            await revalidate();
            mutate(null); setLinkUrl(''); setValidUntil(''); setSelectedFile(null);
        } catch { setMessage('Failed to delete.'); }
    };

  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //
  //   setUploading(true);
  //   setMessage('');
  //
  //   try {
  //     const newWallpaper = await uploadWallpaper(file, linkUrl);
  //     setWallpaper(newWallpaper);
  //     setMessage('Wallpaper uploaded successfully!');
  //   } catch (error) {
  //     setMessage('Failed to upload wallpaper. Please try again.');
  //     console.error('Upload error:', error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  if (wLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="animate-pulse text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Manage Wallpaper</h1>

        {/* Current Wallpaper */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Current Wallpaper</h2>
          {wallpaper ? (
            <div className="space-y-4">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={wallpaper.url}
                  alt="Current Wallpaper"
                  fill
                  className="object-cover"
                />
              </div>
                <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">
                        Uploaded: {new Date(wallpaper.uploadedAt).toLocaleString()}
                    </p>
                    {wallpaper.linkUrl && (
                        <a
                            href={wallpaper.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-orange-500 hover:text-orange-400 text-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Link</span>
                        </a>
                    )}
                </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">No wallpaper uploaded</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload New Wallpaper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold text-white mb-4">Upload New Wallpaper</h2>
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                      Link URL (Optional)
                  </label>
                  <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                      Valid until (Optional)
                  </label>
                  <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  />
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Image File (Recommended: 1920x600px)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              />
            </div>

            {uploading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                <span className="text-gray-400">Uploading...</span>
              </div>
            )}

            {message && (
              <div className={`p-3 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                {message}
              </div>
            )}

            <div className="text-sm text-gray-400">
              <p>• Supported formats: JPG, PNG, WebP</p>
              <p>• Recommended size: 1920x600px</p>
              <p>• Maximum file size: 10MB</p>
            </div>
          </div>

            <div className="flex justify-between gap-4 mt-6">
                <Button onClick={handleSave} className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition-colors">
                    <Upload className="w-4 h-4 mr-2" /> Save
                </Button>
                {wallpaper && (
                    <Button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white transition-colors rounded-lg hover:bg-red-700">
                        Delete
                    </Button>
                )}
            </div>
        </motion.div>
      </div>
    </div>
  );
}