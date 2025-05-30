// src/dto/period/create-period.dto.ts
import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class CreatePeriodDto {
  @ApiProperty({
    description: 'Name of the period (e.g., "Summer 2025", max 100 characters)',
    maxLength: 100,
    example: 'Summer 2025',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El nombre no debe exceder los 100 caracteres.' })
  name: string; // Requerido

  @ApiProperty({
    description: 'Optional detailed description of the period',
    required: false,
    example: 'Period covering June, July, and August for seasonal pricing.',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string; // Opcional, ya que es nullable en la entidad

  @ApiProperty({
    description: 'Indicates if the period is currently active',
    required: false,
    default: true,
    example: true,
  })
  @IsBoolean({ message: 'isActive debe ser un valor booleano.' })
  @IsOptional()
  isActive?: boolean; // Opcional, ya que tiene un valor por defecto en la entidad

  @ApiProperty({
    description: 'URL of an image representing the period (optional)',
    required: false,
    example: 'https://example.com/images/summer_period.png',
  })
  // @IsUrl({}, { message: 'La imagen debe ser una URL válida.' }) // Podrías usar IsString si no siempre es una URL
  @IsOptional()
  image?: string; // Opcional, ya que es nullable en la entidad
}
