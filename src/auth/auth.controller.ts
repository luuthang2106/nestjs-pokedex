import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.login(loginDto);
    (res as any).cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax', // hoặc 'none' + secure: true nếu cross-site
      secure: false,
      maxAge: 60 * 60 * 1000,
      path: '/',
    });
    return { message: 'ok' };
  }

  @Post('register')
  async register(@Body() registerDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.register(registerDto);
    (res as any).cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax', 
      secure: false,
      maxAge: 60 * 60 * 1000,
      path: '/',
    });
    return { message: 'ok' };
  }

  @Get('verify')
  async verify(@Req() req: Request) {
    await this.authService.verifyFromRequest(req);
    return { message: 'ok' };
  }
}
