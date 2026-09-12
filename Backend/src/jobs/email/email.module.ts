import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
// import { RedisHealthService } from '../../shared/services/redis-health.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],

  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
