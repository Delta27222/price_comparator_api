import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // ¡Importa ApiProperty!

@Entity('products')
export class Product {
  @ApiProperty({
    description: 'Unique identifier of the product (UUID)',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description:
      'Name of the product (must be unique and up to 100 characters)',
    maxLength: 100,
    example: 'Smartphone Model X',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Optional detailed description of the product',
    nullable: true, // Coincide con la columna nullable
    example: 'A powerful and sleek smartphone with advanced features.',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Indicates if the product is currently active and available',
    default: true, // Coincide con el valor por defecto
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'URL of the product image (optional)',
    nullable: true, // Coincide con la columna nullable
    example: 'https://example.com/images/smartphone_x.jpg',
  })
  @Column({ type: 'text', nullable: true })
  image: string;

  @ApiProperty({
    description: 'Timestamp when the product was created',
    type: String, // Se representa como string en JSON
    format: 'date-time',
    example: '2025-05-28T10:00:00Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the product was last updated',
    type: String, // Se representa como string en JSON
    format: 'date-time',
    example: '2025-05-28T10:30:00Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
