'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import WallpaperBanner from '@/components/WallpaperBanner';
import ServerFilters from '@/components/ServerFilters';
import ServerCard from '@/components/ServerCard';
import SideBanner from '@/components/SideBanner';
import { Server } from '@/lib/types';
import { getServers } from '@/lib/storage';

export default function HomePage() {
  const t = useTranslations('home');
  const [servers, setServers] = useState<Server[]>([]);
  const [filteredServers, setFilteredServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServers = async () => {
      try {
        const data = await getServers();
        setServers(data);
        setFilteredServers(data);
      } catch (error) {
        console.error('Failed to load servers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServers();
  }, []);

  const handleFilterChange = (filters: { search: string; rate: string; chronicle: string }) => {
    let filtered = servers;

    if (filters.search) {
      filtered = filtered.filter(server =>
        server.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.rate) {
      filtered = filtered.filter(server => server.rate === filters.rate);
    }

    if (filters.chronicle) {
      filtered = filtered.filter(server => server.chronicle === filters.chronicle);
    }

    setFilteredServers(filtered);
  };

  const categorizeServers = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekFromNow = new Date(now);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      comingSoon: filteredServers.filter(server => new Date(server.openingDate) > now),
      alreadyOpened: filteredServers.filter(server => new Date(server.openingDate) <= now),
      tomorrow: filteredServers.filter(server => {
        const openDate = new Date(server.openingDate);
        return openDate.toDateString() === tomorrow.toDateString();
      }),
      previous7Days: filteredServers.filter(server => {
        const openDate = new Date(server.openingDate);
        return openDate <= now && openDate >= weekAgo;
      }),
      next7Days: filteredServers.filter(server => {
        const openDate = new Date(server.openingDate);
        return openDate > now && openDate <= weekFromNow;
      }),
      weekAgoAndMore: filteredServers.filter(server => new Date(server.openingDate) < weekAgo),
      afterWeekAndMore: filteredServers.filter(server => new Date(server.openingDate) > weekFromNow),
    };
  };

  const categories = categorizeServers();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <WallpaperBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse text-center text-gray-400">Loading servers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <WallpaperBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">{t('title')}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ServerFilters onFilterChange={handleFilterChange} />

            {/* Coming Soon Servers */}
            {categories.comingSoon.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center bg-gray-800 p-4 rounded-lg">
                  📅 {t('comingSoon')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.comingSoon.map((server, index) => (
                    <ServerCard key={server.id} server={server} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Already Opened Servers */}
            {categories.alreadyOpened.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center bg-gray-800 p-4 rounded-lg">
                  ✅ {t('alreadyOpened')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.alreadyOpened.map((server, index) => (
                    <ServerCard key={server.id} server={server} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Tomorrow */}
            {categories.tomorrow.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center bg-gray-800 p-4 rounded-lg">
                  🌅 {t('tomorrow')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.tomorrow.map((server, index) => (
                    <ServerCard key={server.id} server={server} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Previous 7 Days */}
            {categories.previous7Days.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center bg-gray-800 p-4 rounded-lg">
                  📊 {t('previous7Days')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.previous7Days.map((server, index) => (
                    <ServerCard key={server.id} server={server} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Next 7 Days */}
            {categories.next7Days.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                  📈 {t('next7Days')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.next7Days.map((server, index) => (
                    <ServerCard key={server.id} server={server} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Week Ago and More */}
            {categories.weekAgoAndMore.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  📉 {t('weekAgoAndMore')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.weekAgoAndMore.map((server, index) => (
                    <ServerCard key={server.id} server={server} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* After Week and More */}
            {categories.afterWeekAndMore.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  🚀 {t('afterWeekAndMore')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.afterWeekAndMore.map((server, index) => (
                    <ServerCard key={server.id} server={server} index={index} />
                  ))}
                </div>
              </motion.section>
            )}

            {filteredServers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No servers found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SideBanner />
            
            {/* Rate Categories */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">{t('rates.topL2Servers')}</h3>
              <div className="space-y-2">
                <button className="block w-full text-left text-gray-300 hover:text-orange-500 py-1">
                  {t('rates.lowRate')}
                </button>
                <button className="block w-full text-left text-gray-300 hover:text-orange-500 py-1">
                  {t('rates.pvpServers')}
                </button>
                <button className="block w-full text-left text-gray-300 hover:text-orange-500 py-1">
                  {t('rates.gve')}
                </button>
                <button className="block w-full text-left text-gray-300 hover:text-orange-500 py-1">
                  {t('rates.multiskill')}
                </button>
                <button className="block w-full text-left text-gray-300 hover:text-orange-500 py-1">
                  {t('rates.international')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}