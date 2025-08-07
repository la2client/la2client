'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {Search, Filter, X, ChevronDown} from 'lucide-react';
import { RATES, CHRONICLES } from '@/lib/types';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                  type="text"
                  placeholder={t('search')}
                  value={search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="pl-10"
              />
          </div>

        {/* Rate Filter */}
          <Select
              value={rate}
              onValueChange={(value) => handleFilterChange({ rate: value })}
          >
              <SelectTrigger className="w-full text-sm md:text-base text-start">
                  <SelectValue placeholder={t('allRates')} />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                  {RATES.map((r) => (
                      <SelectItem key={r} value={r} className="cursor-pointer">
                          {r}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>

        {/* Chronicle Filter */}
          <Select
              value={chronicle}
              onValueChange={(value) => handleFilterChange({ chronicle: value })}
          >
              <SelectTrigger className="w-full text-sm md:text-base text-start">
                  <SelectValue placeholder={t('allChronicles')} />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                  {CHRONICLES.map((c) => (
                      <SelectItem key={c} value={c} className="cursor-pointer">
                          {c}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>

        {/* Reset Button */}
          <Button
              onClick={resetFilters}
              variant="outline"
              className="flex items-center justify-center bg-transparent hover:bg-background"
          >
              <X className="w-4 h-4 mr-2" />
              {t('reset')}
          </Button>
      </div>
    </div>
  );
}