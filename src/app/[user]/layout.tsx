import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';

const locales = ['en', 'ru'];

interface UserLayoutProps {
  children: React.ReactNode;
  params: { user: string };
}

export default async function UserLayout({ children, params }: UserLayoutProps) {
  // For now, we'll use 'en' as default. In a real app, you'd determine this from the user param or other logic
  const locale = locales.includes(params.user) ? params.user : 'en';
  
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <ClientLayout messages={messages} initialLocale={locale} showNavAndFooter={true}>
      {children}
    </ClientLayout>
  );
}