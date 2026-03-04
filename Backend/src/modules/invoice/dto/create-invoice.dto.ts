import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateInvoiceDTO {
    @IsString()
    @IsNotEmpty()
    companyId: string;

    @IsString()
    @IsNotEmpty()
    carrierId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNumber()
    @IsNotEmpty()
    platformFee: number;

    @IsNumber()
    @IsNotEmpty()
    carrierAmount: number;

    @IsString()
    @IsOptional()
    paymentMethod: string;

    @IsDate()
    @IsOptional()
    paidAt: Date;

    @IsDate()
    @IsOptional()
    releasedAt: Date;
}