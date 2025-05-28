// src/controllers/stores.controller.ts
import {
  Controller,
  Post,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  Get, // Asegúrate de importar Get si vas a añadir métodos Get
  Delete, // Asegúrate de importar Delete si vas a añadir métodos Delete
} from '@nestjs/common';
import { CreateStoreDto } from 'src/dto/store/create_store.dto';
import { UpdateStoreDto } from 'src/dto/store/update_store.dto';
import { Store } from 'src/entities/store/store.entity';
import { StoresService } from './store.service'; // Asumiendo que el servicio se llama store.service

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger'; // Importa los decoradores de Swagger

@ApiTags('stores') // Agrupa los endpoints de este controlador bajo la etiqueta "stores" en Swagger UI
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // --- Métodos GET (Añadidos para una API REST completa y documentación) ---
  @Get() // GET /stores
  @ApiOperation({ summary: 'Retrieve all stores' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of stores',
    type: [Store], // Indica que retorna un array de la entidad Store
  })
  async findAll(): Promise<Store[]> {
    return this.storesService.findAll(); // Asumiendo que StoresService tiene un método findAll
  }

  @Get(':id') // GET /stores/:id
  @ApiOperation({ summary: 'Retrieve a single store by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the store to retrieve',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the store',
    type: Store,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Store not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Store> {
    return this.storesService.findOne(id); // Asumiendo que StoresService tiene un método findOne
  }
  // --- Fin Métodos GET ---

  @Post() // POST /stores
  @HttpCode(HttpStatus.CREATED) // Retorna 201 Created si es exitoso
  @ApiOperation({ summary: 'Create a new store' })
  @ApiBody({
    type: CreateStoreDto,
    description: 'Data for the store to be created',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The store has been successfully created',
    type: Store, // Indica que retorna una instancia de la entidad Store
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid store data provided',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storesService.create(createStoreDto);
  }

  @Put(':id') // PUT /stores/:id
  @ApiOperation({ summary: 'Update an existing store by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the store to update',
    type: String,
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateStoreDto,
    description: 'Data to update the store (partial updates allowed)',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The store has been successfully updated',
    type: Store,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Store not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data provided',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storesService.update(id, updateStoreDto);
  }

  // --- Método DELETE (Añadido para una API REST completa y documentación) ---
  @Delete(':id') // DELETE /stores/:id
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content si es exitoso
  @ApiOperation({ summary: 'Delete a store by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the store to delete',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The store has been successfully deleted',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Store not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.storesService.remove(id); // Asumiendo que StoresService tiene un método remove
  }
  // --- Fin Método DELETE ---
}
