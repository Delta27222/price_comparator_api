// src/services/products.service.ts (o src/modules/products/services/products.service.ts)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product/product.entity';
import { CreateProductDto } from 'src/dto/product/create_product.dto';
import { UpdateProductDto } from 'src/dto/product/update_product.dto';
import { PricesService } from 'src/components/price/price.service';
import { StoresService } from 'src/components/store/store.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly pricesService: PricesService,
    private readonly storeService: StoresService,
  ) {}

  async findAll(): Promise<Product[]> {
    // 1. Get all products from the database
    const products = await this.productRepository.find();
    const stores = await this.storeService.findAll(); // Assuming this returns all stores

    // 2. Get the shortest prices for all products
    const shortestPrices =
      await this.pricesService.findAllProductsWithShortestPrice();

    // 3. Create a map for quick lookup of shortest prices by productId
    const shortestPriceMap = new Map<
      string,
      { amount: number; storeId: string; storeName: string }
    >();
    shortestPrices.forEach((price) => {
      if (price.productId) {
        const store = stores.find((s) => s.id === price.storeId);
        shortestPriceMap.set(price.productId, {
          amount: Number(price.amount),
          storeId: price.storeId ?? '',
          storeName: store ? store.name : '',
        });
      }
      // Optionally, handle the case where productId is undefined (e.g., log or skip)
    });

    // 4. Attach the shortest price to each product
    const productsWithPrices = products.map((product) => {
      const priceInfo = shortestPriceMap.get(product.id); // Assuming product.id is the productId
      if (priceInfo) {
        return {
          ...product,
          shortestPrice: priceInfo.amount,
          shortestPriceStoreName: priceInfo.storeName,
        };
      }
      return {
        ...product,
        shortestPrice: null,
        shortestPriceStoreName: null,
      };
    });

    return productsWithPrices;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id); // Reutiliza findOne para verificar si existe
    // 'merge' combinará las propiedades del DTO con el producto existente
    this.productRepository.merge(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
