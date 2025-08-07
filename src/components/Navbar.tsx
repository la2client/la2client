'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {
    Link as I18nLink,
    usePathname as useI18nPathname,
} from '@/i18n/navigation';
import {usePathname as useRawPathname} from 'next/navigation';
import { Menu, Globe } from 'lucide-react';
import {cn} from '@/lib/utils';

import {Button} from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = useI18nPathname();

    if (pathname?.includes('/admin')) return null;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                    <Globe className="h-5 w-5 mr-2" />
                    <span className="uppercase">{locale}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem asChild>
                    <I18nLink href={pathname} locale="en" className="w-full">
                        English
                    </I18nLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <I18nLink href={pathname} locale="ru" className="w-full">
                        {'Русский'}
                    </I18nLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Navbar() {
    const t = useTranslations('nav');
    const rawPath = useRawPathname();
    const locale = useLocale();
    const i18nPathname = useI18nPathname();
    const [open, setOpen] = useState(false);

// Hide navbar on admin routes
    if (rawPath?.includes('/admin')) return null;

    const links = [
        { href: '/', label: t('home') },
        { href: '/placement', label: t('placement') },
        { href: '/faq', label: t('faq') },
        { href: '/about-us', label: t('about') },
    ] as const;

    const isActive = (href: string) => {
        if (!rawPath) return false;

        // Special case for the home link: only active when exactly at "/{locale}" (with or without a trailing slash)
        if (href === '/') {
            return rawPath === `/${locale}` || rawPath === `/${locale}/`;
        }

        // For other links, active when on the page itself or within its sub‑routes
        const localized = `/${locale}${href}`; // href already starts with "/"
        return rawPath === localized || rawPath.startsWith(`${localized}/`);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Left: Logo + Desktop Nav */}
                <div className="flex items-center gap-6">
                    <I18nLink href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">
            <span className="text-white">L2</span>
            <span className="text-orange-500">GT</span>
            <span className="text-white">OPLIST</span>
          </span>
                    </I18nLink>

                    <nav className="hidden md:flex items-center gap-2">
                        {links.map((link) => (
                            <I18nLink
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                    isActive(link.href)
                                        ? 'text-white bg-gray-800 border border-gray-700'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                )}
                                aria-current={isActive(link.href) ? 'page' : undefined}
                            >
                                {link.label}
                            </I18nLink>
                        ))}
                    </nav>
                </div>

                {/* Right: Language + Mobile Menu */}
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">{'Open menu'}</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-gray-900 border-gray-800 p-4">
                            <SheetHeader>
                                <SheetTitle className="text-left">
                                    <I18nLink
                                        href="/"
                                        onClick={() => setOpen(false)}
                                        className="text-2xl font-bold"
                                    >
                                        <span className="text-white">L2</span>
                                        <span className="text-orange-500">GT</span>
                                        <span className="text-white">OPLIST</span>
                                    </I18nLink>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="mt-6 flex flex-col gap-1">
                                {links.map((link) => (
                                    <I18nLink
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                            isActive(link.href)
                                                ? 'text-white bg-gray-800 border border-gray-700'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                        )}
                                        aria-current={isActive(link.href) ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </I18nLink>
                                ))}
                            </div>

                            <div className="mt-6">
                                <div className="text-xs uppercase text-gray-500 mb-2">
                                    {'Language'}
                                </div>
                                <div className="flex gap-2">
                                    <I18nLink
                                        href={i18nPathname}
                                        locale="en"
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-sm border',
                                            locale === 'en'
                                                ? 'bg-gray-800 text-white border-gray-700'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800 border-gray-700'
                                        )}
                                        onClick={() => setOpen(false)}
                                    >
                                        {'English'}
                                    </I18nLink>
                                    <I18nLink
                                        href={i18nPathname}
                                        locale="ru"
                                        className={cn(
                                            'px-3 py-1.5 rounded-md text-sm border',
                                            locale === 'ru'
                                                ? 'bg-gray-800 text-white border-gray-700'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800 border-gray-700'
                                        )}
                                        onClick={() => setOpen(false)}
                                    >
                                        {'Русский'}
                                    </I18nLink>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
