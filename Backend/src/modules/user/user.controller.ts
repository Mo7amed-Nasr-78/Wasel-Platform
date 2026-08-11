import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  Delete,
  Get,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@/common/guards/jwtAuthGuard';
import { ShipmentQueryParams, UserQueryParams } from '@/shared/filters';
import { RolesGuard } from '@/common/guards/rolesGuard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateUserDto';
import { UserAttachments } from '@/shared/interfaces/interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Get('')
  getUsers(@Query() query: UserQueryParams) {
    return this.userService.getUsers(query);
  }

  @Get('/shipments')
  @UseGuards(AuthGuard)
  getUserShipments(@Req() req, @Query() query: ShipmentQueryParams) {
    const { sub, role } = req.user;
    return this.userService.getUserShipments(sub, role, query);
  }

  @Get('/offers')
  @UseGuards(AuthGuard)
  getUserOffers(@Req() req) {
    const { sub, role } = req.user;
    return this.userService.getUserOffers(sub, role);
  }

  @Get('/invoices')
  @UseGuards(AuthGuard)
  getUserInvoices(@Req() req) {
    const { username, role } = req.user;
    return this.userService.getUserInvoices(username, role);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getCurrentUser(@Req() req) {
    const username = req.user.username;
    return this.userService.getUser(username);
  }

  // @UseGuards(AuthGuard)
  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.userService.getUser(username);
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  deleteUser(@Req() req) {
    const userId = req.user.sub as string;
    return this.userService.deleteUser(userId);
  }

  @Patch('update')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'picture', maxCount: 1 },
        { name: 'commercialRegister', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      },
    ),
  )
  updateUser(
    @Body() data: UpdateUserDto,
    @UploadedFiles() files: UserAttachments,
    @Req() req,
  ) {
    const userId = req.user.sub as string;
    return this.userService.updateUser(
      userId,
      data,
      files.picture?.[0],
      files.commercialRegister?.[0],
    );
  }

  @Post(':id/verify')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  verifyProfile(@Param('id') userId: string) {
    return this.userService.verifyProfile(userId);
  }
}
