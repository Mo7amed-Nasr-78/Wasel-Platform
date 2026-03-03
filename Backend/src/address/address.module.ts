import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    controllers: [AddressController],
    providers: [AddressService ,PrismaService]
})
export class AddressModule {}
