'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import WallpaperBanner from '@/components/WallpaperBanner';
import { Send, Mail } from 'lucide-react';
import {BannerData, Server, WallpaperData} from "@/lib/types";
import {useEffect, useState} from "react";
import {getBanner, getServers, getWallpaper} from "@/lib/storage";

export default function PlacementPage() {
  const t = useTranslations('placement');
    const [vipServers, setVipServers] = useState<Server[]>([]);
    const [wallpaper, setWallpaper] = useState<WallpaperData | null>(null);
    const [banner, setBanner] = useState<BannerData | null>(null);


  const contactButtons = [
    { icon: Send, label: t('telegram'), href: '#' },
    { icon: Mail, label: t('email'), href: '#' },
  ];

    /* fetch data once */
    useEffect(() => {
        (async () => {
            const servers = await getServers();
            setVipServers(servers.filter(s => s.isVip).slice(0, 20));  // up to 20 vip slots
            setWallpaper(await getWallpaper());
            setBanner(await getBanner());
        })();
    }, []);

    // 1× wallpaper slot
    const wallpaperOption = {
        title: t('websiteWallpaper'),
        subtitle: '1920x600',
        status: wallpaper ? 'busy' : 'free',
        dates: wallpaper?.validUntil ? [wallpaper.validUntil] : [],
    };

    // 1× banner slot
    const bannerOption = {
        title: t('banner'),
        subtitle: '240x400',
        status: banner ? 'busy' : 'free',
        dates: banner?.validUntil ? [banner.validUntil] : [],
    };

    // 20 vip slots
    // summary card for VIP placement
    const vipOption = {
        title   : t('vipPlacement'),
        subtitle: `${vipServers.length} / 20`,
        status  : vipServers.length < 20 ? 'free' : 'busy',
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
      <WallpaperBanner />
      
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

                {option.dates.length > 0 && (
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
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}