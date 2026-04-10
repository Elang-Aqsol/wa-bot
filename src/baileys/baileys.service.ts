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
import * as qrcode from 'qrcode-terminal';

import { CommandRouter } from '../commands/command-router';

@Injectable()
export class BaileysService implements OnModuleInit {
  private readonly logger = new Logger(BaileysService.name);
  private socket: WASocket;

  constructor(private readonly commandRouter: CommandRouter) {}

  async onModuleInit() {
    await this.initSocket();
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
        this.logger.log('Scan the QR code below to link your WhatsApp:');
        qrcode.generate(qr, { small: true });
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
        }
      } else if (connection === 'open') {
        this.logger.log('SUCCESS! WhatsApp Bot is online.');
      }
    });

    // Handle messages
    this.socket.ev.on('messages.upsert', async (m) => {
      if (m.type === 'notify') {
        for (const msg of m.messages) {
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
