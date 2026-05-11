import type { Metadata } from 'next';
import { LiveMatchesFeed } from '@/components/match/live-matches-feed';
import { TodaySchedule } from '@/components/match/today-schedule';
import { PredictionHighlights } from '@/components/match/prediction-highlights';
import { AdBanner } from '@/components/ads/ad-banner';

export const metadata: Metadata = {
  title: 'Live Scores, Predictions & AI Match Insights',
  description:
    'Follow live football scores, get AI-powered match predictions, and read in-depth team analytics on SportPulse AI.',
};

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Above-fold ad */}
      <AdBanner position="above-fold" slot="1234567890" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveMatchesFeed />

          {/* Mid-content ad */}
          <AdBanner position="mid-content" slot="0987654321" />

          <TodaySchedule />
        </div>

        <aside className="space-y-6">
          <PredictionHighlights />

          {/* Sidebar ad */}
          <AdBanner position="sidebar" slot="1122334455" className="sticky top-20" />
        </aside>
      </div>

      {/* Sticky footer ad */}
      <AdBanner position="sticky-footer" slot="5544332211" />
    </div>
  );
}
