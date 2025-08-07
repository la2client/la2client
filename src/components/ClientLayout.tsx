'use client';

import { useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import Navbar from './Navbar';
import Footer from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
  messages: any;
  initialLocale: string;
  showNavAndFooter?: boolean;
}

export default function ClientLayout({ 
  children, 
  messages, 
  initialLocale,
  showNavAndFooter = true 
}: ClientLayoutProps) {
  const [locale, setLocale] = useState(initialLocale);
  const [currentMessages, setCurrentMessages] = useState(messages);

  const handleLocaleChange = async (newLocale: string) => {
    setLocale(newLocale);
    
    // Load new messages
    try {
      const response = await fetch(`/api/messages/${newLocale}`);
      const newMessages = await response.json();
      setCurrentMessages(newMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  return (
    <NextIntlClientProvider locale={locale} messages={currentMessages}>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {showNavAndFooter && (
          <Navbar locale={locale} onLocaleChange={handleLocaleChange} />
        )}
        <main className="flex-1">
          {children}
        </main>
        {showNavAndFooter && <Footer />}
      </div>
    </NextIntlClientProvider>
  );
}