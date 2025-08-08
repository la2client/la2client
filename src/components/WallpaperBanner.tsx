'use client';

import { useEffect, useState } from 'react';
import { getWallpaper } from '@/lib/storage';
import { WallpaperData } from '@/lib/types';
import Image from 'next/image';
import {usePathname as useI18nPathname} from "@/i18n/navigation";

export default function WallpaperBanner() {
  const [wallpaper, setWallpaper] = useState<WallpaperData | null>(null);
  // const [loading, setLoading] = useState(true);
    const pathname = useI18nPathname();

  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        const data = await getWallpaper();
        setWallpaper(data);
      } catch (error) {
        console.error('Failed to load wallpaper:', error);
      } finally {
      }
    };

    loadWallpaper();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
  //       <div className="animate-pulse text-gray-400">Loading...</div>
  //     </div>
  //   );
  // }

    if (pathname?.includes('/admin')) return null;

  if (!wallpaper) {
      return null
    // return (
    //   <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 flex items-center justify-center">
    //     <div className="text-center">
    //       <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
    //         ⚔️ IS NOW OPEN!
    //       </h2>
    //       <p className="text-xl md:text-2xl text-orange-500 mb-6">
    //         Summer of Nornil x25
    //       </p>
    //       <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
    //         PLAY NOW!
    //       </button>
    //     </div>
    //   </div>
    // );
  }

const Wallpaper = () => (
    <div className="relative w-screen max-w-none aspect-[1920/600]">
      <Image
        src={wallpaper.url}
        alt="Website Wallpaper"
        fill
        className="object-cover"
        priority
      />
    </div>
)

    if (wallpaper.linkUrl) {
        return (
            <div>
                <a href={wallpaper.linkUrl} target="_blank" rel="noopener noreferrer">
                    <Wallpaper />
                </a>
            </div>
        );
    }

    return (
        <div>
            <Wallpaper />
        </div>
    );
}