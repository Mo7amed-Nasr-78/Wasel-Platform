import {
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Controller,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDTO } from './dto/create-address.dto';
import { AuthGuard } from '@/guards/jwtAuthGuard';
import { UpdateAddressDTO } from './dto/update-address.dto';
import { RolesGuard } from '@/guards/rolesGuard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('address')
@UseGuards(AuthGuard, RolesGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @Roles(['ADMIN'])
  getAddresses() {
    return this.addressService.getAddresses();
  }

  @Get(':id')
  getAddress(@Param('id') addressId: string) {
    return this.addressService.getAddress(addressId);
  }

  @Post()
  @Roles(['ADMIN', 'MANUFACTURER'])
  @UseGuards(AuthGuard, RolesGuard)
  newAddress(@Body() body: CreateAddressDTO, @Request() req) {
    const profileId = req.user.profileID;
    return this.addressService.newAddress(profileId, body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateAddress(
    @Param('id') addressId: string,
    @Body() body: UpdateAddressDTO,
  ) {
    return this.addressService.updateAddress(addressId, body);
  }

  @Delete(':id')
  deleteAddress(@Param('id') addressId: string) {
    return this.addressService.deleteAddress(addressId);
  }
}
