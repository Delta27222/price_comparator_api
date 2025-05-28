// src/dto/price/update-price.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceDto } from './create_price.dto';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty por si necesitaras añadir propiedades únicas
import { Min, IsOptional, IsNumber } from 'class-validator';

export class UpdatePriceDto extends PartialType(CreatePriceDto) {
  // Las propiedades heredadas de CreatePriceDto (amount, productId, storeId, periodId)
  // ya son opcionales y se documentarán en Swagger UI basándose en CreatePriceDto.
  // No necesitas añadir @ApiProperty aquí a menos que quieras:
  // 1. Añadir una propiedad completamente nueva solo para la actualización.
  // 2. Sobrescribir la descripción o el ejemplo de una propiedad heredada.

  @ApiProperty({
    description: 'New amount for the price (optional, non-negative)',
    minimum: 0,
    required: false, // Ya es opcional por PartialType
    example: 35.5,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;
}
