import { Module } from '@nestjs/common';
import { BaileysService } from './baileys/baileys.service';
import { CommandRouter } from './commands/command-router';
import { StickerHandler } from './commands/handlers/sticker.handler';

@Module({
  imports: [],
  controllers: [],
  providers: [
    BaileysService,
    CommandRouter,
    StickerHandler,
  ],
})
export class AppModule {}
