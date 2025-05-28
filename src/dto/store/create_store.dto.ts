// src/dto/store/create-store.dto.ts
import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator'; // Agregado IsUrl si la imagen es una URL
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

export class CreateStoreDto {
  @ApiProperty({
    description: 'Name of the store (unique, max 100 characters)',
    maxLength: 100,
    example: 'SuperMarket Central',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El nombre no debe exceder los 100 caracteres.' })
  name: string; // Requerido

  @ApiProperty({
    description: 'Optional physical address or direction of the store',
    required: false,
    example: 'Av. Libertador, Edif. Centro, Local 1',
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsOptional()
  direction?: string; // Opcional, ya que es nullable en la entidad

  @ApiProperty({
    description: 'URL of the store image (optional)',
    required: false,
    example: 'https://example.com/images/store_logo.png',
  })
  @IsString({
    message: 'La imagen debe ser una cadena de texto (URL o base64).',
  })
  @IsOptional()
  // Considera usar @IsUrl() aquí si esperas solo URLs de imagen.
  // @IsUrl({}, { message: 'La imagen debe ser una URL válida.' })
  image?: string; // Opcional, ya que es nullable en la entidad

  @ApiProperty({
    description: 'Indicates if the store is currently active',
    required: false,
    default: true,
    example: true,
  })
  @IsBoolean({ message: 'isActive debe ser un valor booleano.' })
  @IsOptional()
  isActive?: boolean; // Opcional, ya que tiene un valor por defecto en la entidad
}
