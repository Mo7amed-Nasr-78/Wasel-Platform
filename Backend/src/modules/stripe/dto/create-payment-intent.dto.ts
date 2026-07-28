import { IsNotEmpty, IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>;
}
