import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SeoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async generateSitemap(): Promise<string> {
    const baseUrl = this.config.get('APP_URL', 'https://sportpulse.ai');

    const [matches, teams, leagues, players] = await Promise.all([
      this.prisma.match.findMany({ select: { slug: true, updatedAt: true }, take: 10000 }),
      this.prisma.team.findMany({ select: { slug: true, updatedAt: true } }),
      this.prisma.league.findMany({ select: { slug: true, updatedAt: true } }),
      this.prisma.player.findMany({ select: { slug: true, updatedAt: true }, take: 5000 }),
    ]);

    const urls: { loc: string; priority: string; changefreq: string; lastmod?: string }[] = [
      { loc: baseUrl, priority: '1.0', changefreq: 'hourly' },
      { loc: `${baseUrl}/live`, priority: '0.9', changefreq: 'always' },
      { loc: `${baseUrl}/predictions`, priority: '0.8', changefreq: 'daily' },
      ...matches.map((m: { slug: string; updatedAt: Date }) => ({
        loc: `${baseUrl}/match/${m.slug}`,
        priority: '0.7',
        changefreq: 'hourly',
        lastmod: m.updatedAt.toISOString(),
      })),
      ...teams.map((t: { slug: string; updatedAt: Date }) => ({
        loc: `${baseUrl}/team/${t.slug}`,
        priority: '0.6',
        changefreq: 'daily',
        lastmod: t.updatedAt.toISOString(),
      })),
      ...leagues.map((l: { slug: string; updatedAt: Date }) => ({
        loc: `${baseUrl}/league/${l.slug}`,
        priority: '0.6',
        changefreq: 'daily',
        lastmod: l.updatedAt.toISOString(),
      })),
      ...players.map((p: { slug: string; updatedAt: Date }) => ({
        loc: `${baseUrl}/player/${p.slug}`,
        priority: '0.5',
        changefreq: 'weekly',
        lastmod: p.updatedAt.toISOString(),
      })),
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>`;
  }

  generateRobotsTxt(): string {
    const baseUrl = this.config.get('APP_URL', 'https://sportpulse.ai');
    return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /auth/

Sitemap: ${baseUrl}/sitemap.xml`;
  }

  generateMatchMeta(match: {
    homeTeam: { name: string; logo?: string | null };
    awayTeam: { name: string; logo?: string | null };
    league: { name: string };
    kickoffAt: Date;
    homeScore?: number | null;
    awayScore?: number | null;
    status: string;
  }) {
    const isLive = ['LIVE', 'HALF_TIME'].includes(match.status);
    const isFinished = match.status === 'FINISHED';
    const scoreStr = isLive || isFinished
      ? ` ${match.homeScore ?? 0}-${match.awayScore ?? 0}`
      : '';

    const title = `${match.homeTeam.name} vs ${match.awayTeam.name}${scoreStr} — ${match.league.name}`;
    const description = isLive
      ? `LIVE: ${match.homeTeam.name} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.awayTeam.name}. Follow live score, stats, and AI insights on SportPulse.`
      : `${match.homeTeam.name} vs ${match.awayTeam.name} match preview, prediction, and stats on SportPulse AI.`;

    return { title, description };
  }
}
