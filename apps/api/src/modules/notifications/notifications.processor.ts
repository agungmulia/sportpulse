import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../database/prisma.service';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly notifService: NotificationsService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'goal':
        await this.handleGoal(job.data as { matchId: string; scorer: string; minute: number; score: string });
        break;
      case 'match-start':
        await this.handleMatchStart(job.data as { matchId: string });
        break;
      case 'match-reminder':
        await this.handleMatchReminder(job.data as { matchId: string; minutesBefore: number });
        break;
      default:
        this.logger.warn(`Unknown notification job: ${job.name}`);
    }
  }

  private async handleGoal(data: { matchId: string; scorer: string; minute: number; score: string }) {
    const match = await this.prisma.match.findUnique({
      where: { id: data.matchId },
      include: { homeTeam: true, awayTeam: true },
    });
    if (!match) return;

    await this.notifService.sendToOneSignal({
      title: `⚽ GOAL! ${match.homeTeam.name} vs ${match.awayTeam.name}`,
      body: `${data.scorer} scores in minute ${data.minute}! Score: ${data.score}`,
      data: { matchId: data.matchId, type: 'GOAL' },
    });

    this.logger.log(`Goal notification sent for match ${data.matchId}`);
  }

  private async handleMatchStart(data: { matchId: string }) {
    const match = await this.prisma.match.findUnique({
      where: { id: data.matchId },
      include: { homeTeam: true, awayTeam: true, league: true },
    });
    if (!match) return;

    await this.notifService.sendToOneSignal({
      title: `🏟️ Match Started!`,
      body: `${match.homeTeam.name} vs ${match.awayTeam.name} — ${match.league.name}`,
      data: { matchId: data.matchId, type: 'MATCH_START' },
    });
  }

  private async handleMatchReminder(data: { matchId: string; minutesBefore: number }) {
    const match = await this.prisma.match.findUnique({
      where: { id: data.matchId },
      include: { homeTeam: true, awayTeam: true },
    });
    if (!match) return;

    await this.notifService.sendToOneSignal({
      title: `⏰ Match in ${data.minutesBefore} minutes`,
      body: `${match.homeTeam.name} vs ${match.awayTeam.name} starting soon!`,
      data: { matchId: data.matchId, type: 'MATCH_REMINDER' },
    });
  }
}
