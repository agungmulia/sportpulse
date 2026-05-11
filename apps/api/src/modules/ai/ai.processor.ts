import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiService } from './ai.service';

@Processor('ai-generation')
export class AiProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessor.name);

  constructor(private readonly aiService: AiService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'match-summary':
        await this.aiService.processMatchSummary((job.data as { matchId: string }).matchId);
        break;
      default:
        this.logger.warn(`Unknown AI job: ${job.name}`);
    }
  }
}
