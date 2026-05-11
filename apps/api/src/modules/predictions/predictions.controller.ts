import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PredictionsService } from './predictions.service';

@ApiTags('predictions')
@Controller({ path: 'predictions', version: '1' })
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent predictions' })
  getRecent(@Query('limit') limit?: number) {
    return this.predictionsService.listRecent(limit);
  }

  @Get('match/:slug')
  @ApiOperation({ summary: 'Get prediction for a match' })
  getByMatch(@Param('slug') slug: string) {
    return this.predictionsService.findByMatch(slug);
  }

  @Post('generate/:matchId')
  @ApiOperation({ summary: 'Generate AI prediction for a match' })
  generate(@Param('matchId') matchId: string) {
    return this.predictionsService.generatePrediction(matchId);
  }
}
