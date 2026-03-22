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
  Put,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { AuthGuard } from '@/common/guards/jwtAuthGuard';
import { CreateOfferDTO } from './dto/create-offer.dto';
import { RolesGuard } from '@/common/guards/rolesGuard';
import { Roles } from '@/common/decorators/roles.decorator';

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
  @Roles(['ADMIN', 'CARRIER_COMPANY', "INDEPENDENT_CARRIER"])
  @UseGuards(AuthGuard)
  createOffer(
    @Param('shipmentId') shipmentId: string,
    @Body() body: CreateOfferDTO,
    @Request() req,
  ) {
    const userId = req.user.sub as string;
    return this.offersService.createOffer(userId, shipmentId, body);
  }

  @Post(':offerId/accept')
  @Roles(['MANUFACTURER', 'ADMIN'])
  acceptOffer(
    @Param('offerId') offerId: string,
  ) {
    return this.offersService.acceptOffer(offerId);
  }

  @Post(':offerId/reject')
  @Roles(['MANUFACTURER', 'ADMIN'])
  rejectOffer(
    @Param('offerId') offerId: string,
  ) {
    return this.offersService.rejectOffer(offerId);
  }

  @Delete(':offerId')
  @Roles(['CARRIER_COMPANY', 'INDEPENDENT_CARRIER', 'ADMIN'])
  deleteOffer(@Param('offerId') offerId: string, @Request() req) {
    const userId = req.user.sub as string;
    return this.offersService.deleteOffer(userId, offerId);
  }
}
