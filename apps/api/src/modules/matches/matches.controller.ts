import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MatchesService } from './matches.service';

@ApiTags('matches')
@Controller({ path: 'matches', version: '1' })
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('live')
  @ApiOperation({ summary: 'Get all live matches' })
  getLive() {
    return this.matchesService.findLive();
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today\'s matches' })
  getToday() {
    return this.matchesService.findToday();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming matches' })
  @ApiQuery({ name: 'hours', required: false, type: Number })
  getUpcoming(@Query('hours') hours?: number) {
    return this.matchesService.findUpcoming(hours);
  }

  @Get('league/:slug')
  @ApiOperation({ summary: 'Get matches by league' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getByLeague(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.matchesService.findByLeague(slug, page, limit);
  }

  @Get('team/:slug')
  @ApiOperation({ summary: 'Get matches by team' })
  getByTeam(
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.matchesService.findByTeam(slug, page, limit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get match detail by slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.matchesService.findBySlug(slug);
  }
}
