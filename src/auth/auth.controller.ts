import { Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('logout')
  async logout() {
    return await this.authService.logout();
  }

  @Post('generate-qr')
  async generateQr() {
    this.eventEmitter.emit('auth.generate_qr');
    return { success: true };
  }
}
