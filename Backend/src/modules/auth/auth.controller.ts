import { Controller, Get, Post, Body, Param, Res, Req, HttpStatus, HttpException, Ip, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { OtpVerificationDto } from './dto/verify-otp.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  async signin(@Body() { email, password }: SigninDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.signin(email, password);

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      path: '/auth/refresh',
    });

    res.json({
        status: HttpStatus.OK,
        message: "Logged in successfully",
        accessToken
    })
  }

  @Post('signout') 
  signout(@Res() res: Response) {
    res.clearCookie("refreshToken", {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      path: '/auth/refresh'
    });

    res.json({
      status: HttpStatus.OK,
      message: "Logged out successfully"
    });
  }

  @Post('refresh')
  refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService.refresh(refreshToken);
  }

  @Post('forget-password')
  forgetPassword(@Body('email') email: string) {
    return this.authService.forgetPassword(email);
  }

  @Post('otp-verify')
  otpVerify(@Body() { email, otp }: OtpVerificationDto) {
    return this.authService.otpVerify(email, otp);
  }

  @Post('otp-resend')
  otpResend(@Body() { email, profileId }: { email: string, profileId: string }) {
    return this.authService.otpResend(email, profileId);
  }

  @Post('username-verify')
  usernameVerify(@Body('username') username: string) {
    return this.authService.usernameVerify(username);
  }

  @Post('reset-password')
  resetPassword(
    @Query("e") resetToken: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(resetToken, newPassword);
  }

  // @Get("check-ip")
  // getIp(@Ip() ip: string, @Req() req: Request) {
  //   return { clientIp: ip }
  // }

}
