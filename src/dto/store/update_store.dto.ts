// src/dto/store/update-store.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreDto } from './create_store.dto';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty, si lo necesitaras para propiedades adicionales
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  // Las propiedades heredadas de CreateStoreDto (name, direction, image, isActive)
  // ya son opcionales y se documentarán en Swagger UI basándose en CreateStoreDto.
  // No se requiere añadir @ApiProperty aquí a menos que desees:
  // 1. Añadir una propiedad completamente nueva solo para la actualización.
  // 2. Sobrescribir la descripción o el ejemplo de una propiedad heredada.

  @ApiProperty({
    description: 'New name for the store (optional, max 100 characters)',
    maxLength: 100,
    required: false, // Ya es opcional por PartialType
    example: 'New SuperMarket Name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}
