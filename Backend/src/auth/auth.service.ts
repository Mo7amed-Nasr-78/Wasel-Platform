import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SendMail } from 'src/utils/Nodemailer';
import { OtpGenerator } from 'src/utils/OtpGenerator';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ username, role, email, password }: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

    if (!existingUser) {
      const userProfile = await this.prisma.profile.findUnique({
        where: {
          username,
        },
      });

      if (userProfile && userProfile.username === username) {
        throw new HttpException(
          'Username already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            username,
            role,
            picture:
              'https://res.cloudinary.com/de5sekaom/image/upload/v1755117756/default-profile-img_f7br6d.jpg',
          },
        },
      },
    });

    return {
      statusCode: 201,
      message: 'Account created successfully',
      email: newUser.email,
    };
  }

  async signin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        profile: {
          select: {
            id: true,
            role: true,
            username: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        username: user.profile.username,
        role: user.profile.role,
      },
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id
      },
      {
        expiresIn: '7d'
      }
    );

    return {
        accessToken,
        refreshToken
      };
  }

  async refresh(refresh: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refresh, {
        secret: process.env.JWT_SECRET
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              username: true,
              role: true,
            }
          }
        }
      })

      const accessToken = await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
          username: user.profile.username,
          role: user.profile.role
        },
        {
          // secret: process.env.JWT_SECRET
          expiresIn: "15m"
        }
      );

      return accessToken
    } catch {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
  }

  async forgetPassword(email: string): Promise<{
    status: HttpStatus;
    message: string;
    resetToken: string
  }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const newOtp = OtpGenerator();
    const mailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Verification Code</h2>
          <p style="color: #666; font-size: 16px;">Hello, ${user.profile.first_name?.concat(user.profile.last_name) ? user.profile.first_name + user.profile.last_name : 'There'}</p>
          <p style="color: #666; font-size: 16px;">Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
            ${newOtp}
          </div>
          <p style="color: #666; font-size: 16px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 16px;">If you didn't request this code, please ignore this email.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">This is an automated email, please do not reply.</p>
        </div>
      `;

    try {
      await SendMail(email, 'Your Verification Code', mailHTML);
    } catch {
      throw new HttpException('Failed to send OTP', HttpStatus.NOT_IMPLEMENTED);
    }

    const otpToken: string = await this.jwtService.signAsync(
      { otp: newOtp },
      {
        expiresIn: '10m',
      },
    );

    const storeOtp = await this.prisma.otp.upsert({
      where: {
        profileId: user.profile.id,
      },
      update: {
        otp: otpToken,
      },
      create: {
        otp: otpToken,
        attempts: 0,
        profile: {
          connect: {
            id: user.profile.id,
          },
        },
      },
    });

    
    if (!storeOtp) {
      throw new HttpException(
        'Failed to store OTP',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
    
    const resetToken = await this.jwtService.signAsync(
      { userId: user.id }, { expiresIn: "5m" }
    );

    return {
      status: 200,
      message: 'Otp has been sent successfully',
      resetToken
    };
  }

  async otpVerify(
    email: string,
    otp: string,
  ): Promise<{
    status: HttpStatus;
    message: string;
    resetToken: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        profile: {
          select: {
            id: true,
            otp: {
              select: {
                otp: true,
                attempts: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('Invalid user email', HttpStatus.NOT_ACCEPTABLE);
    }

    const storedOtp: {
      otp: string;
      iat: number;
      exp: string;
    } | null = await this.jwtService.verifyAsync(user.profile.otp.otp);
    console.log(storedOtp);
    if (storedOtp.otp !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.NOT_IMPLEMENTED);
    }

    const resetToken = await this.jwtService.signAsync(
      {
        email: user.email,
      },
      {
        expiresIn: '15m',
      },
    );

    return {
      status: HttpStatus.OK,
      message: 'Otp verified successfully',
      resetToken,
    };
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{
    status: HttpStatus;
    message: string;
  }> {
    const token: {
      email: string;
      iat: number;
      exp: number;
    } = await this.jwtService.verifyAsync(resetToken);

    const { email } = token;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatePassword = await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    if (!updatePassword) {
      throw new HttpException(
        'Failed to update password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Password reseted successfully',
    };
  }

  async usernameVerify(username: string) {
    const usernameExsiting = await this.prisma.profile.findUnique({
      where: {
        username,
      },
    });

    if (usernameExsiting) {
      throw new HttpException(
        'Username is already in use',
        HttpStatus.CONFLICT,
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Username is available',
    };
  }
}
