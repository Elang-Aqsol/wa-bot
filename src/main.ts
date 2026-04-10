import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Create a microservice/standalone app context since we don't need a web server
  const app = await NestFactory.createApplicationContext(AppModule);
  
  logger.log('🚀 WhatsApp Sticker Bot Logic is starting...');
  
  // Wait for initialization
  await app.init();
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
