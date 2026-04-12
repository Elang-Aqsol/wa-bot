import {
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  WASocket,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as path from 'path';
import * as fs from 'fs';
import { CommandRouter } from '../commands/command-router';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BaileysService implements OnModuleInit {
  private readonly logger = new Logger(BaileysService.name);
  private socket: WASocket;

  constructor(
    private readonly commandRouter: CommandRouter,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    const authPath = path.join(process.cwd(), 'auth_info_baileys', 'creds.json');
    if (fs.existsSync(authPath)) {
      this.logger.log('Existing credentials found. Auto-connecting to WhatsApp...');
      await this.initSocket();
    } else {
      this.logger.log('No credentials found. Waiting for manual QR generation request.');
      this.eventEmitter.emit('bot.status', 'idle');
    }
  }

  @OnEvent('auth.generate_qr')
  async handleGenerateQr() {
    this.logger.log('Manual QR generation requested.');
    if (!this.socket) {
      await this.initSocket();
    }
  }

  @OnEvent('auth.logout')
  async handleLogout() {
    this.logger.log('Executing native Baileys logout...');
    if (this.socket) {
      await this.socket.logout();
      this.socket = null;
      this.eventEmitter.emit('bot.status', 'idle');
      this.eventEmitter.emit('bot.log', { type: 'success', message: 'Session disconnected securely.' });
    }
  }

  async initSocket() {
    const { state, saveCreds } = await useMultiFileAuthState(
      path.join(process.cwd(), 'auth_info_baileys'),
    );
    
    const { version } = await fetchLatestBaileysVersion();

    this.socket = makeWASocket({
      version,
      printQRInTerminal: false, // Set to false since it's deprecated
      auth: state,
      logger: require('pino')({ level: 'silent' }),
    });

    this.socket.ev.on('creds.update', saveCreds);

    this.socket.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        this.eventEmitter.emit('bot.qr', qr);
        this.eventEmitter.emit('bot.status', 'waiting_for_scan');
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        
        this.logger.warn(
          `Connection closed due to ${lastDisconnect?.error}. Reconnecting: ${shouldReconnect}`,
        );

        if (shouldReconnect) {
          this.initSocket();
        } else {
          // Critical: WhatsApp server forced a logout or we intentionally logged out.
          // Clear internal reference to allow new authentication flows
          this.socket = null;
          this.eventEmitter.emit('bot.status', 'idle');

          // Purge the local session cache securely so Baileys generates fresh keys next time
          try {
            const authPath = path.join(process.cwd(), 'auth_info_baileys');
            if (fs.existsSync(authPath)) {
              const files = fs.readdirSync(authPath);
              for (const file of files) {
                fs.rmSync(path.join(authPath, file), { recursive: true, force: true });
              }
            }
          } catch (error) {
            this.logger.error(`Failed to purge completely: ${error.message}`);
          }
        }
      } else if (connection === 'open') {
        this.logger.log('SUCCESS! WhatsApp Bot is online.');
        this.eventEmitter.emit('bot.status', 'online');
        this.eventEmitter.emit('bot.log', { type: 'success', message: 'WhatsApp Bot is online.' });
      }
    });

    // Handle messages
    this.socket.ev.on('messages.upsert', async (m) => {
      this.logger.log(`Raw Upsert Event: type=${m.type}, count=${m.messages.length}`);
      if (m.type === 'notify' || m.type === 'append') {
        for (const msg of m.messages) {
          const rawText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "(no text)";
          this.logger.log(`Incoming JID: ${msg.key.remoteJid} | fromMe: ${msg.key.fromMe} | text: ${rawText}`);
          await this.commandRouter.resolve(this.socket, msg);
        }
      }
    });
  }

  // Method to be used by ReplyService later
  getSocket(): WASocket {
    return this.socket;
  }
}
