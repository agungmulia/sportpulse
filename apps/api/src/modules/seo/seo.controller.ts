import { Controller, Get, Res, Header } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { SeoService } from './seo.service';

@ApiTags('seo')
@Controller({ version: '1' })
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml')
  @ApiOperation({ summary: 'Get sitemap' })
  async getSitemap(@Res() res: FastifyReply) {
    const xml = await this.seoService.generateSitemap();
    res.send(xml);
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Get robots.txt' })
  getRobots(@Res() res: FastifyReply) {
    res.send(this.seoService.generateRobotsTxt());
  }
}
