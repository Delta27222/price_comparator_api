// src/controllers/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from 'src/dto/product/create_product.dto';
import { UpdateProductDto } from 'src/dto/product/update_product.dto';
import { Product } from 'src/entities/product/product.entity';
import {
  ApiTags, // For grouping endpoints in Swagger UI
  ApiOperation, // For a summary of the operation
  ApiResponse, // For describing possible responses
  ApiBody, // For describing the request body
  ApiParam, // For describing path parameters
} from '@nestjs/swagger'; // Import Swagger decorators

@ApiTags('products') // Groups all endpoints under the "products" tag in Swagger UI
@Controller('products') // Prefijo de ruta para todas las rutas de este controlador: /products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get() // GET /products
  @ApiOperation({ summary: 'Retrieve all products' }) // Operation summary for Swagger
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of products',
    type: [Product], // Specifies the return type for Swagger documentation
  })
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id') // GET /products/:id
  @ApiOperation({ summary: 'Retrieve a single product by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the product to retrieve',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the product',
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post() // POST /products
  @HttpCode(HttpStatus.CREATED) // Returns 201 Created on success
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: CreateProductDto,
    description: 'Data for the product to be created',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The product has been successfully created',
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid product data provided',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id') // PUT /products/:id
  @ApiOperation({ summary: 'Update an existing product by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the product to update',
    type: String,
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Data to update the product (partial updates allowed)',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully updated',
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data provided',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id') // DELETE /products/:id
  @HttpCode(HttpStatus.NO_CONTENT) // Returns 204 No Content on successful deletion
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the product to delete',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The product has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.productsService.remove(id);
  }
}
