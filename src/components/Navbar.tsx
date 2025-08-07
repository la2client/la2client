'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';

interface NavbarProps {
  locale: string;
  onLocaleChange: (locale: string) => void;
}

export default function Navbar({ locale, onLocaleChange }: NavbarProps) {
  const t = useTranslations('nav');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/home', label: t('home') },
    { href: '/placement', label: t('placement') },
    { href: '/faq', label: t('faq') },
    { href: '/about', label: t('about') },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-white">L2</span>
              <span className="text-orange-500">GT</span>
              <span className="text-white">OPLIST</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => onLocaleChange(locale === 'en' ? 'ru' : 'en')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  locale === 'en' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLocaleChange(locale === 'ru' ? 'en' : 'ru')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  locale === 'ru' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                РУ
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center space-x-2 px-3 py-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <button
                  onClick={() => onLocaleChange(locale === 'en' ? 'ru' : 'en')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    locale === 'en' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => onLocaleChange(locale === 'ru' ? 'en' : 'ru')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    locale === 'ru' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  РУ
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}