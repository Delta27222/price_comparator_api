import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // ¡No olvides importar ApiProperty!

@Entity('stores')
export class Store {
  @ApiProperty({
    description: 'Unique identifier of the store (UUID)',
    format: 'uuid',
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the store (must be unique and up to 100 characters)',
    maxLength: 100,
    example: 'Grocery Mart',
  })
  @Column({ unique: true, length: 100 })
  name: string;

  @ApiProperty({
    description: 'Physical address or location of the store (optional)',
    nullable: true, // Coincide con la columna nullable
    example: '123 Main Street, Anytown, USA',
  })
  @Column({ type: 'text', nullable: true })
  direction: string;

  @ApiProperty({
    description: 'URL of the store logo or image (optional)',
    nullable: true, // Coincide con la columna nullable
    example: 'https://example.com/images/grocery_mart_logo.png',
  })
  @Column({ type: 'text', nullable: true })
  image: string;

  @ApiProperty({
    description: 'Indicates if the store is currently active and open',
    default: true, // Coincide con el valor por defecto
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Timestamp when the store record was created',
    type: String, // Se representa como string en JSON
    format: 'date-time',
    example: '2025-05-28T09:00:00Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the store record was last updated',
    type: String, // Se representa como string en JSON
    format: 'date-time',
    example: '2025-05-28T09:45:00Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
