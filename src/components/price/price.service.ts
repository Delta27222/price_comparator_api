/* eslint-disable no-useless-catch */
// src/services/prices.service.ts (o src/modules/prices/services/prices.service.ts)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from 'src/entities/price/price.entity';
import { Repository } from 'typeorm';

// Importa los repositorios de las entidades relacionadas
import { Period } from 'src/entities/period/period.entity';
import { Product } from 'src/entities/product/product.entity';
import { Store } from 'src/entities/store/store.entity';
import { CreatePriceDto } from 'src/dto/price/create_price.dto';
import { UpdatePriceDto } from 'src/dto/price/update_price.dto';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}

  /**
   * Valida la existencia de las entidades relacionadas (Producto, Tienda, Periodo).
   * Esto asegura que los IDs proporcionados en el DTO existan en la base de datos.
   * @param productId ID del producto.
   * @param storeId ID de la tienda.
   * @param periodId ID del periodo.
   * @returns Una promesa que resuelve con los objetos de las entidades encontradas.
   * @throws NotFoundException si alguna de las entidades relacionadas no existe.
   */
  private async validateRelatedEntities(
    productId: string,
    storeId: string,
    periodId: string,
  ): Promise<{ product: Product; store: Store; period: Period }> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found.`);
    }

    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException(`Store with ID "${storeId}" not found.`);
    }

    const period = await this.periodRepository.findOne({
      where: { id: periodId },
    });
    if (!period) {
      throw new NotFoundException(`Period with ID "${periodId}" not found.`);
    }

    return { product, store, period };
  }

  /**
   * Obtiene todos los precios.
   * Opcionalmente carga las relaciones para mostrar el detalle de Producto, Tienda y Periodo.
   * @returns Una promesa que resuelve a un array de precios.
   */
  async findAll(): Promise<Price[]> {
    // Al usar find, podemos especificar 'relations' para cargar los objetos relacionados
    return this.priceRepository.find({
      relations: ['product', 'store', 'period'],
    });
  }

  async findAllProductsWithShortestPrice(): Promise<PriceLike[]> {
    // Obtiene todos los precios y agrupa por producto
    const prices = await this.priceRepository.find();
    // Crea un mapa para almacenar el precio más bajo por producto
    const productPricesMap = findShortestPrices(prices);
    // Devuelve los precios más bajos por producto como un array
    return Object.values(productPricesMap);
  }

  /**
   * Obtiene un precio por su ID.
   * Siempre carga las relaciones para mostrar el detalle completo.
   * @param id El ID del precio (UUID).
   * @returns Una promesa que resuelve al precio encontrado.
   * @throws NotFoundException Si el precio no se encuentra.
   */
  async findOne(id: string): Promise<Price> {
    const price = await this.priceRepository.findOne({
      where: { id },
      relations: ['product', 'store', 'period'], // Carga los detalles de las relaciones
    });
    if (!price) {
      throw new NotFoundException(`Price with ID "${id}" not found.`);
    }
    return price;
  }

  /**
   * Obtiene los precios de un producto en especifico
   * Siempre carga las relaciones para mostrar el detalle completo.
   * @param id El ID del precio (UUID).
   * @returns Una promesa que resuelve al precio encontrado.
   * @throws NotFoundException Si el precio no se encuentra.
   */
  async findPricesOfProduct(
    productId: string,
  ): Promise<{ product: Product; prices: Price[] }> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found.`);
    }

    const prices = await this.priceRepository.find({
      where: { product: { id: productId } },
      relations: ['product', 'store', 'period'],
      order: {
        amount: 'ASC',
      },
    });

    return {
      product,
      prices,
    };
  }

  /**
   * Crea un nuevo precio.
   * Primero valida que las entidades relacionadas existan.
   * @param createPriceDto Los datos para crear el precio.
   * @returns Una promesa que resuelve al precio creado.
   */
  async create(createPriceDto: CreatePriceDto): Promise<Price> {
    const { productId, storeId, periodId, amount } = createPriceDto;

    const { product, store, period } = await this.validateRelatedEntities(
      productId,
      storeId,
      periodId,
    );

    const newPrice = this.priceRepository.create({
      amount,
      product,
      store,
      period,
    });

    // Save the new price
    const savedPrice = await this.priceRepository.save(newPrice);
    return savedPrice;
  }

  /**
   * Actualiza un precio existente.
   * Primero valida que la entidad Price exista y, si se proporcionan,
   * también valida las nuevas entidades relacionadas.
   * @param id El ID del precio a actualizar.
   * @param updatePriceDto Los datos para actualizar el precio.
   * @returns Una promesa que resuelve al precio actualizado.
   * @throws NotFoundException Si el precio no se encuentra o alguna entidad relacionada no existe.
   */
  async update(id: string, updatePriceDto: UpdatePriceDto): Promise<Price> {
    const price = await this.findOne(id); // Obtiene el precio existente (también verifica su existencia)

    // Si se proporcionan nuevos IDs para las relaciones, valida su existencia
    let product: Product | undefined;
    let store: Store | undefined;
    let period: Period | undefined;

    if (
      updatePriceDto.productId ||
      updatePriceDto.storeId ||
      updatePriceDto.periodId
    ) {
      try {
        ({ product, store, period } = await this.validateRelatedEntities(
          updatePriceDto.productId || price.productId, // Usa el ID nuevo o el existente
          updatePriceDto.storeId || price.storeId, // Usa el ID nuevo o el existente
          updatePriceDto.periodId || price.periodId, // Usa el ID nuevo o el existente
        ));
      } catch (error) {
        // Relanza errores de NotFoundException desde validateRelatedEntities
        throw error;
      }
    }

    // Fusiona los datos del DTO con la entidad existente.
    // Asegúrate de asignar los objetos de relación si se validaron nuevos IDs.
    this.priceRepository.merge(price, {
      ...updatePriceDto,
      ...(product && { product }), // Solo asigna si se encontró un nuevo objeto producto
      ...(store && { store }), // Solo asigna si se encontró un nuevo objeto tienda
      ...(period && { period }), // Solo asigna si se encontró un nuevo objeto periodo
    });

    // Guarda los cambios en la base de datos
    return this.priceRepository.save(price);
  }

  /**
   * Elimina un precio por su ID.
   * @param id El ID del precio a eliminar.
   * @returns Una promesa que no resuelve nada (void).
   * @throws NotFoundException Si el precio no se encuentra.
   */
  async remove(id: string): Promise<void> {
    const result = await this.priceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Price with ID "${id}" not found.`);
    }
  }
}

interface PriceLike {
  productId?: string;
  amount: string | number;
  storeId?: string;
  // Add other fields as needed
}

function findShortestPrices(pricesList: PriceLike[]): PriceLike[] {
  const shortestPrices: {
    [productId: string]: PriceLike & { amount: number };
  } = {};

  for (const price of pricesList) {
    const productId = price?.productId;
    const currentAmount = parseFloat(price.amount as string); // Convert string amount to a number

    if (!productId) continue;

    // If this product hasn't been seen before, or if the current amount is lower
    if (
      !shortestPrices[productId] ||
      currentAmount < shortestPrices[productId].amount
    ) {
      shortestPrices[productId] = {
        productId: productId,
        amount: currentAmount,
        storeId: price.storeId,
      };
    }
  }

  // Convert the object back to an array of values if preferred
  return Object.values(shortestPrices);
}
