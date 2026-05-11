import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('ai')
@Controller({ path: 'ai', version: '1' })
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('articles')
  @ApiOperation({ summary: 'List AI-generated articles' })
  listArticles(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.aiService.listArticles(page, limit);
  }

  @Get('articles/match/:matchId')
  @ApiOperation({ summary: 'Get AI article for a match' })
  getArticleByMatch(@Param('matchId') matchId: string) {
    return this.aiService.getArticleByMatch(matchId);
  }

  @Post('generate/summary/:matchId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Queue AI match summary generation' })
  generateSummary(@Param('matchId') matchId: string) {
    return this.aiService.generateMatchSummary(matchId);
  }

  @Post('generate/preview/:matchId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Queue AI match preview generation' })
  generatePreview(@Param('matchId') matchId: string) {
    return this.aiService.generateMatchPreview(matchId);
  }
}
