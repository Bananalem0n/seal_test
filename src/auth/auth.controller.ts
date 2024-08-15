import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin } from 'src/models/admin.model';
import { Response } from 'express';

@Controller('login')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() body: Admin, @Res() res: Response) {
    try {
      const { email, password } = body;
      const admin = await this.authService.validateAdmin(email, password);
      const token = await this.authService.login(admin);
      console.log(token);
      res.cookie('token', token, {
        maxAge: 12000000,
        httpOnly: true,
      });

      return res.status(HttpStatus.OK).json({
        message: 'Successfully authenticated',
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid credentials',
      });
    }
  }
}
