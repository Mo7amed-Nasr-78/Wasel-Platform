import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateAddressDTO } from './dto/create-address.dto';
import { Address } from '@prisma/client';
import { UpdateAddressDTO } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async getAddress(addressId: string): Promise<Address> {
    const address = await this.prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NO_CONTENT);
    }

    return address;
  }

  async getAddresses(): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany();

    if (addresses.length < 1) {
      throw new HttpException('Addresses no found', HttpStatus.NO_CONTENT);
    }

    return addresses;
  }

  async newAddress(
    profileId,
    { city, state, country }: CreateAddressDTO,
  ): Promise<Address> {
    const existingAddress = await this.prisma.address.findMany({
      where: {
        city,
        state,
        country,
      },
    });

    if (existingAddress.length > 0) {
      throw new HttpException(
        'Address already existed',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newAddress = await this.prisma.address.create({
      data: {
        city,
        state,
        country,
        profileId,
      },
    });

    if (!newAddress) {
      throw new HttpException(
        'Failed to add the new address',
        HttpStatus.BAD_REQUEST,
      );
    }

    return newAddress;
  }

  async updateAddress(
    addressId: string,
    body: UpdateAddressDTO,
  ): Promise<{
    statusCode: HttpStatus;
    message: string;
    updatedAddress: Address;
  }> {
    console.log(body);
    const updateObject = {};
    for (const [key, value] of Object.entries(body)) {
      if (!value) continue;
      updateObject[key] = value;
    }

    const address = await this.prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NO_CONTENT);
    }

    const updateAddress = await this.prisma.address.update({
      where: {
        id: addressId,
      },
      data: updateObject,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Address updated successfully',
      updatedAddress: updateAddress,
    };
  }

  async deleteAddress(addressId): Promise<{
    statusCode: HttpStatus;
    message: string;
    deletedAddress: Address;
  }> {
    const address = await this.prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NO_CONTENT);
    }

    const deleteAddress = await this.prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Address deleted successfully',
      deletedAddress: deleteAddress,
    };
  }
}
