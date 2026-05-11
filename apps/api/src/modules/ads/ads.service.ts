import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivePlacements() {
    return this.prisma.adPlacement.findMany({ where: { isActive: true } });
  }

  async trackImpression(data: {
    placementId: string;
    matchId?: string;
    sessionId?: string;
    userId?: string;
    country?: string;
    device?: string;
  }) {
    return this.prisma.adImpression.create({ data });
  }

  async getStats(startDate: Date, endDate: Date) {
    const impressions = await this.prisma.adImpression.groupBy({
      by: ['placementId'],
      where: { createdAt: { gte: startDate, lte: endDate } },
      _count: { id: true },
    });

    const placements = await this.prisma.adPlacement.findMany({
      where: { id: { in: impressions.map((i) => i.placementId) } },
    });

    return impressions.map((imp) => ({
      placement: placements.find((p) => p.id === imp.placementId),
      impressions: imp._count.id,
    }));
  }

  async getTopPerformingPages(limit = 10) {
    return this.prisma.adImpression.groupBy({
      by: ['matchId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });
  }
}
