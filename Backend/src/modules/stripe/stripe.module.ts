import { Module, forwardRef } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { WalletModule } from '@/modules/wallet';
import { PrismaModule } from '@/database/prisma/prisma.module';

@Module({
  imports: [forwardRef(() => WalletModule), PrismaModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
