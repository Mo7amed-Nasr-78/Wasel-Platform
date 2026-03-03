import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [JwtModule],
  providers: [InvoiceService, PrismaService],
  controllers: [InvoiceController]
})
export class InvoiceModule {}
