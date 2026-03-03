import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { R2Service } from '@/r2/r2.service';

@Module({
  imports: [JwtModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsService, PrismaService, R2Service],
})
export class ShipmentsModule {}
