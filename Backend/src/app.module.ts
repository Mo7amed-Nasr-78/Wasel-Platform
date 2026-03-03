import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guards/jwtAuthGuard';
import { ShipmentsModule } from './shipments/shipments.module';
import { OffersModule } from './offers/offers.module';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/address.service';
import { AddressModule } from './address/address.module';
import { InvoiceModule } from './invoice/invoice.module';
import { TruckModule } from './truck/truck.module';
import { PrismaModule } from './prisma/prisma.module';
import { R2Controller } from './r2/r2.controller';
import { R2Service } from './r2/r2.service';

@Module({
  imports: [
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    ShipmentsModule,
    OffersModule,
    AddressModule,
    InvoiceModule,
    TruckModule,
    PrismaModule,
  ],
  controllers: [AppController, AddressController, R2Controller],
  providers: [AppService, AuthGuard, AddressService, R2Service],
})
export class AppModule {}
