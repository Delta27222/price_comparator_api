// src/controllers/prices.controller.ts
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
  ParseUUIDPipe, // Para validar que el ID de la ruta sea un UUID válido
  UsePipes,
  ValidationPipe, // Para aplicar validación a los DTOs
} from '@nestjs/common';
import { PricesService } from './price.service'; // Asegúrate de que la ruta sea correcta
import { Price } from 'src/entities/price/price.entity'; // Asegúrate de que la ruta sea correcta
import { CreatePriceDto } from 'src/dto/price/create_price.dto'; // Asegúrate de que la ruta sea correcta
import { UpdatePriceDto } from 'src/dto/price/update_price.dto'; // Asegúrate de que la ruta sea correcta

import {
  ApiTags, // Para agrupar endpoints en Swagger UI
  ApiOperation, // Para un resumen de la operación
  ApiResponse, // Para describir posibles respuestas
  ApiBody, // Para describir el cuerpo de la solicitud
  ApiParam, // Para describir parámetros de ruta
} from '@nestjs/swagger'; // Importa los decoradores de Swagger

@ApiTags('prices') // Agrupa los endpoints de este controlador bajo la etiqueta "prices" en Swagger UI
@Controller('prices') // Prefijo de ruta para todas las rutas de este controlador: /prices
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get() // GET /prices
  @ApiOperation({ summary: 'Retrieve all prices' }) // Resumen de la operación
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved a list of prices',
    type: [Price], // Indica que retorna un array de la entidad Price
  })
  async findAll(): Promise<Price[]> {
    return this.pricesService.findAll();
  }

  @Get(':id') // GET /prices/:id
  @ApiOperation({ summary: 'Retrieve a single price by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the price to retrieve',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the price',
    type: Price,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Price not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Price> {
    return this.pricesService.findOne(id);
  }

  @Post() // POST /prices
  @HttpCode(HttpStatus.CREATED) // Retorna 201 Created si la creación es exitosa.
  @ApiOperation({ summary: 'Create a new price' })
  @ApiBody({
    type: CreatePriceDto,
    description:
      'Data for the price to be created, including associated product, store, and period IDs.',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The price has been successfully created',
    type: Price,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid price data or related entity IDs provided.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'A related Product, Store, or Period was not found.',
  }) // Specific for Price due to relations
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Aplica validación DTO.
  async create(@Body() createPriceDto: CreatePriceDto): Promise<Price> {
    return this.pricesService.create(createPriceDto);
  }

  @Put(':id') // PUT /prices/:id
  @ApiOperation({ summary: 'Update an existing price by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the price to update',
    type: String,
    format: 'uuid',
  })
  @ApiBody({
    type: UpdatePriceDto,
    description:
      'Data to update the price (partial updates allowed). Can also update associated entity IDs.',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The price has been successfully updated',
    type: Price,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Price or a related entity not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data provided.',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePriceDto: UpdatePriceDto,
  ): Promise<Price> {
    return this.pricesService.update(id, updatePriceDto);
  }

  @Delete(':id') // DELETE /prices/:id
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content si la eliminación es exitosa.
  @ApiOperation({ summary: 'Delete a price by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the price to delete',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The price has been successfully deleted',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Price not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.pricesService.remove(id);
  }
}
