import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { MatchHeader } from '@/components/match/match-header';
import { MatchStats } from '@/components/match/match-stats';
import { MatchEvents } from '@/components/match/match-events';
import { MatchLineup } from '@/components/match/match-lineup';
import { AiSummary } from '@/components/match/ai-summary';
import { PredictionWidget } from '@/components/match/prediction-widget';
import { AdBanner } from '@/components/ads/ad-banner';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const match = await api.matches.getBySlug(params.slug);
    const isLive = ['LIVE', 'HALF_TIME'].includes(match.status);
    const score = isLive ? ` ${match.homeScore}-${match.awayScore}` : '';
    const title = `${match.homeTeam.name} vs ${match.awayTeam.name}${score} — ${match.league.name}`;
    const description = isLive
      ? `LIVE: ${match.homeTeam.name} vs ${match.awayTeam.name}. Real-time score, stats and AI insights.`
      : `${match.homeTeam.name} vs ${match.awayTeam.name} match stats, prediction and AI analysis on SportPulse.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [match.homeTeam.logo ?? '', match.awayTeam.logo ?? ''],
      },
    };
  } catch {
    return { title: 'Match Not Found' };
  }
}

export default async function MatchPage({ params }: Props) {
  try {
    const match = await api.matches.getBySlug(params.slug);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner position="above-fold" slot="match-top" className="mb-6" />

        <MatchHeader match={match} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MatchStats match={match} />
            <AdBanner position="mid-content" slot="match-mid" />
            <MatchEvents events={match.events} />
            <MatchLineup lineups={match.lineups} />
            {match.aiArticle && <AiSummary article={match.aiArticle} />}
          </div>

          <aside className="space-y-6">
            {match.prediction && <PredictionWidget prediction={match.prediction} match={match} />}
            <AdBanner position="sidebar" slot="match-sidebar" className="sticky top-20" />
          </aside>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
