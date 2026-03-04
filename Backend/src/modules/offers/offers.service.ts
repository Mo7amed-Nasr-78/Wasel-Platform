import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { Offer, OfferStatus } from '@prisma/client';
import { CreateOfferDTO } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOffer(profileId: string, offerId: string): Promise<Offer> {
    const offer = await this.prisma.offer.findUnique({
      where: {
        id: offerId,
        profileId,
      },
    });

    if (!offer) {
      throw new HttpException('Offer not found', HttpStatus.BAD_REQUEST);
    }

    return offer;
  }

  async getOffers(): Promise<Offer[]> {
    const offers = await this.prisma.offer.findMany();

    if (offers.length < 1) {
      throw new HttpException('Offers not found', HttpStatus.NOT_FOUND);
    }

    return offers;
  }

  async createOffer(
    profileId,
    shipmentId,
    { price }: CreateOfferDTO,
  ): Promise<{
    status: HttpStatus;
    message: string;
    newOffer: Offer;
  }> {
    // const newOffer = await this.prisma.offer.create({
    //   data: {
    //     price,
    //     shipmentId,
    //     profileId,
    //   }
    // });
    const newOffer = await this.prisma.offer.findUnique({
      where: {
        id: '123',
      },
    });

    if (!newOffer) {
      throw new HttpException(
        'Failed send your offer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Offer sent successfully',
      newOffer,
    };
  }

  async deleteOffer(
    profileId: string,
    offerId: string,
  ): Promise<{
    status: HttpStatus;
    message: string;
    deletedOffer: Offer;
  }> {
    const offer = await this.prisma.offer.findUnique({
      where: {
        id: offerId,
        profileId,
        status: OfferStatus.PENDING,
      },
    });

    if (offer && offer.status !== OfferStatus.PENDING) {
      throw new HttpException(
        `Can\'t handle that request cuase offer it's ${offer.status}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!offer) {
      throw new HttpException('Offer not found', HttpStatus.NO_CONTENT);
    }

    const deleteOffer = await this.prisma.offer.delete({
      where: {
        id: offerId,
        profileId,
      },
    });

    return {
      status: HttpStatus.OK,
      message: 'Offer cancelled successfully',
      deletedOffer: deleteOffer,
    };
  }

  async updateOffer(offerId: string, status: string): Promise<Offer> {
    if (!OfferStatus[status]) {
      throw new HttpException('Invalid offer status', HttpStatus.BAD_REQUEST);
    }

    const offer = await this.prisma.offer.findUnique({
      where: {
        id: offerId,
        status: OfferStatus.PENDING,
      },
    });

    if (!offer) {
      throw new HttpException('Offer not found', HttpStatus.BAD_REQUEST);
    }

    const updateOffer = await this.prisma.offer.update({
      where: {
        id: offerId,
      },
      data: {
        status: OfferStatus[status],
      },
    });

    return updateOffer;
  }
}
