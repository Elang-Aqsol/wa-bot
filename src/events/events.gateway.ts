import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @OnEvent('bot.qr')
  handleQrUpdate(qr: string) {
    this.server.emit('qr_update', qr);
  }

  @OnEvent('bot.status')
  handleStatusUpdate(status: string) {
    this.server.emit('status_update', status);
  }

  @OnEvent('bot.log')
  handleLogUpdate(log: { type: 'info' | 'warn' | 'error' | 'success'; message: string }) {
    this.server.emit('log_update', {
      timestamp: new Date().toISOString(),
      ...log,
    });
  }
}
