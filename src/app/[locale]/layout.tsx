import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {routing} from "@/i18n/routing";
import WallpaperBanner from "@/components/WallpaperBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

enum LocaleEnum {
    en = 'en-US',
    ru = 'ru-RU',
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

const metaByLocale = {
    en: {
        title: 'L2GTOPLIST – Lineage2 Server Listings',
        description:
            'The world’s leading portal for Lineage2 server announcements and listings. Find the perfect L2 server for your gaming experience.',
        keywords: [
            'Lineage 2 servers',
            'L2 server list',
            'private server',
            'Lineage II top',
            'L2 GTOP',
        ],
    },
    ru: {
        title: 'L2GTOPLIST – Список серверов Lineage2',
        description:
            'Ведущий портал объявлений и рейтингов серверов Lineage2. Найдите идеальный сервер L2 для комфортной игры.',
        keywords: [
            'Lineage 2 сервера',
            'список серверов L2',
            'приватный сервер Lineage 2',
            'L2 топ',
        ],
    }
} as const;

export async function generateMetadata({
                                           params,
                                       }: {
    params: { locale: string };
}): Promise<Metadata> {
    const fallback = metaByLocale.en;
    const meta = metaByLocale[(await params).locale as keyof typeof metaByLocale] || fallback;
    const localeKey = ((await params).locale as keyof typeof LocaleEnum) ?? "en";
    const htmlLang  = LocaleEnum[localeKey] ?? "en-US";

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords.join(', '),
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: 'website',
            alternateLocale: ['en_US', 'ru_RU'],
            locale: htmlLang,
        },
        twitter: {
            title: meta.title,
            description: meta.description,
        },
        robots: 'index, follow',
        icons: {
            // Favicons
            icon: [
                {url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png'},
                {url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon'},
            ],
        }
    };
}

export default async function RootLayout({
  children,
    params
}: Readonly<{
  children: React.ReactNode;
    params: Promise<{locale: string}>;
}>) {
    const {locale} = await params;
    const localeKey = ((await params).locale as keyof typeof LocaleEnum) ?? "en";
    const htmlLang  = LocaleEnum[localeKey] ?? "en-US";
  return (
    <html lang={htmlLang}>
    <NextIntlClientProvider locale={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navbar/>
      <WallpaperBanner />
        {children}
      <Footer/>
      </body>
    </NextIntlClientProvider>
    </html>
  );
}
