import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async logout() {
    this.logger.log('Logging out via Baileys socket...');
    this.eventEmitter.emit('auth.logout');
    
    return { success: true, message: 'Bot successfully unlinked. Ready for new connection.' };
  }
}
