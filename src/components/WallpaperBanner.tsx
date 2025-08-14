'use client';

import { WallpaperData } from '@/lib/types';
import Image from 'next/image';
import {usePathname as useI18nPathname} from "@/i18n/navigation";
import {useBlobJson} from "@/hooks/useBlobJson";

export default function WallpaperBanner() {
    const { data: wallpaper, loading: wLoading } = useBlobJson<WallpaperData>('/wallpaper-data.json');
    const pathname = useI18nPathname();

  // if (loading) {
  //   return (
  //     <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
  //       <div className="animate-pulse text-gray-400">Loading...</div>
  //     </div>
  //   );
  // }

    if (pathname?.includes('/admin')) return null;

  if (!wallpaper || wLoading) {
      return (
          <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden" />
      );

  }

const Wallpaper = () => (
    <div className="relative w-screen max-w-none aspect-[1920/600] rounded-xl overflow-hidden">
      <Image
        src={wallpaper.url}
        alt="Website Wallpaper"
        fill
        className="object-contain"
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