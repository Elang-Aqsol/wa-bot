import { Injectable, Logger } from '@nestjs/common';
import { downloadMediaMessage, proto, WASocket } from '@whiskeysockets/baileys';
import * as sharp from 'sharp';

@Injectable()
export class StickerHandler {
  private readonly logger = new Logger(StickerHandler.name);

  async handle(socket: WASocket, msg: proto.IWebMessageInfo) {
    const jid = msg.key.remoteJid!;
    
    // 1. Identify where the image is (direct message or quoted reply)
    const isImage = !!msg.message?.imageMessage;
    const isQuotedImage = !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

    if (!isImage && !isQuotedImage) {
      await socket.sendMessage(jid, { text: '❌ Please send an image with the caption */sticker* or reply to an image with */sticker*.' });
      return;
    }

    try {
      this.logger.log(`Generating sticker for ${jid}...`);
      
      // 2. Download the media
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        {},
        { 
          logger: require('pino')({ level: 'silent' }),
          reuploadRequest: socket.updateMediaMessage 
        }
      ) as Buffer;

      // 3. Process with Sharp (512x512, maintain aspect ratio with padding)
      const stickerBuffer = await sharp(buffer)
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp()
        .toBuffer();

      // 4. Send the sticker
      await socket.sendMessage(jid, { sticker: stickerBuffer });
      
    } catch (error) {
      this.logger.error('Failed to process sticker:', error);
      await socket.sendMessage(jid, { text: '⚠️ Sorry, I failed to process that image. Please try again.' });
    }
  }
}
