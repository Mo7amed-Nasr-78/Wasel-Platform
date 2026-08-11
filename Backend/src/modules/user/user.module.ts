import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '@/database/prisma/prisma.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { R2Service } from '@/shared/services/r2/r2.service';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, R2Service],
})
export class UserModule {}
