import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Delete,
  Put,
} from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { AuthGuard } from '@/common/guards/jwtAuthGuard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AddTruckDto } from './dto/addTruckDto';
import { UpdateTruckDto } from './dto/updateTruckDto';
import { TruckAttachments } from '@/shared/interfaces/interfaces';
import { Roles } from '@/common/decorators/roles.decorator';

@Roles(['CARRIER_COMPANY'])
@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Get()
  @UseGuards(AuthGuard)
  getTrucks(@Req() req) {
    const { sub, role } = req.user;
    return this.trucksService.getTrucks(sub, role);
  }

  @Get(':truckId')
  @UseGuards(AuthGuard)
  getTruck(@Req() req, @Param('truckId') truckId: string) {
    const { sub } = req.user;
    return this.trucksService.getTrucks(sub, truckId);
  }

  @Post('add')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'truck_license_front', maxCount: 1 },
        { name: 'truck_license_back', maxCount: 1 },
        { name: 'truck_front', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      },
    ),
  )
  addTruck(
    @Body() data: AddTruckDto,
    @UploadedFiles()
    truckAttachments: TruckAttachments,
    @Req() req,
  ) {
    const user = req.user;
    return this.trucksService.addTruck(user, data, truckAttachments);
  }

  @Delete(':truckId')
  @UseGuards(AuthGuard)
  deleteTruck(@Param('truckId') truckId: string, @Req() req) {
    const user = req.user;
    return this.trucksService.deleteTruck(user, truckId);
  }

  @Put(':truckId')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'truck_license_front', maxCount: 1 },
        { name: 'truck_license_back', maxCount: 1 },
        { name: 'truck_front', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      },
    ),
  )
  updateTruck(
    @Param('truckId') truckId: string,
    @Body() data: UpdateTruckDto,
    @UploadedFiles()
    truckAttachments: TruckAttachments,
    @Req() req,
  ) {
    const user = req.user;
    return this.trucksService.updateTruck(
      user,
      truckId,
      data,
      truckAttachments,
    );
  }
}
