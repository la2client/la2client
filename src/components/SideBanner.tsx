'use client';

import { useEffect, useState } from 'react';
import { getBanner } from '@/lib/storage';
import { BannerData } from '@/lib/types';
import Image from 'next/image';

export default function SideBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const data = await getBanner();
        setBanner(data);
      } catch (error) {
        console.error('Failed to load banner:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-6 h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading banner...</div>
      </div>
    );
  }

  if (!banner) {
      return null
    // return (
    //   <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 mb-6 h-64 flex items-center justify-center border border-gray-700">
    //     <div className="text-center">
    //       <h3 className="text-white font-bold text-lg mb-2">LINEAGE II</h3>
    //       <p className="text-orange-500 text-sm mb-4">MAIN SUPERION PATCH</p>
    //       <p className="text-gray-400 text-xs">RATES: X2</p>
    //       <div className="mt-4">
    //         <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
    //           GRAND OPENING
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // );
  }

  const BannerContent = () => (
    <div className="relative h-64 rounded-lg overflow-hidden">
      <Image
        src={banner.url}
        alt="Side Banner"
        fill
        className="object-cover"
      />
    </div>
  );

  if (banner.linkUrl) {
    return (
      <div className="mb-6">
        <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
          <BannerContent />
        </a>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <BannerContent />
    </div>
  );
}