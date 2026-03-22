import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOfferDTO {
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsOptional()
    proposal: string
}