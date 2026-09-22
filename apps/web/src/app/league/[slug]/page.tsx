import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { MatchCard } from '@/components/match/match-card';
import { AdBanner } from '@/components/ads/ad-banner';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const league = await api.leagues.getBySlug(params.slug);
    return {
      title: `${league.name} — Live Scores, Fixtures & Predictions`,
      description: `Follow ${league.name} live scores, upcoming fixtures, and AI-powered match predictions on SportPulse AI.`,
    };
  } catch {
    return { title: 'League Not Found' };
  }
}

export default async function LeaguePage({ params }: Props) {
  try {
    const [league, result] = await Promise.all([
      api.leagues.getBySlug(params.slug),
      api.matches.getByLeague(params.slug),
    ]);

    const matches = (result as { matches: Parameters<typeof MatchCard>[0]['match'][] }).matches;
    const live = matches.filter((m) => m.status === 'LIVE' || m.status === 'HALF_TIME');
    const upcoming = matches.filter((m) => m.status === 'SCHEDULED');
    const finished = matches.filter((m) => m.status === 'FINISHED');

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner position="above-fold" slot="league-top" className="mb-6" />

        {/* League header */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center gap-4">
            {league.logo && (
              <Image
                src={league.logo}
                alt={league.name}
                width={64}
                height={64}
                className="object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{league.name}</h1>
              {league.country && (
                <p className="text-gray-500 text-sm mt-1">{league.country}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {live.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="live-badge">LIVE</span>
                  <h2 className="font-semibold">Sedang Berlangsung</h2>
                </div>
                <div className="space-y-3">
                  {live.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </section>
            )}

            {upcoming.length > 0 && (
              <section>
                <h2 className="font-semibold mb-3">Jadwal</h2>
                <div className="space-y-3">
                  {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </section>
            )}

            {finished.length > 0 && (
              <section>
                <h2 className="font-semibold mb-3">Hasil Terbaru</h2>
                <div className="space-y-3">
                  {finished.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </section>
            )}

            {matches.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                Tidak ada pertandingan tersedia untuk liga ini.
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <AdBanner position="sidebar" slot="league-sidebar" className="sticky top-20" />
          </aside>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
