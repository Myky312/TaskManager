import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth') // Add tags for grouping in Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    type: RegisterDto,
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User logged in successfully.',
    type: LoginDto,
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // Require bearer token for this endpoint
  @ApiOkResponse({ description: 'User profile.', type: User })
  getProfile(@Req() req: Request & { user: any }) {
    return req.user as User;
  }
}
