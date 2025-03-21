import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { User } from '../users/entities/user.entity'; // Adjust the import path as necessary
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: Request & { user: any }) {
    return req.user as User;
  }
}
