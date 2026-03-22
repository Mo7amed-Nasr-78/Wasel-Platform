import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '@/database/prisma/prisma.service';

@Module({
    imports: [
        JwtModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService, PrismaService]
})
export class DashboardModule {}
