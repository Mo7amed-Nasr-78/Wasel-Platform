import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOfferDTO {
    @IsNumber()
    @IsNotEmpty()
    price: number;
}