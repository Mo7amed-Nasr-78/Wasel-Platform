import { BudegtType, PaymentType } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';

export class CreateShipmentDto {
  @IsNotEmpty()
  @IsString()
  origin: string

  @IsOptional()
  @IsNumber()
  origin_lat: number

  @IsOptional()
  @IsNumber()
  origin_lng: number

  @IsNotEmpty()
  @IsString()
  destination: string

  @IsOptional()
  @IsNumber()
  destination_lat: number

  @IsOptional()
  @IsNumber()
  destination_lng: number

  @IsNotEmpty()
  @IsString()
  shipmentType: string

  @IsNotEmpty()
  @IsString()
  goodsType: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsNumber()
  weight: number

  @IsNotEmpty()
  @IsNumber()
  length: number
  
  @IsNotEmpty()
  @IsNumber()
  height: number

  @IsNotEmpty()
  @IsNumber()
  width: number

  @IsOptional()
  @IsBoolean()
  stacking: boolean

  @IsNotEmpty()
  @IsString()
  packaging: string

  @IsNotEmpty()
  @IsString()
  pickupAt: string

  @IsNotEmpty()
  @IsString()
  deliveryAt: string

  @IsNotEmpty()
  @IsString()
  ETA: string

  @IsNotEmpty()
  @IsString()
  distance: string

  @IsOptional()
  @IsBoolean()
  urgent: boolean

  @IsOptional()
  @IsBoolean()
  additionalInsurance: boolean

  @IsOptional()
  @IsBoolean()
  twoDrivers: boolean

  @IsOptional()
  @IsBoolean()
  noFriday: boolean

  @IsNotEmpty()
  @IsEnum(BudegtType)
  budgetType: BudegtType

  @IsOptional()
  @IsNumber()
  suggestedBudget: number

  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentType: PaymentType
}
