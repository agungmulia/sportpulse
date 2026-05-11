import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MatchSyncService {
  private readonly logger = new Logger(MatchSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @InjectQueue('match-sync') private readonly matchSyncQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async syncLiveMatches() {
    const liveMatches = await this.prisma.match.findMany({
      where: { status: { in: ['LIVE', 'HALF_TIME'] } },
      select: { id: true, externalId: true },
    });

    for (const match of liveMatches) {
      await this.matchSyncQueue.add('sync-live', { matchId: match.id, externalId: match.externalId }, {
        jobId: `live-${match.id}`,
        removeOnComplete: true,
      });
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncUpcomingMatches() {
    await this.matchSyncQueue.add('sync-schedule', {}, {
      jobId: 'schedule-sync',
      removeOnComplete: true,
    });
  }

  async fetchFromApi(path: string) {
    const key = this.config.get('API_FOOTBALL_KEY');
    const baseUrl = this.config.get('API_FOOTBALL_URL', 'https://v3.football.api-sports.io');
    if (!key) {
      this.logger.warn('API_FOOTBALL_KEY not set — skipping external sync');
      return null;
    }
    const { data } = await axios.get(`${baseUrl}${path}`, {
      headers: { 'x-apisports-key': key },
    });
    return data;
  }
}
