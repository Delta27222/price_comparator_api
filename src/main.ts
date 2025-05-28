// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import Swagger modules
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'; // Import Fastify adapter

async function bootstrap() {
  // Use FastifyAdapter for Fastify application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(), // Use the Fastify adapter
  );

  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // This is important for DTOs to be transformed into class instances
    }),
  );

  // --- Swagger Setup ---
  const config = new DocumentBuilder()
    .setTitle('Price Comparator API') // Your API title
    .setDescription('API for managing products, stores, periods, and prices.') // A description
    .setVersion('1.0') // Your API version
    .addTag('prices') // Add tags for categorization (optional)
    .addTag('products')
    .addTag('stores')
    .addTag('periods')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' is the URL path for your Swagger UI (e.g., http://localhost:3000/api)
  // --- End Swagger Setup ---

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
