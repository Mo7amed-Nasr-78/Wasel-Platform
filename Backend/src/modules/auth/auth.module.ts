import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '@/database/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { WalletService } from '../wallet';
import { StripeService } from '../stripe';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from '@/jobs/email/email.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    BullModule.registerQueue({ name: 'email' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    WalletService,
    StripeService,
    EmailService,
  ],
})
export class AuthModule {}
