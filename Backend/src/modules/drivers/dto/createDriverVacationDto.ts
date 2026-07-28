import { IsNotEmpty, IsString } from "class-validator";

export class createDriverVacationDto {
    @IsString()
    @IsNotEmpty()
    from_date: string

    @IsString()
    @IsNotEmpty()
    to_date: string
}