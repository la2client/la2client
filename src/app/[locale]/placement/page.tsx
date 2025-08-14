'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import {BannerData, Server, WallpaperData} from "@/lib/types";
import { useMemo} from "react";
import {useBlobJson} from "@/hooks/useBlobJson";

export default function PlacementPage() {
  const t = useTranslations('placement');
    const { data: servers, loading: sLoading } = useBlobJson<Server[]>('/servers.json');
    const { data: wallpaper, loading: wLoading } = useBlobJson<WallpaperData>('/wallpaper-data.json');
    const { data: banner, loading: bLoading } = useBlobJson<BannerData>('/banner-data.json');
    const vipServersCount = useMemo(() => {
        if (!Array.isArray(servers)) return 0;
        return servers.filter((s) => !!(s as any).isVip).slice(0, 20).length;
    }, [servers]);

    // Helpers to evaluate date availability
    const now = new Date();
    // Parse 'YYYY-MM-DD' as local date and consider it available through the end of that day
    const isActiveUntil = (isoDate?: string) => {
        if (!isoDate) return false;
        const parts = isoDate.split('-').map(Number);
        if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return false;
        const [y, m, d] = parts as [number, number, number];
        const endOfDay = new Date(y, m - 1, d, 23, 59, 59, 999);
        return now <= endOfDay;
    };

    const contactButtons = [
    { icon: Send, label: t('telegram'), href: '#' },
    { icon: Mail, label: t('email'), href: '#' },
  ];

    // 1× wallpaper slot
    const wallpaperOption = {
        title: t('websiteWallpaper'),
        subtitle: '1920x600',
        status: isActiveUntil(wallpaper?.validUntil) ? 'busy' : 'free',
        dates: wallpaper?.validUntil ? [wallpaper.validUntil] : [],
    };

    // 1× banner slot
    const bannerOption = {
        title: t('banner'),
        subtitle: '240x400',
        status: isActiveUntil(banner?.validUntil) ? 'busy' : 'free',
        dates: banner?.validUntil ? [banner.validUntil] : [],
    };

    // 20 vip slots
    // summary card for VIP placement
    const vipOption = {
        title   : t('vipPlacement'),
        subtitle: `${vipServersCount} / 20`,
        status  : vipServersCount < 20 ? 'free' : 'busy',
        dates   : [],
    };

    const freePlacement = {
        title: t('usualPlacement'),
        subtitle: '',
        status: 'free',
        dates: []
    }

    const placementOptions = [vipOption, wallpaperOption, bannerOption, freePlacement];


  return (
    <div className="min-h-screen bg-gray-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-8">{t('placementHeader')}</h1>
          
          {/* Contact Section */}
          <div className="mb-12">
            <h2 className="text-white text-lg mb-4">{t('enterChat')}</h2>
            <div className="flex flex-wrap gap-4">
              {contactButtons.map((button, index) => (
                <motion.a
                  key={index}
                  href={button.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <button.icon className="w-5 h-5" />
                  <span>{button.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Placement Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {placementOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-white font-bold text-xl mb-2">{option.title}</h3>
                  <p className="text-gray-400 mb-4">{option.subtitle}</p>
                
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                      option.status === 'busy'
                        ? 'bg-red-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {option.status === 'busy' ? t('busy') : t('free')}
                  </span>
                </div>

                  {option.status === 'free' ? (
                      <p className="text-gray-400 text-sm">{t('freePlacement')}</p>
                  ) : (
                      option.dates.length > 0 && (
                          <div>
                              <p className="text-gray-400 text-sm mb-2">{t('placementFreeFrom')}:</p>
                              <div className="space-y-1">
                                  {option.dates.map((date, dateIndex) => (
                                      <p key={dateIndex} className="text-gray-300 text-sm">
                                          {date}
                                      </p>
                                  ))}
                              </div>
                          </div>
                      )
                  )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}