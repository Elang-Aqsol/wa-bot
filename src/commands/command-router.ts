import { Injectable, Logger } from '@nestjs/common';
import { StickerHandler } from './handlers/sticker.handler';
import { proto, WASocket } from '@whiskeysockets/baileys';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommandRouter {
  private readonly logger = new Logger(CommandRouter.name);
  private processedMessageIds = new Set<string>();

  constructor(
    private readonly stickerHandler: StickerHandler,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async resolve(socket: WASocket, msg: proto.IWebMessageInfo) {
    // Intelligent deduplication using the explicit Message ID.
    // This allows @lid routing when necessary but prevents double-execution.
    const msgId = msg.key.id;
    if (msgId) {
      if (this.processedMessageIds.has(msgId)) return;
      this.processedMessageIds.add(msgId);
      // Keep cache small to avoid memory leaks
      if (this.processedMessageIds.size > 100) {
        this.processedMessageIds.delete(this.processedMessageIds.keys().next().value);
      }
    }

    const text = msg.message?.conversation || 
                 msg.message?.extendedTextMessage?.text || 
                 msg.message?.imageMessage?.caption || 
                 msg.message?.videoMessage?.caption ||
                 '';

    if (!text.startsWith('/')) return;

    const command = text.split(' ')[0].toLowerCase();
    
    this.logger.log(`Processing command: ${command} from ${msg.key.remoteJid}`);
    this.eventEmitter.emit('bot.log', {
      type: 'info',
      message: `Running ${command} for ${msg.key.remoteJid?.split('@')[0]}`,
    });

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
        this.eventEmitter.emit('bot.log', { type: 'warn', message: `Unknown command rejected: ${command}` });
        await socket.sendMessage(msg.key.remoteJid!, { 
          text: `⚠️ Unknown command: *${command}*\n\nSend */help* to see available commands.` 
        });
        break;
    }
  }

  private async sendHelp(socket: WASocket, jid: string) {
    const helpText = `*📸 WhatsApp Sticker Bot v1.1*

Available Commands:
- */sticker* - Convert an image or video (max 10s) into a sticker.
- */help* - Show this menu.

_Tip: You can use /s or /h for short._`;
    
    await socket.sendMessage(jid, { text: helpText });
    this.eventEmitter.emit('bot.log', { type: 'success', message: 'Help menu delivered.' });
  }
}
