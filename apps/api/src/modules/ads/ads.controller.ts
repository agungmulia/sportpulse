import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdsService } from './ads.service';

@ApiTags('ads')
@Controller({ path: 'ads', version: '1' })
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get('placements')
  @ApiOperation({ summary: 'Get active ad placements' })
  getPlacements() {
    return this.adsService.getActivePlacements();
  }

  @Post('impression')
  @ApiOperation({ summary: 'Track ad impression' })
  trackImpression(
    @Body()
    body: {
      placementId: string;
      matchId?: string;
      sessionId?: string;
      country?: string;
      device?: string;
    },
  ) {
    return this.adsService.trackImpression(body);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get ad statistics' })
  getStats(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.adsService.getStats(new Date(start), new Date(end));
  }
}
