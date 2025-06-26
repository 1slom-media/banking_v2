import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'login by admin' })
  @Post('/login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: 'login anorbank get token' })
  @Post('/login/anorbank')
  async loginAnor(@Body() data: LoginDto) {
    return this.authService.loginAnor(data);
  }

  @ApiOperation({ summary: 'register' })
  @Post('/register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @ApiOperation({ summary: 'davrbank refresh token' })
  @Post('/refresh-token/davrbank')
  async refreshTokenDavrBank() {
    return this.authService.refreshTokenDavr();
  }
}
