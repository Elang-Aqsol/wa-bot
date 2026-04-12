import { Injectable, Logger } from '@nestjs/common';
import { downloadMediaMessage, proto, WASocket } from '@whiskeysockets/baileys';
import * as sharp from 'sharp';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class StickerHandler {
  private readonly logger = new Logger(StickerHandler.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async handle(socket: WASocket, msg: proto.IWebMessageInfo) {
    const jid = msg.key.remoteJid!;
    
    // 1. Identify Media Type
    const imageMessage = msg.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    const videoMessage = msg.message?.videoMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

    if (!imageMessage && !videoMessage) {
      this.eventEmitter.emit('bot.log', { type: 'warn', message: 'Rejected /sticker: No valid media found.' });
      await socket.sendMessage(jid, { text: '❌ Please send an image or video (max 10s) with the caption */sticker* or reply to one with */sticker*.' });
      return;
    }

    if (videoMessage) {
      const duration = videoMessage.seconds || 0;
      if (duration > 10) {
        this.eventEmitter.emit('bot.log', { type: 'warn', message: `Rejected /sticker: Video too long (${duration}s).` });
        await socket.sendMessage(jid, { text: `❌ Video is too long (${duration}s). Please send a video that is 10 seconds or less!` });
        return;
      }
    }

    try {
      const isVideo = !!videoMessage;
      const mediaTypeLabel = isVideo ? "animated sticker" : "sticker";
      
      this.logger.log(`Generating ${mediaTypeLabel} for ${jid}...`);
      this.eventEmitter.emit('bot.log', { type: 'info', message: `Generating ${mediaTypeLabel} for ${jid.split('@')[0]}...` });
      
      // 2. Download Media using the correct wrapper fallback
      // Because we pass `msg`, Baileys natively traverses it to find the media. No explicit passing needed.
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        {},
        { 
          logger: require('pino')({ level: 'silent' }),
          reuploadRequest: socket.updateMediaMessage 
        }
      ) as Buffer;

      let stickerBuffer: Buffer;

      // 3. Media Processing Pipeline
      if (isVideo) {
        stickerBuffer = await this.processAnimatedSticker(buffer);
      } else {
        // Static Image Pipeline (Sharp)
        stickerBuffer = await sharp(buffer)
          .resize(512, 512, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .webp()
          .toBuffer();
      }

      // 4. Send Target Output
      await socket.sendMessage(jid, { sticker: stickerBuffer });
      this.eventEmitter.emit('bot.log', { type: 'success', message: `${isVideo ? 'Animated s' : 'S'}ticker sent seamlessly to ${jid.split('@')[0]}` });
      
    } catch (error) {
      this.logger.error('Failed to process sticker:', error);
      this.eventEmitter.emit('bot.log', { type: 'error', message: `Sticker Generation Failed: ${error.message}` });
      await socket.sendMessage(jid, { text: '⚠️ Sorry, I failed to process that media. Please try again.' });
    }
  }

  private async processAnimatedSticker(inputBuffer: Buffer): Promise<Buffer> {
    const timestamp = Date.now();
    const inputPath = path.join('/tmp', `${timestamp}_in.mp4`);
    const outputPath = path.join('/tmp', `${timestamp}_out.webp`);

    try {
      // Dump in-memory buffer to disk for FFmpeg execution
      fs.writeFileSync(inputPath, inputBuffer);

      // Execute aggressive WebP encoding algorithms
      // -vcodec libwebp: Use WebP library
      // -vf scale/...: Dynamically pads and centers video natively within 512x512 box constraints
      // -loop 0: Infinite loop
      // -an: Strip all audio tracks immediately
      // -vsync 0: Smooth frame rates syncing
      // -q:v 20: Compress quality aggressively to pass WA's sub-500 KB upload limitation (avoids 428 Precondition)
      // fps=10: Limit to 10 frames per second
      const command = `ffmpeg -i ${inputPath} -vcodec libwebp -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,fps=10" -q:v 20 -loop 0 -preset default -an -vsync 0 -t 10 ${outputPath}`;
      
      await execAsync(command);

      // Load compiled payload back to memory
      const outputBuffer = fs.readFileSync(outputPath);
      return outputBuffer;
    } finally {
      // Prevent volume memory leaks unconditionally
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  }
}

