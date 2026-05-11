import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MatchSyncService } from './match-sync.service';
import { MatchGateway } from './match.gateway';
import { MatchSyncProcessor } from './match-sync.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'match-sync' }),
  ],
  controllers: [MatchesController],
  providers: [MatchesService, MatchSyncService, MatchGateway, MatchSyncProcessor],
  exports: [MatchesService],
})
export class MatchesModule {}
