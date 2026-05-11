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
    const team = await api.teams.getBySlug(params.slug);
    return {
      title: `${team.name} — Stats, Matches & Players`,
      description: `Follow ${team.name} live scores, fixtures, squad, and AI match analysis on SportPulse AI.`,
    };
  } catch {
    return { title: 'Team Not Found' };
  }
}

export default async function TeamPage({ params }: Props) {
  try {
    const [team, matches] = await Promise.all([
      api.teams.getBySlug(params.slug),
      api.matches.getByTeam(params.slug),
    ]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner position="above-fold" slot="team-top" className="mb-6" />

        {/* Team header */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center gap-4">
            {team.logo && (
              <Image src={team.logo} alt={team.name} width={80} height={80} className="object-contain" />
            )}
            <div>
              <h1 className="text-2xl font-bold">{team.name}</h1>
              <p className="text-gray-500">{team.country} · {team.league?.name}</p>
              {team.founded && <p className="text-sm text-gray-400">Founded {team.founded}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Recent Matches</h2>
            {matches.matches.map((match: Parameters<typeof MatchCard>[0]['match']) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          <aside>
            <AdBanner position="sidebar" slot="team-sidebar" className="sticky top-20" />
          </aside>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
