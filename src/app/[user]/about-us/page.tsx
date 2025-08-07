'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import WallpaperBanner from '@/components/WallpaperBanner';
import { Users, Send, Mail, MessageSquare } from 'lucide-react';

export default function AboutUsPage() {
  const t = useTranslations('about');

  const stats = [
    {
      number: t('stats.years'),
      title: t('stats.yearsDesc'),
    },
    {
      number: t('stats.users'),
      title: t('stats.usersDesc'),
    },
    {
      number: t('stats.servers'),
      title: t('stats.serversDesc'),
    },
  ];

  const contacts = [
    { icon: Users, label: 'Teams' },
    { icon: Send, label: 'Telegram' },
    { icon: Mail, label: 'Email' },
    { icon: MessageSquare, label: 'Feedback Form' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <WallpaperBanner />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>
          
          <div className="space-y-8">
            {/* Welcome Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{t('welcome')}</h2>
              <p className="text-gray-300 leading-relaxed">
                {t('description')}
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700"
                >
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    {stat.number}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {stat.title}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Cooperation Section */}
            <div>
              <p className="text-gray-300 leading-relaxed">
                {t('cooperation')}
              </p>
            </div>

            {/* Mission Section */}
            <div>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('mission')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('goal')}
              </p>
            </div>

            {/* Contacts Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6">{t('contacts')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contacts.map((contact, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-colors border border-gray-700 group"
                  >
                    <contact.icon className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-3 transition-colors" />
                    <p className="text-gray-300 group-hover:text-white text-sm transition-colors">
                      {contact.label}
                    </p>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}