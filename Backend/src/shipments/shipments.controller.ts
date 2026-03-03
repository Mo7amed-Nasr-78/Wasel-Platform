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
  UploadedFile
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { AuthGuard } from '@/guards/jwtAuthGuard';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '@/guards/rolesGuard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}
  
  @Get(':shipmentId/offers')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['MANUFACTURER', 'ADMIN', 'CARRIER_COMPANY', 'INDEPENDENT_CARRIER'])
  getShipmentsOffers(@Param('shipmentId') shipmentId: string, @Request() req) {
    const profileId = req.user.profileID as string;
    return this.shipmentsService.getShipmentOffers(profileId, shipmentId);
  }
  
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['MANUFACTURER', 'ADMIN'])
  getShipment(@Param('id') shipmentId: string) {
    return this.shipmentsService.getShipment(shipmentId);
  }
  
  @Get()
  // @Roles(['ADMIN'])
  getShipments() {
    return this.shipmentsService.getShipments();
  }
  
  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['MANUFACTURER', 'ADMIN'])
  @UseInterceptors(FileFieldsInterceptor([
    { name: "shipmentImgs", maxCount: 3 },
    { name: "shipmentDocs", maxCount: 3 }
  ], {
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  createShipment(@Body() body, @Request() req, @UploadedFiles() shipmentAssets: { shipmentImgs: Express.Multer.File[], shipmentDocs: Express.Multer.File[] }) {
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
}
