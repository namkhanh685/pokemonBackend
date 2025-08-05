import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get } from '@nestjs/common';
import { ApiResponse } from '../common/interfaces/response.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('signup')
  async signup(@Body() signupDto: RegisterDto): Promise<ApiResponse<any>> {
    const result = await this.authService.signup(signupDto);
    return {
      success: true,
      message: 'User registered successfully',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<any>> {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Login successful',
      data: result,
    };
  }
}