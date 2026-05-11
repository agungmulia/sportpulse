'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Zap } from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navLinks = [
  { href: '/live', label: 'Live', badge: 'LIVE' },
  { href: '/predictions', label: 'Prediksi' },
  { href: '/league/premier-league', label: 'Premier League' },
  { href: '/league/la-liga', label: 'La Liga' },
  { href: '/league/liga-1', label: 'Liga 1' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <Zap className="h-5 w-5 text-primary-500" />
            <span>SportPulse</span>
            <span className="text-primary-500">AI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 text-[10px] font-bold bg-red-500 text-white px-1 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden py-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
