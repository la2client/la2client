'use client';

import { BannerData } from '@/lib/types';
import Image from 'next/image';
import {useBlobJson} from "@/hooks/useBlobJson";

export default function SideBanner() {
    const { data: banner, loading: bLoading } = useBlobJson<BannerData>('/banner-data.json');

  // if (loading) {
  //   return (
  //     <div className="bg-gray-800 rounded-lg p-4 mb-6 h-64 flex items-center justify-center">
  //       <div className="animate-pulse text-gray-400">Loading banner...</div>
  //     </div>
  //   );
  // }

  if (!banner || bLoading) {
      return null
  }

  const BannerContent = () => (
    <div className="relative w-full m-auto aspect-[240/400] h-72 lg:h-64 lg:m-0">
      <Image
        src={banner.url}
        alt="Side Banner"
        fill
        className="object-contain"
      />
    </div>
  );

  if (banner.linkUrl) {
    return (
      <div className="lg:mb-6">
        <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
          <BannerContent />
        </a>
      </div>
    );
  }

  return (
    <div className="lg:mb-6">
      <BannerContent />
    </div>
  );
}