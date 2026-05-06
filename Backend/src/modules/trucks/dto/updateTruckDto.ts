import { IsOptional, IsString } from 'class-validator';

export class UpdateTruckDto {
  @IsOptional()
  @IsString()
  truck_num?: string;

  @IsOptional()
  @IsString()
  truck_type?: string;

  @IsOptional()
  @IsString()
  truck_model?: string;
}
