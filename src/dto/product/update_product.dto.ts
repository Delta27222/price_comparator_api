// src/dto/product/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // Para heredar propiedades de CreateProductDto y hacerlas opcionales
import { CreateProductDto } from './create_product.dto';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty, incluso si no se usa directamente en este ejemplo simple
import { IsString, IsOptional, MaxLength } from 'class-validator';

// Si no tienes @nestjs/mapped-types instalado: npm install @nestjs/mapped-types
export class UpdateProductDto extends PartialType(CreateProductDto) {
  // En este caso, PartialType se encarga de que 'name', 'description', 'price',
  // y 'isActive' sean opcionales y se documenten correctamente con sus validaciones
  // originales de CreateProductDto.
  // Si quisieras añadir una propiedad ÚNICA para la actualización, la añadirías aquí,
  // junto con su @ApiProperty() y sus validadores:
  @ApiProperty({
    description: 'Updated name of the product (can be changed during update)',
    maxLength: 100,
    required: false, // Ya es opcional por PartialType, pero puedes recalcarlo
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string; // Asegúrate de que coincida con el tipo de CreateProductDto
}
