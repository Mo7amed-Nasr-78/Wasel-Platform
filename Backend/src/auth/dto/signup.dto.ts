import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(8)
  @Matches(/^[a-zA-Z1-9].*/)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Password length must be at least 8',
  })
  password: string;

  @IsNotEmpty()
  @IsEnum(Role, {
    message: 'Invalid user role',
  })
  role: Role;
}
