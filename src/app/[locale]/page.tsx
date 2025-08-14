'use client';

import {useState, useEffect, useMemo} from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ServerFilters from '@/components/ServerFilters';
import ServerCard from '@/components/ServerCard';
import SideBanner from '@/components/SideBanner';
import { Server } from '@/lib/types';
import {useBlobJson} from "@/hooks/useBlobJson";

export default function HomePage() {
  const t = useTranslations('home');
  const { data: servers, loading: sLoading, error: sError, revalidate } = useBlobJson<Server[]>('/servers.json');
  const [allServers, setAllServers] = useState<Server[]>([]);
    const [filters, setFilters] = useState<{ search: string; rate: string; chronicle: string }>({
        search: '',
        rate: '',
        chronicle: '',
    });


    // when servers load/update, sync to local state
    useEffect(() => {
        if (Array.isArray(servers)) {
            setAllServers(servers);
        }
    }, [servers]);

    // apply filters whenever allServers or filters change
    const filteredServers = useMemo(() => {
        let list = allServers;
        if (filters.search) {
            const q = filters.search.toLowerCase();
            list = list.filter((s) => s.name?.toLowerCase().includes(q));
        }
        if (filters.rate) {
            list = list.filter((s) => String(s.rate) === String(filters.rate));
        }
        if (filters.chronicle) {
            list = list.filter((s) => String(s.chronicle) === String(filters.chronicle));
        }
        return list;
    }, [allServers, filters]);


  const handleFilterChange = (next: { search: string; rate: string; chronicle: string }) => {
      setFilters(next);
  };

    const sortByVipThenDate = (arr: Server[], dir: 'asc' | 'desc' = 'asc') =>
        arr.slice().sort((a, b) => {
            const av = !!a.isVip ? 1 : 0;
            const bv = !!b.isVip ? 1 : 0;
            if (av !== bv) return bv - av; // VIPs first
            const ad = toDate(a.openingDate as any)?.getTime() ?? 0;
            const bd = toDate(b.openingDate as any)?.getTime() ?? 0;
            return dir === 'asc' ? ad - bd : bd - ad;
        });


    // helper: safe date parse
    const toDate = (d: string | number | Date) => {
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? null : dt;
    };

    const categories = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(startOfToday);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const weekFromNow = new Date(now);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const byDate = (cmp: (d: Date) => boolean) =>
            filteredServers.filter((s) => {
                const d = toDate(s.openingDate as any);
                return !!(d && cmp(d));
            });
        return {
            comingSoon: sortByVipThenDate(byDate((d) => d > now), 'asc'),
            alreadyOpened: sortByVipThenDate(byDate((d) => d <= now), 'asc'),
            tomorrow: sortByVipThenDate(
                filteredServers.filter((s) => {
                    const d = toDate(s.openingDate as any);
                    return !!(
                        d && d.getFullYear() === tomorrow.getFullYear() &&
                        d.getMonth() === tomorrow.getMonth() &&
                        d.getDate() === tomorrow.getDate()
                    );
            }),
                'asc'
            ),
            previous7Days: sortByVipThenDate(byDate((d) => d <= now && d >= weekAgo), 'asc'),
            next7Days: sortByVipThenDate(byDate((d) => d > now && d <= weekFromNow), 'asc'),
            weekAgoAndMore: sortByVipThenDate(byDate((d) => d < weekAgo), 'asc'),
            afterWeekAndMore: sortByVipThenDate(byDate((d) => d > weekFromNow), 'asc'),
        } as const;
    }, [filteredServers]);


  // const categorizeServers = () => {
  //
  //   return {
  //     comingSoon: filteredServers.filter(server => new Date(server.openingDate) > now),
  //     alreadyOpened: filteredServers.filter(server => new Date(server.openingDate) <= now),
  //     tomorrow: filteredServers.filter(server => {
  //       const openDate = new Date(server.openingDate);
  //       return openDate.toDateString() === tomorrow.toDateString();
  //     }),
  //     previous7Days: filteredServers.filter(server => {
  //       const openDate = new Date(server.openingDate);
  //       return openDate <= now && openDate >= weekAgo;
  //     }),
  //     next7Days: filteredServers.filter(server => {
  //       const openDate = new Date(server.openingDate);
  //       return openDate > now && openDate <= weekFromNow;
  //     }),
  //     weekAgoAndMore: filteredServers.filter(server => new Date(server.openingDate) < weekAgo),
  //     afterWeekAndMore: filteredServers.filter(server => new Date(server.openingDate) > weekFromNow),
  //   };
  // };

  // const categories = categorizeServers();

  if (sLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse text-center text-gray-400">Loading servers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">

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
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
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
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
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
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
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
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
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
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}