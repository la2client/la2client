'use client';

import { useTranslations } from 'next-intl';
import { Send, Mail } from 'lucide-react';
import {usePathname} from "next/navigation";
import {Link} from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations('footer');

    const pathname = usePathname();
    if (pathname?.includes('/admin')) return null;

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl font-bold">
              <span className="text-white">L2</span>
              <span className="text-orange-500">GT</span>
              <span className="text-white">OPLIST</span>
            </span>
            </Link>
          {/* Main Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">
              {t('main')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('home')}
                </Link>
              </li>
                <li>
                    <Link href="/placement" className="text-gray-400 hover:text-orange-500 transition-colors">
                        {t('placement')}
                    </Link>
                </li>
                  <li>
                      <Link href="/faq" className="text-gray-400 hover:text-orange-500 transition-colors">
                          FAQ
                      </Link>
                  </li>
                  <li>
                <Link href="/about-us" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t('aboutUs')}
                </Link>
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
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}