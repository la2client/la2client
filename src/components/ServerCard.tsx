'use client';

import { Server } from '@/lib/types';
import { motion } from 'framer-motion';
import { ExternalLink, Crown, Star } from 'lucide-react';

interface ServerCardProps {
  server: Server;
  index: number;
}

export default function ServerCard({ server, index }: ServerCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gray-800 rounded-lg p-4 border transition-all duration-200 hover:border-orange-500 ${
        server.isVip ? 'border-orange-500 bg-gradient-to-r from-gray-800 to-orange-900/20' : 'border-gray-600'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {server.isVip && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-sm text-xs font-bold flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              VIP
            </div>
          )}
          <h3 className="text-white font-semibold text-base">{server.name}</h3>
        </div>
        <a
          href={server.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-orange-500 transition-colors flex-shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-orange-500 font-medium">{server.rate}</span>
        </div>
        <div>
          <span className="text-white font-medium">{server.chronicle}</span>
        </div>
        <div className="text-right">
          <span className="text-gray-300 font-medium">{formatDate(server.openingDate)}</span>
        </div>
      </div>
    </motion.div>
  );
}