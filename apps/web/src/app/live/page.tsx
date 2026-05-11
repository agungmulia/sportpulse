import type { Metadata } from 'next';
import { LiveMatchesFeed } from '@/components/match/live-matches-feed';
import { AdBanner } from '@/components/ads/ad-banner';

export const metadata: Metadata = {
  title: 'Live Scores — Real-time Football Results',
  description: 'Watch live football scores from all major leagues. Real-time updates, match stats and AI insights.',
};

export const revalidate = 0;

export default function LivePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="live-badge">LIVE</span>
        <h1 className="text-2xl font-bold">Live Scores</h1>
      </div>

      <AdBanner position="above-fold" slot="live-top" className="mb-6" />

      <LiveMatchesFeed />

      <AdBanner position="mid-content" slot="live-bottom" className="mt-6" />
    </div>
  );
}
