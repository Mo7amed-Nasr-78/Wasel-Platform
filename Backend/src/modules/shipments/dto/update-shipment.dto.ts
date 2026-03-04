import { PartialType } from '@nestjs/mapped-types';
import { CreateShipmentDto } from './create-shipment.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {
    origin?: string;
    origin_lat?: number;
    origin_lng?: number;
    destination?: string;
    destination_lat?: number;
    destination_lng?: number;

    @IsOptional()
    @IsString()
    status: string;
}
