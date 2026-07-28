import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@/common/guards/jwtAuthGuard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @Get('balance')
  async getBalance(@Req() req) {
    const balance = await this.walletService.getBalance(req.user.sub);
    return { statusCode: HttpStatus.OK, message: 'Balance retrieved', data: { balance } };
  }

  @UseGuards(AuthGuard)
  @Get('transactions')
  async getTransactions(
    @Req() req,
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
  ) {
    const { transactions, total } = await this.walletService.getTransactions(
      req.user.sub,
      parseInt(limit),
      parseInt(offset),
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Transactions retrieved',
      data: { transactions, total },
    };
  }

  @UseGuards(AuthGuard)
  @Post('top-up')
  async topUp(@Req() req, @Body() body: { amount: number; currency?: string }) {
    const result = await this.walletService.topUp(req.user.sub, body.amount, body.currency);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Payment intent created',
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Post('transfer')
  async transfer(
    @Req() req,
    @Body() body: { receiverUserId: string; amount: number },
  ) {
    const result = await this.walletService.transfer(
      req.user.sub,
      body.receiverUserId,
      body.amount,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Transfer completed',
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Post('withdraw')
  async withdraw(@Req() req, @Body() body: { amount: number }) {
    const result = await this.walletService.withdraw(req.user.sub, body.amount);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Withdrawal initiated',
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Post('connect-account')
  async createConnectAccount(@Req() req) {
    const result = await this.walletService.createConnectAccount(
      req.user.sub,
      req.user.email,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Stripe Connect account created',
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Get('connect-account-link')
  async getConnectAccountLink(
    @Req() req,
    @Query('refreshUrl') refreshUrl: string,
    @Query('returnUrl') returnUrl: string,
  ) {
    const result = await this.walletService.getConnectAccountLink(
      req.user.sub,
      refreshUrl,
      returnUrl,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Account link generated',
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':walletId')
  async getWallet(@Param('walletId') walletId: string) {
    const wallet = await this.walletService.getWalletById(walletId);
    return { statusCode: HttpStatus.OK, message: 'Wallet retrieved', data: wallet };
  }
}
