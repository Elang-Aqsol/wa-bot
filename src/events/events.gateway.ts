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
  
  // Cache the latest status to ensure new dashboard clients get the correct UI state
  private currentStatus: string = 'idle';

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
    // Sync the exact current state to the client immediately upon load
    client.emit('status_update', this.currentStatus);
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
    this.currentStatus = status;
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
