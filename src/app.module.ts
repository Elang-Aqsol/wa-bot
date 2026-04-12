import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BaileysService } from './baileys/baileys.service';
import { CommandRouter } from './commands/command-router';
import { StickerHandler } from './commands/handlers/sticker.handler';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    EventsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    BaileysService,
    CommandRouter,
    StickerHandler,
  ],
})
export class AppModule {}
