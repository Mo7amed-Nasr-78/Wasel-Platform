import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async sendWelcomeEmail(to: string, subject: string, html: string) {
    await this.emailQueue.add('welcome-email', {
      to,
      subject,
      html
    }, {
      removeOnComplete: {
        age: 3600,
        count: 1000,
      },

      removeOnFail: {
        age: 24 * 3600,
      },
    },);
  }

  async sendOtpEmail(email: string, html: string) {
    await this.emailQueue.add('otp', {
      email,
      html
    }, {
      removeOnComplete: {
        age: 3600,
        count: 1000,
      },

      removeOnFail: {
        age: 24 * 3600,
      },
    },);
  }
}
