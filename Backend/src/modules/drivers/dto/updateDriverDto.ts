import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateDriverDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsString()
  national_id?: string;
}
