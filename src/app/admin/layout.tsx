'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Server, Image, Home, LogOut, Settings } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (!response.ok) {
          router.push('/admin');
          return;
        }
      } catch (error) {
        router.push('/admin');
        return;
      }
      setLoading(false);
    };

    if (pathname !== '/admin') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  // Login page doesn't need sidebar
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin/servers', label: 'Servers', icon: Server },
    { href: '/admin/wallpaper', label: 'Wallpaper', icon: Image },
    { href: '/admin/home-banner', label: 'Home Banner', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-white">L2</span>
            <span className="text-orange-500">GT</span>
            <span className="text-white">OPLIST</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}