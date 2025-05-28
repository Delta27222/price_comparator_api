// src/dto/product/create-product.dto.ts
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  MaxLength,
  IsUrl, // Importa IsUrl para validar que sea una URL
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description:
      'Name of the product (must be unique and up to 100 characters)',
    maxLength: 100,
    example: 'Laptop XYZ',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Optional description of the product',
    required: false,
    example: 'High-performance laptop with a sleek design.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price of the product (must be a non-negative number)',
    minimum: 0,
    example: 999.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Indicates if the product is active',
    required: false,
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'URL of the product image (optional)',
    required: false, // La propiedad es opcional
    example: 'https://example.com/images/laptop_xyz.jpg',
  })
  @IsUrl({}, { message: 'La imagen debe ser una URL válida.' }) // Valida que sea una URL
  @IsOptional() // Marca la propiedad como opcional
  image?: string; // Declara la propiedad como opcional
}
