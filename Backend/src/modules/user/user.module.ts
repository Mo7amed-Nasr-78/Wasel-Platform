import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '@/database/prisma/prisma.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
