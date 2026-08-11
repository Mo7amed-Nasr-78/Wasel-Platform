import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import {
  Invoice,
  Offer,
  Profile,
  Role,
  Shipment,
  ShipmentStatus,
  User,
} from '@prisma/client';
import {
  buildShipmentFilter,
  ShipmentQueryParams,
  buildUserFilter,
  UserQueryParams,
} from '@/shared/filters';
import { R2Service } from '@/shared/services/r2/r2.service';
import { UpdateUserDto } from './dto/updateUserDto';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  private getR2KeyFromUrl(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      return pathname.replace(/^\/+/, '');
    } catch {
      return '';
    }
  }

  async getUsers(query: UserQueryParams): Promise<User[]> {
    const { where, orderBy, skip, take } = buildUserFilter(query);

    const users = await this.prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        profile: true,
      },
    });

    if (users.length < 1) {
      throw new HttpException('No Users Found', HttpStatus.NO_CONTENT);
    }

    return users;
  }

  async verifyProfile(userId: string): Promise<Profile> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    if (!user?.profile) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.profile.update({
      where: {
        id: user.profile.id,
      },
      data: {
        verify: true,
      },
    });
  }

  async updateUser(
    userId: string,
    data: UpdateUserDto,
    picture?: Express.Multer.File,
    commercialRegister?: Express.Multer.File,
  ): Promise<{
    status: HttpStatus.OK,
    message: string,
    profile: Profile,
  }> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    if (!user?.profile) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    let pictureUrl: string | undefined;
    let pictureOldKey: string | undefined;

    if (picture) {
      const ext = path.extname(picture.originalname);
      pictureUrl = await this.r2.uploadFile(
        picture,
        `users/${userId}/profile/${Date.now()}-picture${ext}`,
      );
      pictureOldKey = this.getR2KeyFromUrl(user.profile.picture);
    }

    let commercialRegisterUrl: string | undefined;
    let commercialRegisterOldKey: string | undefined;

    if (commercialRegister) {
      const ext = path.extname(commercialRegister.originalname);
      commercialRegisterUrl = await this.r2.uploadFile(
        commercialRegister,
        `users/${userId}/profile/${Date.now()}-commercialRegister${ext}`,
      );
      commercialRegisterOldKey = this.getR2KeyFromUrl(
        user.profile.commercialRegister,
      );
    }

    const updatedProfile = await this.prisma.profile.update({
      where: {
        id: user.profile.id,
      },
      data: {
        ...data,
        ...(pictureUrl ? { picture: pictureUrl } : {}),
        ...(commercialRegisterUrl
          ? { commercialRegister: commercialRegisterUrl }
          : {}),
      },
    });

    if (pictureOldKey) {
      await this.r2.deleteFile(pictureOldKey);
    }

    if (commercialRegisterOldKey) {
      await this.r2.deleteFile(commercialRegisterOldKey);
    }

    return {
      status: HttpStatus.OK,
      message: "Profile has been updated successfully",
      profile: updatedProfile
    };
  }

  async getUser(username: string): Promise<
    Profile & {
      stats: {
        total_shipments: number;
        pending_shipments: number;
        completed_shipments: number;
        rate: number;
      };
    }
  > {
    const profile = await this.prisma.profile.findUnique({
      where: {
        username,
      },
    });

    if (!profile) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const shipmentsCount = await this.prisma.shipment.count();
    const pendingShipmentsCount = await this.prisma.shipment.count({
      where: {
        status: ShipmentStatus.PENDING,
      },
    });
    const comShipmentsCount = await this.prisma.shipment.count({
      where: {
        status: ShipmentStatus.DELAYED,
      },
    });

    return {
      ...profile,
      stats: {
        total_shipments: shipmentsCount,
        pending_shipments: pendingShipmentsCount,
        completed_shipments: comShipmentsCount,
        rate: 0,
      },
    };
  }

  async getUserShipments(
    userId: string,
    role: Role,
    query?: ShipmentQueryParams,
  ): Promise<Shipment[] | HttpException> {
    const {
      where: baseWhere,
      orderBy,
      skip,
      take,
    } = buildShipmentFilter(query || {});

    let res = [];

    if (Role.MANUFACTURER.includes(role)) {
      const shipments = await this.prisma.shipment.findMany({
        where: { ...baseWhere, profile: { userId } },
        orderBy,
        skip,
        take,
      });

      res = shipments;
    }

    if (
      Role.CARRIER_COMPANY.includes(role) ||
      Role.INDEPENDENT_CARRIER.includes(role)
    ) {
      const shipments = await this.prisma.shipment.findMany({
        where: { ...baseWhere, acceptedOffer: { profile: { userId } } },
        orderBy,
        skip,
        take,
        include: {
          acceptedOffer: {
            select: {
              id: true,
              price: true,
              proposal: true,
              createdAt: true,
            },
          },
        },
      });

      res = shipments;
    }

    if (Role.ADMIN.includes(role)) {
      const shipments = await this.prisma.shipment.findMany({
        where: baseWhere,
        orderBy,
        skip,
        take,
      });

      res = shipments;
    }

    if (res.length === 0) {
      throw new HttpException('No shipments found', HttpStatus.NO_CONTENT);
    }

    return res;
  }

  async getUserOffers(
    userId: string,
    role: Role,
  ): Promise<Offer[] | HttpException> {
    // "ADMIN" | "MANUFACTURER" | "CARRIER_COMPANY" | "INDEPENDENT_CARRIER"
    let res = [];

    if (['CARRIER_COMPANY', 'INDEPENDENT_CARRIER'].includes(role)) {
      const offers = await this.prisma.offer.findMany({
        where: {
          profile: {
            userId,
          },
        },
      });

      if (offers.length < 1) {
        throw new HttpException('Offers not found', HttpStatus.NO_CONTENT);
      }

      res = offers;
    }

    if (role.includes('MANUFACTURER')) {
      const offers = await this.prisma.offer.findMany({
        where: {
          shipment: {
            profile: {
              userId,
            },
          },
        },
      });

      if (offers.length < 1) {
        throw new HttpException('Offers not found', HttpStatus.NO_CONTENT);
      }

      res = offers;
    }

    if (role.includes('ADMIN')) {
      const offers = await this.prisma.offer.findMany({});

      if (offers.length < 1) {
        throw new HttpException('Offers not found', HttpStatus.NO_CONTENT);
      }

      res = offers;
    }

    return res;
  }

  async getUserInvoices(username: string, role: string): Promise<Invoice[]> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    const invoices = await this.prisma.invoice.findMany({
      where: {
        ...(role.includes('INDEPENDENT_CARRIER')
          ? { carrierId: profile.id }
          : {}),
        ...(role.includes('MANUFACTURER') ? { companyId: profile.id } : {}),
      },
      include: {
        shipment: true,
      },
    });

    if (!invoices.length) {
      throw new HttpException('Invoices not found', HttpStatus.NOT_FOUND);
    }

    return invoices;
  }

  async deleteUser(userId: string): Promise<{
    statusCode: number;
    message: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
      include: {
        profile: {
          include: {
            offers: true,
            shipments: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: 'account deleted successfully',
    };
  }
}
