import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @InjectQueue('notifications') private readonly notifQueue: Queue,
  ) {}

  async sendGoalNotification(matchId: string, scorer: string, minute: number, score: string) {
    await this.notifQueue.add('goal', { matchId, scorer, minute, score });
  }

  async sendMatchStartNotification(matchId: string) {
    await this.notifQueue.add('match-start', { matchId });
  }

  async sendMatchReminderNotification(matchId: string, minutesBefore: number) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      select: { kickoffAt: true },
    });
    if (!match) return;

    const delay = match.kickoffAt.getTime() - minutesBefore * 60 * 1000 - Date.now();
    if (delay > 0) {
      await this.notifQueue.add('match-reminder', { matchId, minutesBefore }, { delay });
    }
  }

  async sendToOneSignal(payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
    segments?: string[];
    playerIds?: string[];
  }) {
    const appId = this.config.get('ONESIGNAL_APP_ID');
    const apiKey = this.config.get('ONESIGNAL_REST_API_KEY');
    if (!appId || !apiKey) {
      this.logger.warn('OneSignal not configured');
      return;
    }

    await axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: appId,
        headings: { en: payload.title },
        contents: { en: payload.body },
        data: payload.data,
        included_segments: payload.segments ?? ['All'],
        ...(payload.playerIds ? { include_player_ids: payload.playerIds } : {}),
      },
      { headers: { Authorization: `Basic ${apiKey}` } },
    );
  }

  async getHistory(page = 1, limit = 20) {
    return this.prisma.pushNotification.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
