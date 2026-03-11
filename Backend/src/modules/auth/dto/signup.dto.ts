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
  @Matches(/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9-_]$/, {
      message: "Invalid username use letters & { -, _ }"
  })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role, {
    message: 'Invalid user role',
  })
  role: Role;
}
