import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('periods')
export class Period {
  @ApiProperty({
    description: 'Unique identifier of the period (UUID)',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the period (must be unique and up to 100 characters)',
    maxLength: 100,
    example: 'Summer 2025 Sales',
  })
  @Column({ unique: true, length: 100 })
  name: string;

  @ApiProperty({
    description: 'Optional detailed description of the period',
    nullable: true, // Coincide con la columna nullable
    example: 'Special pricing period for the summer season.',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Indicates if the period is currently active',
    default: true, // Coincide con el valor por defecto
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'URL of an image associated with the period (optional)',
    nullable: true, // Coincide con la columna nullable
    example: 'https://example.com/images/summer_promo.jpg',
  })
  @Column({ type: 'text', nullable: true })
  image: string;

  @ApiProperty({
    description: 'Timestamp when the period was created',
    type: String, // Se representa como string en JSON
    format: 'date-time',
    example: '2025-05-28T12:30:00Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the period was last updated',
    type: String, // Se representa como string en JSON
    format: 'date-time',
    example: '2025-05-28T13:00:00Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
