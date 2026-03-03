import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Password length must be at least 8',
  })
  password: string;
}
