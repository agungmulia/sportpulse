import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string, types: string[] = ['match', 'team', 'league', 'player']) {
    const results: Record<string, unknown[]> = {};

    if (types.includes('team')) {
      results.teams = await this.prisma.team.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        select: { id: true, name: true, slug: true, logo: true },
        take: 5,
      });
    }

    if (types.includes('league')) {
      results.leagues = await this.prisma.league.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        select: { id: true, name: true, slug: true, logo: true },
        take: 5,
      });
    }

    if (types.includes('player')) {
      results.players = await this.prisma.player.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        select: { id: true, name: true, slug: true, photo: true, position: true },
        take: 5,
      });
    }

    if (types.includes('match')) {
      const teams = await this.prisma.team.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        select: { id: true },
        take: 10,
      });
      const teamIds = teams.map((t) => t.id);

      results.matches = await this.prisma.match.findMany({
        where: {
          OR: [
            { homeTeamId: { in: teamIds } },
            { awayTeamId: { in: teamIds } },
          ],
        },
        include: {
          homeTeam: { select: { name: true, logo: true } },
          awayTeam: { select: { name: true, logo: true } },
          league: { select: { name: true } },
        },
        orderBy: { kickoffAt: 'desc' },
        take: 5,
      });
    }

    return results;
  }

  async autocomplete(query: string) {
    const [teams, leagues, players] = await Promise.all([
      this.prisma.team.findMany({
        where: { name: { startsWith: query, mode: 'insensitive' } },
        select: { name: true, slug: true, logo: true },
        take: 3,
      }),
      this.prisma.league.findMany({
        where: { name: { startsWith: query, mode: 'insensitive' } },
        select: { name: true, slug: true },
        take: 2,
      }),
      this.prisma.player.findMany({
        where: { name: { startsWith: query, mode: 'insensitive' } },
        select: { name: true, slug: true },
        take: 3,
      }),
    ]);

    return {
      teams: teams.map((t) => ({ ...t, type: 'team' })),
      leagues: leagues.map((l) => ({ ...l, type: 'league' })),
      players: players.map((p) => ({ ...p, type: 'player' })),
    };
  }
}
