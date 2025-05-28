// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product/product.entity';
import { ProductsController } from './components/product/product.controller';
import { ProductsService } from './components/product/product.service';
import { ConfigModule } from '@nestjs/config';
import { Store } from './entities/store/store.entity';
import { StoresController } from './components/store/store.controller';
import { StoresService } from './components/store/store.service';
import { PeriodsController } from './components/period/period.controller';
import { PeriodsService } from './components/period/period.service';
import { PricesController } from './components/price/price.controller';
import { PricesService } from './components/price/price.service';
import { Period } from './entities/period/period.entity';
import { Price } from './entities/price/price.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Ruta al archivo .env (por defecto es .env en la raíz)
      // ignoreEnvFile: false, // Por defecto es false, significa que intentará cargar el .env
      // load: [configuration], // Opcional: para cargar configuraciones más complejas (ver más abajo)
      // validationSchema: Joi.object({ ... }), // Opcional: para validación de variables de entorno (ver más abajo)
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_ADDON_HOST,
      port: process.env.POSTGRESQL_ADDON_PORT as unknown as number,
      username: process.env.POSTGRESQL_ADDON_USER,
      password: process.env.POSTGRESQL_ADDON_PASSWORD,
      database: process.env.POSTGRESQL_ADDON_DB,
      entities: [Product, Store, Period, Price],
      synchronize: true, // Disabled to avoid permission issues
    }),
    TypeOrmModule.forFeature([Product, Store, Period, Price]), // Registra la entidad para este módulo
  ],
  controllers: [
    ProductsController,
    StoresController,
    PeriodsController,
    PricesController,
  ],
  providers: [ProductsService, StoresService, PeriodsService, PricesService],
})
export class AppModule {}
