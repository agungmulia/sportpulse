import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <Zap className="h-5 w-5 text-primary-500" />
              <span>SportPulse AI</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Platform live sports & AI-powered match insights untuk penggemar sepak bola.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Liga</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/league/premier-league" className="hover:text-primary-500">Premier League</Link></li>
              <li><Link href="/league/la-liga" className="hover:text-primary-500">La Liga</Link></li>
              <li><Link href="/league/serie-a" className="hover:text-primary-500">Serie A</Link></li>
              <li><Link href="/league/liga-1" className="hover:text-primary-500">Liga 1 Indonesia</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Fitur</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/live" className="hover:text-primary-500">Live Score</Link></li>
              <li><Link href="/predictions" className="hover:text-primary-500">Prediksi AI</Link></li>
              <li><Link href="/ai/articles" className="hover:text-primary-500">Artikel AI</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Info</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-primary-500">Tentang Kami</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-500">Privasi</Link></li>
              <li><Link href="/terms" className="hover:text-primary-500">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SportPulse AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Data powered by API-Football · AI by OpenAI
          </p>
        </div>
      </div>
    </footer>
  );
}
