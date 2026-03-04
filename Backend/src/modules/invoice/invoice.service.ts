import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Invoice, InvoiceStatus } from '@prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async getInvoices(): Promise<Invoice[]> {
    const invoices = await this.prisma.invoice.findMany();

    if (invoices.length < 1) {
      throw new HttpException('Invoices no found', HttpStatus.NO_CONTENT);
    }

    return invoices;
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        carrier: true,
        company: true,
        shipment: true,
      },
    });

    if (!invoice) {
      throw new HttpException('Invoice not found', HttpStatus.NO_CONTENT);
    }

    return invoice;
  }

  async createInvoice(
    shipmentId,
    {
      companyId,
      carrierId,
      amount,
      platformFee,
      carrierAmount,
    }: CreateInvoiceDTO,
  ): Promise<Invoice> {
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: {
        shipmentId,
      },
    });

    if (existingInvoice) {
      throw new HttpException(
        'Invoice reported successfully',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newInvoice = await this.prisma.invoice.create({
      data: {
        shipmentId,
        companyId,
        carrierId,
        amount,
        platformFee,
        carrierAmount,
      },
    });

    if (!newInvoice) {
      throw new HttpException('Invoice report failed', HttpStatus.BAD_REQUEST);
    }

    return newInvoice;
  }

  async updateInvoice(
    invoiceId: string,
    status: InvoiceStatus,
  ): Promise<Invoice> {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
    });

    if (!invoice) {
      throw new HttpException('Invoice not found', HttpStatus.NO_CONTENT);
    }

    const updateInvoice = await this.prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status,
      },
    });

    if (!updateInvoice) {
      throw new HttpException(
        'Failed to update the invoice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updateInvoice;
  }

  async deleteInvoice(invoiceId: string): Promise<{
    status: HttpStatus;
    message: string;
    deletedInvoice: Invoice;
  }> {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
    });

    if (!invoice) {
      throw new HttpException('Invoice not found', HttpStatus.NO_CONTENT);
    }

    const deleteInvoice = await this.prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });

    if (!deleteInvoice) {
      throw new HttpException(
        'Failed to delete the invoice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Invoice deleted successfully',
      deletedInvoice: deleteInvoice,
    };
  }
}
