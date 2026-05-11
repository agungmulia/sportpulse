import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AiService } from '../ai/ai.service';
import { PromptBuilderService } from '../ai/prompt-builder.service';

@Injectable()
export class PredictionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly promptBuilder: PromptBuilderService,
  ) {}

  async findByMatch(matchSlug: string) {
    const match = await this.prisma.match.findUnique({
      where: { slug: matchSlug },
      include: { prediction: true, homeTeam: true, awayTeam: true },
    });
    if (!match) throw new NotFoundException('Match not found');
    return match.prediction;
  }

  async generatePrediction(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
      },
    });
    if (!match) throw new NotFoundException('Match not found');

    const prompt = this.promptBuilder.buildPredictionPrompt({
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeForm: 'W W D L W',
      awayForm: 'L W W W D',
      h2hRecord: '2W 1D 2L for home team in last 5 meetings',
    });

    const raw = await this.aiService.createCompletion(prompt);

    let parsed: { homeWin: number; draw: number; awayWin: number; overUnder: string; confidence: number; reasoning: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        homeWin: 0.4,
        draw: 0.3,
        awayWin: 0.3,
        overUnder: 'over',
        confidence: 0.6,
        reasoning: raw,
      };
    }

    return this.prisma.prediction.upsert({
      where: { matchId },
      create: {
        matchId,
        winProbabilityHome: parsed.homeWin,
        winProbabilityDraw: parsed.draw,
        winProbabilityAway: parsed.awayWin,
        overProbability: parsed.overUnder === 'over' ? 0.6 : 0.4,
        underProbability: parsed.overUnder === 'under' ? 0.6 : 0.4,
        confidenceScore: parsed.confidence,
      },
      update: {
        winProbabilityHome: parsed.homeWin,
        winProbabilityDraw: parsed.draw,
        winProbabilityAway: parsed.awayWin,
        confidenceScore: parsed.confidence,
        updatedAt: new Date(),
      },
    });
  }

  async listRecent(limit = 10) {
    return this.prisma.prediction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        match: {
          include: {
            homeTeam: { select: { name: true, slug: true, logo: true } },
            awayTeam: { select: { name: true, slug: true, logo: true } },
            league: { select: { name: true, slug: true } },
          },
        },
      },
    });
  }
}
