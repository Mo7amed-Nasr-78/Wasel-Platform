import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Offer,
  Role,
  Shipment,
  ShipmentStatus,
  DriverStatus,
  TruckStatus,
  VerificationStatus,
} from '@prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { R2Service } from '@/shared/services/r2/r2.service';
import Multer from 'multer';
import { ShipmentAttachments } from '@/shared/interfaces/interfaces';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly R2Service: R2Service,
  ) {}

  async getShipment(shipmentId: string): Promise<Shipment> {
    const shipment = await this.prisma.shipment.findUnique({
      where: {
        id: shipmentId,
      },
      include: {
        profile: true,
        attachments: true,
        acceptedOffer: {
          include: {
            profile: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    if (!shipment) {
      throw new HttpException('Shipment not found', HttpStatus.NO_CONTENT);
    }

    return shipment;
  }

  async getShipments(query): Promise<{
    total: number;
    shipments: Shipment[];
  }> {
    const {
      type,
      status,
      goodsType,
      packaging,
      budgetType,
      paymentType,
      minWeight,
      maxWeight,
      minLength,
      maxLength,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      pickupAt,
      deliveryAt,
      urgent,
      stacking,
      additionalInsurance,
      twoDrivers,
      noFriday,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    } = query;

    const where = {
      ...(type ? { shipmentType: type } : {}),
      ...(status
        ? {
            status: {
              in: Array.isArray(status)
                ? status
                : status.split(',').map((s) => s.trim()),
            },
          }
        : {}),
      ...(goodsType ? { goodsType } : {}),
      ...(packaging ? { packaging } : {}),
      ...(budgetType ? { budgetType } : {}),
      ...(paymentType ? { paymentType } : {}),
      ...(urgent? { urgent: true } : {}),
      ...(stacking? { stacking: true } : {}),
      ...(additionalInsurance? { additionalInsurance: true } : {}),
      ...(twoDrivers? { twoDrivers: true } : {}),
      ...(noFriday ? { noFriday: true } : {}),
      ...(!isNaN(Number(minWeight)) && !isNaN(Number(maxWeight))
        ? {
            AND: [
              { weight: { gt: Number(minWeight) } },
              { weight: { lte: Number(maxWeight) } },
            ],
          }
        : {}),
      ...(!isNaN(Number(minLength)) && !isNaN(Number(maxLength))
        ? {
            AND: [
              { length: { gt: Number(minLength) } },
              { length: { lte: Number(maxLength) } },
            ],
          }
        : {}),
      ...(!isNaN(Number(minWidth)) && !isNaN(Number(maxWidth))
        ? {
            AND: [
              { width: { gt: Number(minWidth) } },
              { width: { lte: Number(maxWidth) } },
            ],
          }
        : {}),
      ...(!isNaN(Number(minHeight)) && !isNaN(Number(maxHeight))
        ? {
            AND: [
              { height: { gt: Number(minHeight) } },
              { height: { lte: Number(maxHeight) } },
            ],
          }
        : {}),
      ...(pickupAt
        ? {
            pickupAt: {
              gte: new Date(`${pickupAt}T00:00:00.000Z`),
              lte: new Date(`${pickupAt}T23:59:59.999Z`),
            },
          }
        : {}),
      ...(deliveryAt
        ? {
            deliveryAt: {
              gte: new Date(`${deliveryAt}T00:00:00.000Z`),
              lte: new Date(`${deliveryAt}T23:59:59.999Z`),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { origin: { contains: search } },
              { destination: { contains: search } },
            ],
          }
        : {}),
    };

    const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;
    const take = limit ? Number(limit) : undefined;

    const orderBy = sortBy
      ? { [sortBy]: sortOrder === 'asc' ? 'asc' as const : 'desc' as const }
      : { createAt: 'desc' as const };

    const [shipments, total] = await this.prisma.$transaction([
      this.prisma.shipment.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          attachments: {
            select: {
              attachmentType: true,
              url: true,
            },
          },
          profile: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      this.prisma.shipment.count({ where }),
    ]);

    if (shipments.length < 1) {
      throw new HttpException('Shipments not found', HttpStatus.NO_CONTENT);
    }

    return {
      total,
      shipments,
    };
  }

  async getShipmentOffers(user, shipmentId): Promise<Offer[]> {
    const userId = user.sub;
    const role = user.role;

    let offers = [];

    if (role === Role.CARRIER_COMPANY || role === Role.INDEPENDENT_CARRIER) {
      const res = await this.prisma.offer.findMany({
        where: {
          shipmentId,
          profile: {
            userId,
          },
        },
        include: {
          profile: {
            select: {
              username: true,
              first_name: true,
              last_name: true,
              picture: true,
            },
          },
          shipment: true,
        },
      });

      offers = res;
    }

    if (role === Role.MANUFACTURER || role === Role.ADMIN) {
      const res = await this.prisma.offer.findMany({
        where: {
          shipmentId,
        },
        include: {
          profile: {
            select: {
              username: true,
              first_name: true,
              last_name: true,
              picture: true,
            },
          },
          shipment: true,
        },
      });

      offers = res;
    }

    if (offers.length < 1) {
      throw new HttpException(
        'Shipment has no offers yet',
        HttpStatus.NO_CONTENT,
      );
    }

    return offers;
  }

  async createShipment(
    userId,
    data: CreateShipmentDto,
    shipmentAttachments: ShipmentAttachments,
  ) {
    const userProfile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (userProfile.role !== Role.MANUFACTURER) {
      throw new HttpException(
        'Failed to post the shipment',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const { shipmentImgs, shipmentDocs } = shipmentAttachments;
    if (shipmentImgs.length < 1 || shipmentDocs.length < 1) {
      throw new HttpException(
        "Shipment's docs or imgs are not found",
        HttpStatus.BAD_REQUEST,
      );
    }

    const shipmentId =
      'load#' + (Math.floor(Math.random() * 1000000000) + 1000000000);

    const {
      origin,
      origin_lat,
      origin_lng,
      destination,
      destination_lat,
      destination_lng,
      goodsType,
      shipmentType,
      description,
      packaging,
      width,
      length,
      height,
      weight,
      pickupAt,
      deliveryAt,
      stacking,
      urgent,
      twoDrivers,
      additionalInsurance,
      noFriday,
      budgetType,
      paymentType,
      suggestedBudget,
      ETA,
      distance,
    } = data;

    const newShipment = await this.prisma.shipment.create({
      data: {
        shipmentId,
        origin,
        origin_lat: origin_lat ? origin_lat : 0,
        origin_lng: origin_lng ? origin_lng : 0,
        destination,
        destination_lat: destination_lat ? destination_lat : 0,
        destination_lng: destination_lng ? destination_lng : 0,
        goodsType,
        shipmentType,
        description,
        packaging,
        width,
        length,
        height,
        weight,
        pickupAt,
        deliveryAt,
        stacking,
        urgent,
        twoDrivers,
        additionalInsurance,
        noFriday,
        budgetType,
        paymentType,
        suggestedBudget,
        offerCount: 0,
        ETA,
        distance,
        profile: {
          connect: {
            id: userProfile.id,
          },
        },
      },
    });

    for (const file of shipmentAttachments.shipmentImgs) {
      const type = file.mimetype.split('/')[0];
      const name = file.originalname
        .split('.')
        .slice(0, file.originalname.split('.').length - 1)
        .join('.');
      const extension = file.originalname
        .split('.')
        .splice(file.originalname.split('.').length - 1, 1)[0];
      const size = (file.size / 1024 / 1024).toFixed(2); // MB
      const imageUrl = await this.R2Service.uploadFile(
        file,
        `users/${userId}/shipments/images/${Date.now()}-${file.originalname}`,
      );
      await this.prisma.shipmentAttachment.create({
        data: {
          attachmentType: type === 'image' ? 'Image' : 'File',
          url: imageUrl,
          name,
          extension,
          size: `${size} MB`,
          shipment: {
            connect: {
              id: newShipment.id,
            },
          },
        },
      });
    }

    for (const file of shipmentAttachments.shipmentDocs) {
      const type = file.mimetype.split('/')[0];
      const name = file.originalname
        .split('.')
        .slice(0, file.originalname.split('.').length - 1)
        .join('.');
      const extension = file.originalname
        .split('.')
        .splice(file.originalname.split('.').length - 1, 1)[0];
      const size = (file.size / 1024 / 1024).toFixed(2); // MB
      const docUrl = await this.R2Service.uploadFile(
        file,
        `users/${userId}/shipments/docs/${Date.now()}-${file.originalname}`,
      );
      await this.prisma.shipmentAttachment.create({
        data: {
          attachmentType: type === 'image' ? 'Image' : 'File',
          url: docUrl,
          name,
          extension,
          size: `${size} MB`,
          shipment: {
            connect: {
              id: newShipment.id,
            },
          },
        },
      });
    }

    return {
      status: 201,
      message: 'Shipment posted successfully',
    };
  }

  async deleteShipment(
    shipmentId: string,
    userId: string,
  ): Promise<{
    status: HttpStatus;
    message: string;
    deletedShipment: Shipment;
  }> {
    const userProfile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        shipments: {
          where: {
            id: shipmentId,
          },
        },
      },
    });

    if (userProfile.shipments.length < 1) {
      throw new HttpException('Shipment not found', HttpStatus.BAD_REQUEST);
    }

    const deleteShipment = await this.prisma.shipment.delete({
      where: {
        id: shipmentId,
      },
    });

    if (!deleteShipment) {
      throw new HttpException(
        'Failed to delete the shipment',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      status: 200,
      message: 'Shipment deleted successfully',
      deletedShipment: deleteShipment,
    };
  }

  async updateShipment(
    shipmentId: string,
    body: UpdateShipmentDto,
  ): Promise<{
    status: HttpStatus;
    message: string;
    updatedShipment: Shipment;
  }> {
    const updateObject = {};
    for (const [key, value] of Object.entries(body)) {
      if (!value) continue;
      updateObject[key] = value;
    }

    if (body.status && !ShipmentStatus[body.status]) {
      throw new HttpException(
        'Invalid shipment status',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateShipment = await this.prisma.shipment.update({
      where: {
        id: shipmentId,
      },
      data: updateObject,
    });

    if (!updateShipment) {
      throw new HttpException('Shipment not found', HttpStatus.BAD_REQUEST);
    }

    return {
      status: 200,
      message: 'Shipment updated successfully',
      updatedShipment: updateShipment,
    };
  }

  async deliverShipment(user, shipmentId: string) {
    const userId = user.sub;

    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true, role: true },
    });

    if (
      !userProfile ||
      (userProfile.role !== Role.CARRIER_COMPANY &&
        userProfile.role !== Role.INDEPENDENT_CARRIER)
    ) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        acceptedOffer: {
          include: { profile: { select: { id: true } } },
        },
      },
    });

    if (!shipment) {
      throw new HttpException('Shipment not found', HttpStatus.NOT_FOUND);
    }

    if (shipment.status !== ShipmentStatus.IN_TRANSIT) {
      throw new HttpException(
        'Shipment is not in transit',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!shipment.acceptedOffer) {
      throw new HttpException(
        'No accepted offer for this shipment',
        HttpStatus.BAD_REQUEST,
      );
    }

    const acceptedOfferProfileId = shipment.acceptedOffer.profile.id;
    if (acceptedOfferProfileId !== userProfile.id) {
      throw new HttpException(
        'You are not authorized to deliver this shipment',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedShipment = await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: ShipmentStatus.DELIVERED },
    });

    return {
      status: 200,
      message: 'Shipment delivered successfully',
      shipment: updatedShipment,
    };
  }

  async assignDriverAndTruck(
    user,
    shipmentId: string,
    driverId: string,
    truckId: string,
  ) {
    const userId = user.sub;

    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true, role: true },
    });

    if (!userProfile || userProfile.role !== Role.CARRIER_COMPANY) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        acceptedOffer: {
          include: { profile: { select: { id: true, userId: true } } },
        },
      },
    });

    if (!shipment) {
      throw new HttpException('Shipment not found', HttpStatus.NOT_FOUND);
    }

    if (shipment.status !== ShipmentStatus.IN_PROGRESS) {
      throw new HttpException(
        'Shipment is not in progress',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!shipment.acceptedOffer) {
      throw new HttpException(
        'No accepted offer for this shipment',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Ensure the caller is the carrier whose offer was accepted
    const acceptedOfferProfileId = shipment.acceptedOffer.profile.id;
    if (acceptedOfferProfileId !== userProfile.id) {
      throw new HttpException(
        'You are not authorized to assign assets to this shipment',
        HttpStatus.FORBIDDEN,
      );
    }

    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
    }

    if (driver.profileId !== userProfile.id) {
      throw new HttpException(
        'Driver does not belong to your company',
        HttpStatus.FORBIDDEN,
      );
    }

    if (driver.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new HttpException(
        'Driver is not verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (driver.status !== DriverStatus.AVAILABLE) {
      throw new HttpException(
        'Driver is not available',
        HttpStatus.BAD_REQUEST,
      );
    }

    const truck = await this.prisma.truck.findUnique({
      where: { id: truckId },
    });

    if (!truck) {
      throw new HttpException('Truck not found', HttpStatus.NOT_FOUND);
    }

    if (truck.profileId !== userProfile.id) {
      throw new HttpException(
        'Truck does not belong to your company',
        HttpStatus.FORBIDDEN,
      );
    }

    if (truck.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new HttpException('Truck is not verified', HttpStatus.BAD_REQUEST);
    }

    if (truck.status !== TruckStatus.ACTIVE) {
      throw new HttpException('Truck is not available', HttpStatus.BAD_REQUEST);
    }

    // Perform updates in a transaction
    const [updatedShipment] = await this.prisma.$transaction([
      this.prisma.shipment.update({
        where: { id: shipmentId },
        data: {
          assignedDriver: { connect: { id: driverId } },
          assignedTruck: { connect: { id: truckId } },
          status: ShipmentStatus.IN_TRANSIT,
        },
      }),
      this.prisma.driver.update({
        where: { id: driverId },
        data: { status: DriverStatus.IN_WORK },
      }),
      this.prisma.truck.update({
        where: { id: truckId },
        data: { status: TruckStatus.IN_WORK },
      }),
    ]);

    return {
      status: 200,
      message: 'Driver and truck assigned, shipment moved to in_transit',
      shipment: updatedShipment,
    };
  }
}
