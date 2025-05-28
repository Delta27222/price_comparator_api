// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  // Use FastifyAdapter for Fastify application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(), // Use the Fastify adapter
  );

  // --- Configuración de CORS ---
  // Habilitar CORS para permitir solicitudes desde cualquier origen
  // NOTA: En un entorno de producción, es recomendable especificar los orígenes permitidos
  // en lugar de usar 'true' por razones de seguridad.
  app.enableCors({
    origin: true, // Esto permite cualquier origen. Considera cambiar esto en producción.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Permite el envío de cookies y encabezados de autorización
  });
  // --- Fin Configuración de CORS ---

  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- Swagger Setup ---
  const config = new DocumentBuilder()
    .setTitle('Price Comparator API')
    .setDescription('API for managing products, stores, periods, and prices.')
    .setVersion('1.0')
    .addTag('prices')
    .addTag('products')
    .addTag('stores')
    .addTag('periods')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // --- End Swagger Setup ---

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
