import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('nonce')
  getNonce(@Query('address') address: string) {
    const nonce = this.authService.generateNonce(address);
    return { nonce };
  }

  @Post('verify')
  async verify(
    @Body('address') address: string,
    @Body('signature') signature: string,
    @Body('message') message: string,
  ) {
    const token = await this.authService.verifySignature(address, signature, message);
    return { token };
  }
}
