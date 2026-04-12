import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Create a full NestJS application to support HTTP and WebSockets
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS so the Dashboard (port 5173) can talk to the Bot (port 3000)
  app.enableCors();
  
  logger.log('🚀 WhatsApp Sticker Bot & Dashboard Logic is starting...');
  
  // Start the server on port 3000 (standard NestJS port)
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`✅ Server is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
