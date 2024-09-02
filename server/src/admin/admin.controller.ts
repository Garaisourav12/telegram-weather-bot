import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('google/signup')
  @UseGuards(AuthGuard('google-signup'))
  async googleSignup() {}

  @Get('google/signup/callback')
  @UseGuards(AuthGuard('google-signup'))
  async googleSignupCallback(@Req() req: any, @Res() res: Response) {
    const userData = req.user;
    try {
      const user = await this.adminService.register(userData);
      return res.status(201).json({
        success: true,
        status: 201,
        data: user,
        message: 'Registration successful!',
      });
    } catch (err) {
      return res.status(err.getStatus()).json({
        success: false,
        status: err.getStatus(),
        error: err.message,
      });
    }
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google-login'))
  async googleLogin() {}

  @Get('google/login/callback')
  @UseGuards(AuthGuard('google-login'))
  async googleLoginCallback(@Req() req: any, @Res() res: Response) {
    const { email } = req.user;

    try {
      const user = await this.adminService.login(email);

      // Generate Token
      const token = await this.adminService.generateToken({ ...user });

      res
        .status(200)
        .cookie('token', token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .json({
          success: true,
          status: 200,
          data: user,
          message: 'Login successful!',
        });
      console.log('Set-Cookie Header:', res.getHeaders()['set-cookie']);
    } catch (err) {
      return res.status(err.getStatus?.() || 500).json({
        success: false,
        status: err.getStatus?.() || 500,
        error: err.message,
      });
    }
  }

  @Get('profile')
  async profile(@Req() req: any, @Res() res: Response) {
    const { _id } = req.user;

    try {
      const user = await this.adminService.getLoggedInUser(_id);
      return res.status(200).json({
        success: true,
        status: 200,
        data: user,
        message: 'Profile fetched successfully!',
      });
    } catch (err) {
      return res.status(err.getStatus()).json({
        success: false,
        status: err.getStatus(),
        error: err.message,
      });
    }
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    return res
      .status(200)
      .clearCookie('token', {
        sameSite: 'none',
        secure: true,
      })
      .json({ success: true, status: 200, message: 'Logout successful!' });
  }
}
