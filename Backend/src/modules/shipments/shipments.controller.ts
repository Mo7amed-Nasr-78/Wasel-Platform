import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Request,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { AuthGuard } from '@/common/guards/jwtAuthGuard';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/rolesGuard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ShipmentAttachments } from '@/shared/interfaces/interfaces';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get(':shipmentId/offers')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['MANUFACTURER', 'ADMIN', 'CARRIER_COMPANY', 'INDEPENDENT_CARRIER'])
  getShipmentsOffers(@Param('shipmentId') shipmentId: string, @Request() req) {
    const user = req.user;
    return this.shipmentsService.getShipmentOffers(user, shipmentId);
  }

  @Get(':id')
  getShipment(@Param('id') shipmentId: string) {
    return this.shipmentsService.getShipment(shipmentId);
  }

  @Get()
  getShipments(
    @Query()
    query: {
      search: string;
      type: string;
      status: string | string[];
      goodsType: string;
      packaging: string;
      budgetType: string;
      paymentType: string;
      minWeight: number | undefined;
      maxWeight: number | undefined;
      minLength: number | undefined;
      maxLength: number | undefined;
      minWidth: number | undefined;
      maxWidth: number | undefined;
      minHeight: number | undefined;
      maxHeight: number | undefined;
      pickupAt: string;
      deliveryAt: string;
      urgent: boolean;
      stacking: boolean;
      additionalInsurance: boolean;
      twoDrivers: boolean;
      noFriday: boolean;
      page: number | undefined;
        limit: number | undefined;
      sortBy: string;
      sortOrder: string;
    },
  ) {
    return this.shipmentsService.getShipments(query);
  }

  @Post('create')
  @Roles(['MANUFACTURER', 'ADMIN'])
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'shipmentImgs', maxCount: 3 },
        { name: 'shipmentDocs', maxCount: 3 },
      ],
      {
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  createShipment(
    @Body() body,
    @Request() req,
    @UploadedFiles()
    shipmentAssets: ShipmentAttachments,
  ) {
    const userId = req.user.sub as string;
    const data: CreateShipmentDto = JSON.parse(body.data);
    return this.shipmentsService.createShipment(userId, data, shipmentAssets);
  }

  @Delete(':id/delete')
  @Roles(['MANUFACTURER', 'ADMIN'])
  deleteShipment(@Param('id') shpimentId: string, @Request() req) {
    const userId = req.user.sub as string;
    return this.shipmentsService.deleteShipment(shpimentId, userId);
  }

  @Patch(':id/update')
  @Roles(['MANUFACTURER', 'ADMIN'])
  updateShipment(
    @Param('id') shipmentId: string,
    @Body() body: UpdateShipmentDto,
  ) {
    return this.shipmentsService.updateShipment(shipmentId, body);
  }

  @Patch(':id/deliver')
  @Roles(['CARRIER_COMPANY', 'INDEPENDENT_CARRIER'])
  @UseGuards(AuthGuard, RolesGuard)
  deliverShipment(@Param('id') shipmentId: string, @Request() req) {
    const user = req.user;
    return this.shipmentsService.deliverShipment(user, shipmentId);
  }

  @Post(':id/assign')
  @Roles(['CARRIER_COMPANY'])
  @UseGuards(AuthGuard, RolesGuard)
  assignDriverAndTruck(
    @Param('id') shipmentId: string,
    @Body() body: { driverId: string; truckId: string },
    @Request() req,
  ) {
    const user = req.user;
    const { driverId, truckId } = body;
    return this.shipmentsService.assignDriverAndTruck(
      user,
      shipmentId,
      driverId,
      truckId,
    );
  }
}
