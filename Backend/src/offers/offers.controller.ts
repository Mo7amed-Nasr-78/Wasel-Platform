import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { AuthGuard } from '@/guards/jwtAuthGuard';
import { CreateOfferDTO } from './dto/create-offer.dto';
import { RolesGuard } from '@/guards/rolesGuard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('offers')
@UseGuards(AuthGuard, RolesGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @Get(':id')
  @Roles(['MANUFACTURER', 'CARRIER_COMPANY', 'INDEPENDENT_CARRIER', 'ADMIN'])
  getOffer(@Param('id') offerId: string, @Request() req) {
    const profileId = req.user.profileID;
    return this.offersService.getOffer(profileId, offerId);
  }

  @Get()
  @Roles(['MANUFACTURER', 'ADMIN'])
  getOffers() {
    return this.offersService.getOffers();
  }

  @Post(':shipmentId')
  @Roles(['MANUFACTURER', 'ADMIN'])
  createOffer(
    @Param('shipmentId') shipmentId: string,
    @Body() body: CreateOfferDTO,
    @Request() req,
  ) {
    const profileId = req.user.profileID as string;
    return this.offersService.createOffer(profileId, shipmentId, body);
  }

  @Patch(':offerId')
  @Roles(['MANUFACTURER', 'ADMIN'])
  updateOffer(
    @Param('offerId') offerId: string,
    @Body('status') status: string,
  ) {
    return this.offersService.updateOffer(offerId, status);
  }

  @Delete(':offerId')
  @Roles(['MANUFACTURER', 'ADMIN'])
  deleteOffer(@Param('offerId') offerId: string, @Request() req) {
    const profileId = req.user.profileID as string;
    return this.offersService.deleteOffer(profileId, offerId);
  }
}
