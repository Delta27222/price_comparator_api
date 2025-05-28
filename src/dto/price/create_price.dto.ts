// src/dto/price/create-price.dto.ts
import { IsNumber, IsUUID, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class CreatePriceDto {
  @ApiProperty({
    description: 'The amount of the price (must be a non-negative number)',
    minimum: 0,
    example: 29.99,
  })
  @IsNumber({}, { message: 'El monto debe ser un número.' })
  @Min(0, { message: 'El monto no puede ser negativo.' })
  amount: number; // Requerido

  @ApiProperty({
    description: 'UUID of the associated product',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El ID del producto no puede estar vacío.' })
  productId: string; // Requerido (UUID)

  @ApiProperty({
    description: 'UUID of the associated store',
    format: 'uuid',
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
  })
  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El ID de la tienda no puede estar vacío.' })
  storeId: string; // Requerido (UUID)

  @ApiProperty({
    description: 'UUID of the associated period',
    format: 'uuid',
    example: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
  })
  @IsUUID('4', { message: 'El ID del periodo debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El ID del periodo no puede estar vacío.' })
  periodId: string; // Requerido (UUID)
}
