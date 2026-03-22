import { IsEmail, IsString, MinLength } from 'class-validator';

export class OtpVerificationDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Invalid OTP',
  })
  otp: string;
}
