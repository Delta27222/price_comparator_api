// src/dto/period/update-period.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodDto } from './create_period.dto';
// import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty si lo necesitaras para propiedades adicionales

export class UpdatePeriodDto extends PartialType(CreatePeriodDto) {
  // Las propiedades heredadas de CreatePeriodDto (name, description, isActive, image)
  // ya son opcionales y se documentarán en Swagger UI basándose en CreatePeriodDto.
  // No se requiere añadir @ApiProperty aquí a menos que quieras:
  // 1. Añadir una propiedad completamente nueva solo para la actualización.
  // 2. Sobreescribir la descripción o el ejemplo de una propiedad heredada.
}
