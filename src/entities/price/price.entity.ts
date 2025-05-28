import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../product/product.entity'; // Asegúrate de la ruta correcta
import { Store } from '../store/store.entity'; // Asegúrate de la ruta correcta
import { Period } from '../period/period.entity'; // Asegúrate de la ruta correcta
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('prices')
export class Price {
  @ApiProperty({
    description: 'Unique identifier of the price (UUID)',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The monetary amount of the price',
    type: 'number', // Se representa como número
    format: 'float', // Indicación para decimales
    minimum: 0,
    example: 19.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'The associated product object',
    type: () => Product, // Referencia al esquema completo de Product
  })
  @ManyToOne(() => Product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product; // Objeto completo del producto

  @ApiProperty({
    description: 'UUID of the associated product (foreign key)',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Column({ type: 'uuid' })
  productId: string; // Columna para el ID de la clave foránea

  @ApiProperty({
    description: 'The associated store object',
    type: () => Store, // Referencia al esquema completo de Store
  })
  @ManyToOne(() => Store, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store: Store; // Objeto completo de la tienda

  @ApiProperty({
    description: 'UUID of the associated store (foreign key)',
    format: 'uuid',
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
  })
  @Column({ type: 'uuid' })
  storeId: string; // Columna para el ID de la clave foránea

  @ApiProperty({
    description: 'The associated period object',
    type: () => Period, // Referencia al esquema completo de Period
  })
  @ManyToOne(() => Period, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'periodId' })
  period: Period; // Objeto completo del periodo

  @ApiProperty({
    description: 'UUID of the associated period (foreign key)',
    format: 'uuid',
    example: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
  })
  @Column({ type: 'uuid' })
  periodId: string; // Columna para el ID de la clave foránea

  @ApiProperty({
    description: 'Timestamp when the price record was created',
    type: String, // Se representa como string en JSON
    format: 'date-time',
    example: '2025-05-28T12:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the price record was last updated',
    type: String, // Se representa como string en JSON
    format: 'date-time',
    example: '2025-05-28T12:30:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
