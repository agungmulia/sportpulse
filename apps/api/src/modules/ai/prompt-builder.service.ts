import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptBuilderService {
  systemPrompt(): string {
    return `You are a professional sports journalist specializing in football.
Write in a clear, engaging, and factual style.
Focus on key moments, player performances, and tactical insights.
Target audience: Indonesian and Southeast Asian sports fans.
Language: Indonesian (Bahasa Indonesia).
Keep it concise (300-500 words).`;
  }

  buildMatchSummaryPrompt(match: {
    homeTeam: { name: string };
    awayTeam: { name: string };
    homeScore: number | null;
    awayScore: number | null;
    league: { name: string };
    stats: { homePossession?: number | null; awayPossession?: number | null; homeShotsOnTarget?: number | null; awayShotsOnTarget?: number | null } | null;
    events: Array<{ minute: number; type: string; detail?: string | null }>;
  }): string {
    const score = `${match.homeScore ?? 0}-${match.awayScore ?? 0}`;
    const goals = match.events.filter(e => e.type === 'GOAL');
    const cards = match.events.filter(e => ['YELLOW_CARD', 'RED_CARD'].includes(e.type));

    return `Generate a professional football match summary for:

Match: ${match.homeTeam.name} vs ${match.awayTeam.name}
Competition: ${match.league.name}
Final Score: ${score}

Key Events:
${goals.map(g => `- Goal at minute ${g.minute}: ${g.detail ?? ''}`).join('\n') || 'No goals'}

Discipline:
${cards.map(c => `- ${c.type} at minute ${c.minute}`).join('\n') || 'No cards'}

Stats:
- Possession: ${match.stats?.homePossession ?? '?'}% vs ${match.stats?.awayPossession ?? '?'}%
- Shots on target: ${match.stats?.homeShotsOnTarget ?? '?'} vs ${match.stats?.awayShotsOnTarget ?? '?'}

Include: key moments, team performances, tactical observations, and match verdict.`;
  }

  buildMatchPreviewPrompt(match: {
    homeTeam: { name: string };
    awayTeam: { name: string };
    league: { name: string };
    kickoffAt: Date;
  }): string {
    return `Write a match preview article for:

Match: ${match.homeTeam.name} vs ${match.awayTeam.name}
Competition: ${match.league.name}
Kickoff: ${match.kickoffAt.toISOString()}

Include: team form analysis, key players to watch, tactical matchup, and prediction.`;
  }

  buildPredictionPrompt(data: {
    homeTeam: string;
    awayTeam: string;
    homeForm: string;
    awayForm: string;
    h2hRecord: string;
  }): string {
    return `Analyze this football match and provide win probability estimates:

Home: ${data.homeTeam} (Form: ${data.homeForm})
Away: ${data.awayTeam} (Form: ${data.awayForm})
H2H: ${data.h2hRecord}

Respond in JSON format:
{
  "homeWin": 0.0,
  "draw": 0.0,
  "awayWin": 0.0,
  "overUnder": "over|under",
  "confidence": 0.0,
  "reasoning": ""
}`;
  }
}
