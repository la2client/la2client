'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Users, Send, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">
              {t('main')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">
              {t('information')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/placement" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('placement')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('faq')}
                </Link>
              </li>
              <li>
                <span className="text-gray-400">{t('sitemap')}</span>
              </li>
              <li>
                <span className="text-gray-400">{t('cookies')}</span>
              </li>
              <li>
                <span className="text-gray-400">{t('userAgreement')}</span>
              </li>
              <li>
                <span className="text-gray-400">{t('privacyPolicy')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">
              {t('contactUs')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-orange-500 transition-colors">
                  <Users className="w-4 h-4 mr-2" />
                  {t('teams')}
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-orange-500 transition-colors">
                  <Send className="w-4 h-4 mr-2" />
                  {t('telegram')}
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-orange-500 transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  {t('email')}
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-400 hover:text-orange-500 transition-colors">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('feedbackForm')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Logo and Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <Link href="/home" className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl font-bold">
              <span className="text-white">L2</span>
              <span className="text-orange-500">GT</span>
              <span className="text-white">OPLIST</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm">
            © 2012-2025 L2GTOPLIST.com
          </p>
        </div>
      </div>
    </footer>
  );
}