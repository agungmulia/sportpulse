import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://sportpulse.ai'),
  title: {
    default: 'SportPulse AI — Live Scores, Predictions & Match Insights',
    template: '%s | SportPulse AI',
  },
  description:
    'Real-time football live scores, AI-powered match predictions, team analytics, and player statistics. The smartest sports intelligence platform.',
  keywords: ['live score', 'football', 'soccer', 'predictions', 'AI', 'sports analytics', 'sepak bola'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: 'en_US',
    siteName: 'SportPulse AI',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sportpulseai',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-gray-50 dark:bg-gray-950`}>
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
