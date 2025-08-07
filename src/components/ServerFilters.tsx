'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Filter, X } from 'lucide-react';
import { RATES, CHRONICLES } from '@/lib/types';

interface ServerFiltersProps {
  onFilterChange: (filters: {
    search: string;
    rate: string;
    chronicle: string;
  }) => void;
}

export default function ServerFilters({ onFilterChange }: ServerFiltersProps) {
  const t = useTranslations('home.filters');
  const [search, setSearch] = useState('');
  const [rate, setRate] = useState('');
  const [chronicle, setChronicle] = useState('');

  const handleFilterChange = (newFilters: Partial<{ search: string; rate: string; chronicle: string }>) => {
    const updatedFilters = {
      search: newFilters.search ?? search,
      rate: newFilters.rate ?? rate,
      chronicle: newFilters.chronicle ?? chronicle,
    };
    
    setSearch(updatedFilters.search);
    setRate(updatedFilters.rate);
    setChronicle(updatedFilters.chronicle);
    
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    handleFilterChange({ search: '', rate: '', chronicle: '' });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-orange-500 mr-2" />
        <h3 className="text-white font-semibold">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Rate Filter */}
        <select
          value={rate}
          onChange={(e) => handleFilterChange({ rate: e.target.value })}
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
        >
          <option value="">{t('allRates')}</option>
          {RATES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Chronicle Filter */}
        <select
          value={chronicle}
          onChange={(e) => handleFilterChange({ chronicle: e.target.value })}
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
        >
          <option value="">{t('allChronicles')}</option>
          {CHRONICLES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg px-4 py-2 text-white transition-colors flex items-center justify-center"
        >
          <X className="w-4 h-4 mr-2" />
          {t('reset')}
        </button>
      </div>
    </div>
  );
}