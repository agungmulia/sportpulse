import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MatchesModule } from './modules/matches/matches.module';
import { PredictionsModule } from './modules/predictions/predictions.module';
import { AiModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SeoModule } from './modules/seo/seo.module';
import { AdsModule } from './modules/ads/ads.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Logging
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) =>
              `${timestamp} [${context ?? 'App'}] ${level}: ${message}`,
            ),
          ),
        }),
      ],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 20 },
      { name: 'medium', ttl: 10000, limit: 100 },
      { name: 'long', ttl: 60000, limit: 1000 },
    ]),

    // Cron jobs
    ScheduleModule.forRoot(),

    // Queue (BullMQ + Redis)
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { url: config.get('REDIS_URL', 'redis://localhost:6379') },
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: 100,
          removeOnFail: 200,
        },
      }),
    }),

    // Feature modules
    DatabaseModule,
    AuthModule,
    UsersModule,
    MatchesModule,
    PredictionsModule,
    AiModule,
    NotificationsModule,
    SeoModule,
    AdsModule,
    SearchModule,
    HealthModule,
  ],
})
export class AppModule {}
