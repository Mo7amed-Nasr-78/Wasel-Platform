import { SendMail } from '@/shared/services/Nodemailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  async process(job: Job) {
    console.log('Processing job:', job.name);

    if (job.name === 'welcome-email') {
      const { to, subject, html } = job.data;

      console.log(`Sending welcome email to ${to}`);

      // send email here
      try {
        await SendMail(to, subject, html);
      } catch (error) {
        console.error(`Failed to send welcome email to ${to}`, error);
        throw error;
      }

      return {
        success: true,
        email: to,
      };
    }

    if (job.name === 'otp') {
      const { email, html } = job.data;

      console.log(`Sending OTP email to ${email}`);

      // send email here
      try {
        await SendMail(email, "Your Verification Code", html);
      } catch (error) {
        console.error(`Failed to send OTP email to ${email}`, error);
        throw error;
      }

      return {
        success: true,
        email,
      };
    }

    throw new Error(`Unsupported email job: ${job.name}`);
  }
}
