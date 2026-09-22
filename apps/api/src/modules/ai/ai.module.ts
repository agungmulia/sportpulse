import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiProcessor } from './ai.processor';
import { PromptBuilderService } from './prompt-builder.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'ai-generation' })],
  controllers: [AiController],
  providers: [AiService, AiProcessor, PromptBuilderService],
  exports: [AiService, PromptBuilderService],
})
export class AiModule {}
