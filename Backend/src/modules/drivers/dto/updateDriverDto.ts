import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateDriverDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  age?: string;

  @IsOptional()
  @IsString()
  national_id?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
