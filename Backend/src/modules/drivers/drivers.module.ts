import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/database/prisma/prisma.service';
import { R2Service } from '@/shared/services/r2/r2.service';

@Module({
  exports: [DriversModule],
  controllers: [DriversController],
  providers: [DriversService, JwtService, PrismaService, R2Service],
})
export class DriversModule {}
