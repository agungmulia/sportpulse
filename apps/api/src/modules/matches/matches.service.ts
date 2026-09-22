import { Injectable, NotFoundException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const LIVE_STATUSES: $Enums.MatchStatus[] = [$Enums.MatchStatus.LIVE, $Enums.MatchStatus.HALF_TIME];

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findLive() {
    return this.prisma.match.findMany({
      where: { status: { in: LIVE_STATUSES } },
      include: this.matchIncludes(),
      orderBy: { kickoffAt: 'asc' },
    });
  }

  async findToday() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.prisma.match.findMany({
      where: { kickoffAt: { gte: start, lte: end } },
      include: this.matchIncludes(),
      orderBy: { kickoffAt: 'asc' },
    });
  }

  async findByLeague(leagueSlug: string, page = 1, limit = 20) {
    const league = await this.prisma.league.findUnique({ where: { slug: leagueSlug } });
    if (!league) throw new NotFoundException('League not found');

    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where: { leagueId: league.id },
        include: this.matchIncludes(),
        orderBy: { kickoffAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.match.count({ where: { leagueId: league.id } }),
    ]);

    return { matches, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const match = await this.prisma.match.findUnique({
      where: { slug },
      include: {
        ...this.matchIncludes(),
        stats: true,
        events: { orderBy: { minute: 'asc' } },
        lineups: true,
        prediction: true,
        aiArticle: { select: { title: true, summary: true, content: true } },
      },
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async findUpcoming(hours = 24) {
    const now = new Date();
    const end = new Date(Date.now() + hours * 60 * 60 * 1000);

    return this.prisma.match.findMany({
      where: {
        status: $Enums.MatchStatus.SCHEDULED,
        kickoffAt: { gte: now, lte: end },
      },
      include: this.matchIncludes(),
      orderBy: { kickoffAt: 'asc' },
    });
  }

  async findByTeam(teamSlug: string, page = 1, limit = 10) {
    const team = await this.prisma.team.findUnique({ where: { slug: teamSlug } });
    if (!team) throw new NotFoundException('Team not found');

    const where = { OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }] };
    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where,
        include: this.matchIncludes(),
        orderBy: { kickoffAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.match.count({ where }),
    ]);

    return { matches, total, page, limit };
  }

  private matchIncludes() {
    return {
      homeTeam: { select: { id: true, name: true, slug: true, logo: true } },
      awayTeam: { select: { id: true, name: true, slug: true, logo: true } },
      league: { select: { id: true, name: true, slug: true, logo: true } },
    };
  }
}
