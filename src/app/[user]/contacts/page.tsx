'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import WallpaperBanner from '@/components/WallpaperBanner';
import { Users, Send, Mail, MessageSquare } from 'lucide-react';

export default function ContactsPage() {
  const t = useTranslations('footer');

  const contacts = [
    { icon: Users, label: t('teams'), href: '#' },
    { icon: Send, label: t('telegram'), href: '#' },
    { icon: Mail, label: t('email'), href: '#' },
    { icon: MessageSquare, label: t('feedbackForm'), href: '#' },
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
          <h1 className="text-4xl font-bold text-white mb-8">CONTACTS</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {contacts.map((contact, index) => (
              <motion.a
                key={index}
                href={contact.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-8 text-center transition-colors border border-gray-700 group"
              >
                <contact.icon className="w-12 h-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors" />
                <p className="text-gray-300 group-hover:text-white font-medium transition-colors">
                  {contact.label}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}