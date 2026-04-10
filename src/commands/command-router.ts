import { Injectable, Logger } from '@nestjs/common';
import { StickerHandler } from './handlers/sticker.handler';
import { proto, WASocket } from '@whiskeysockets/baileys';

@Injectable()
export class CommandRouter {
  private readonly logger = new Logger(CommandRouter.name);

  constructor(private readonly stickerHandler: StickerHandler) {}

  async resolve(socket: WASocket, msg: proto.IWebMessageInfo) {
    const text = msg.message?.conversation || 
                 msg.message?.extendedTextMessage?.text || 
                 msg.message?.imageMessage?.caption || 
                 '';

    if (!text.startsWith('/')) return;

    const command = text.split(' ')[0].toLowerCase();
    
    this.logger.log(`Processing command: ${command} from ${msg.key.remoteJid}`);

    switch (command) {
      case '/sticker':
      case '/s':
        await this.stickerHandler.handle(socket, msg);
        break;
      case '/help':
      case '/h':
        await this.sendHelp(socket, msg.key.remoteJid!);
        break;
      default:
        // Optional: Send "Unknown command" or ignore
        break;
    }
  }

  private async sendHelp(socket: WASocket, jid: string) {
    const helpText = `*📸 WhatsApp Sticker Bot v1*

Available Commands:
- */sticker* - Convert an image (with caption or as a reply) into a sticker.
- */help* - Show this menu.

_Tip: You can use /s or /h for short._`;
    
    await socket.sendMessage(jid, { text: helpText });
  }
}
