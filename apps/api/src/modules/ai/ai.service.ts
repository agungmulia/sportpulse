import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import OpenAI from 'openai';
import { PrismaService } from '../../database/prisma.service';
import { PromptBuilderService } from './prompt-builder.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly promptBuilder: PromptBuilderService,
    @InjectQueue('ai-generation') private readonly aiQueue: Queue,
  ) {
    this.openai = new OpenAI({ apiKey: config.get('OPENAI_API_KEY') });
  }

  async generateMatchSummary(matchId: string) {
    await this.aiQueue.add('match-summary', { matchId }, {
      jobId: `summary-${matchId}`,
      removeOnComplete: 50,
    });
    return { queued: true, matchId };
  }

  async generateMatchPreview(matchId: string) {
    await this.aiQueue.add('match-preview', { matchId }, {
      jobId: `preview-${matchId}`,
      removeOnComplete: 50,
    });
    return { queued: true, matchId };
  }

  async createCompletion(prompt: string, systemPrompt?: string): Promise<string> {
    const model = this.config.get('OPENAI_MODEL', 'gpt-4o-mini');
    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    return response.choices[0]?.message?.content ?? '';
  }

  async getArticleByMatch(matchId: string) {
    return this.prisma.aiArticle.findUnique({ where: { matchId } });
  }

  async listArticles(page = 1, limit = 20) {
    const [articles, total] = await Promise.all([
      this.prisma.aiArticle.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, title: true, slug: true, summary: true, type: true, createdAt: true },
      }),
      this.prisma.aiArticle.count({ where: { isPublished: true } }),
    ]);
    return { articles, total, page, limit };
  }

  async processMatchSummary(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        stats: true,
        events: { orderBy: { minute: 'asc' } },
      },
    });

    if (!match) return;

    const prompt = this.promptBuilder.buildMatchSummaryPrompt(match);
    const content = await this.createCompletion(prompt, this.promptBuilder.systemPrompt());

    const slug = `match-summary-${match.slug}-${Date.now()}`;
    const title = `${match.homeTeam.name} vs ${match.awayTeam.name} — Match Summary`;

    await this.prisma.aiArticle.upsert({
      where: { matchId },
      create: {
        matchId,
        type: 'MATCH_SUMMARY',
        title,
        slug,
        content,
        summary: content.slice(0, 300),
        keywords: [match.homeTeam.name, match.awayTeam.name, match.league.name],
        isPublished: true,
      },
      update: { content, updatedAt: new Date() },
    });

    this.logger.log(`Generated match summary for ${match.slug}`);
  }
}
