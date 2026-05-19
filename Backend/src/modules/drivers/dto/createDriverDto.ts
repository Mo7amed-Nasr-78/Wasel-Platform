import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @IsNotEmpty()
  @IsString()
  national_id: string;
}
