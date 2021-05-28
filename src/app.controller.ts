import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './security/auth/auth.service';
import { JwtAuthGuard } from './security/auth/jwt-auth.guard';
import { LocalAuthGuard } from './security/auth/local-auth.guard';
import { Public } from './utils/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get('teste')
  getHello(@Request() req): string {
    console.log(req.user)
    return this.appService.getHello();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
