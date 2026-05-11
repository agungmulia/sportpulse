import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MatchSyncService } from './match-sync.service';
import { MatchGateway } from './match.gateway';
import { PrismaService } from '../../database/prisma.service';

@Processor('match-sync')
export class MatchSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(MatchSyncProcessor.name);

  constructor(
    private readonly syncService: MatchSyncService,
    private readonly gateway: MatchGateway,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'sync-live':
        await this.processLiveSync(job.data as { matchId: string; externalId: string });
        break;
      case 'sync-schedule':
        await this.processScheduleSync();
        break;
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
    }
  }

  private async processLiveSync(data: { matchId: string; externalId: string }) {
    try {
      const apiData = await this.syncService.fetchFromApi(`/fixtures?id=${data.externalId}`);
      if (!apiData?.response?.[0]) return;

      const fixture = apiData.response[0];
      const score = fixture.goals;
      const status = this.mapStatus(fixture.fixture.status.short);

      await this.prisma.match.update({
        where: { id: data.matchId },
        data: {
          homeScore: score.home,
          awayScore: score.away,
          status,
        },
      });

      this.gateway.emitMatchUpdate(data.matchId, { score, status });
    } catch (err) {
      this.logger.error(`Failed to sync match ${data.matchId}`, err);
    }
  }

  private async processScheduleSync() {
    this.logger.log('Syncing upcoming schedule from API-Football');
    // Sync upcoming fixtures — placeholder for full implementation
  }

  private mapStatus(short: string): string {
    const map: Record<string, string> = {
      '1H': 'LIVE',
      '2H': 'LIVE',
      'HT': 'HALF_TIME',
      'FT': 'FINISHED',
      'NS': 'SCHEDULED',
      'PST': 'POSTPONED',
      'CANC': 'CANCELLED',
    };
    return map[short] ?? 'SCHEDULED';
  }
}
