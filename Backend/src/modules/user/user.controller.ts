import { Controller, Param, Delete, Get, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@/common/guards/jwtAuthGuard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/shipments')
  @UseGuards(AuthGuard)
  getUserShipments(
    @Req() req,
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
}
