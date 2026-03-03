import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@/guards/jwtAuthGuard';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';
import { InvoiceStatus } from '@prisma/client';

@Controller('invoice')
@UseGuards(AuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get(':id')
  getInvoice(@Param('id') invoiceId: string) {
    return this.invoiceService.getInvoice(invoiceId);
  }

  @Get()
  getInvoices() {
    return this.invoiceService.getInvoices();
  }

  @Post(':id')
  createInvoice(
    @Param('id') shipmentId: string,
    @Body() body: CreateInvoiceDTO,
  ) {
    return this.invoiceService.createInvoice(shipmentId, body);
  }

  @Patch(':id')
  updateInvoice(
    @Param('id') invoiceId: string,
    @Body('status') status: InvoiceStatus,
  ) {
    return this.invoiceService.updateInvoice(invoiceId, status);
  }

  @Patch(':id')
  deleteInvoice(@Param('id') invoiceId: string) {
    return this.invoiceService.deleteInvoice(invoiceId);
  }
}
