import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search matches, teams, leagues, players' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  search(@Query('q') query: string) {
    return this.searchService.search(query);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplete suggestions' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  autocomplete(@Query('q') query: string) {
    return this.searchService.autocomplete(query);
  }
}
