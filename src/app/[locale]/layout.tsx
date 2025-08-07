import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "L2GTOPLIST - Lineage 2 Server Listings",
  description: "The world's leading portal for Lineage 2 server announcements and listings. Find the perfect L2 server for your gaming experience.",
};

export default async function RootLayout({
  children,
    params
}: Readonly<{
  children: React.ReactNode;
    params: Promise<{locale: string}>;
}>) {
    const {locale} = await params;
  return (
    <html lang="en">
    <NextIntlClientProvider locale={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navbar/>
        {children}
      <Footer/>
      </body>
    </NextIntlClientProvider>
    </html>
  );
}
