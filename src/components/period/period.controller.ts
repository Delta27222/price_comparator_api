// src/controllers/periods.controller.ts
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
  ParseUUIDPipe, // Para validar que el ID sea un UUID válido
  UsePipes,
  ValidationPipe, // Para aplicar validación a los DTOs
} from '@nestjs/common';
import { PeriodsService } from './period.service';
import { Period } from 'src/entities/period/period.entity';
import { CreatePeriodDto } from 'src/dto/period/create_period.dto';
import { UpdatePeriodDto } from 'src/dto/period/update_period.dto';
import {
  ApiTags, // Para agrupar endpoints en Swagger UI
  ApiOperation, // Para un resumen de la operación
  ApiResponse, // Para describir posibles respuestas
  ApiBody, // Para describir el cuerpo de la solicitud
  ApiParam, // Para describir parámetros de ruta
} from '@nestjs/swagger'; // Importa los decoradores de Swagger

@ApiTags('periods') // Agrupa los endpoints de este controlador bajo la etiqueta "periods" en Swagger UI
@Controller('periods') // Prefijo de ruta para todas las rutas de este controlador: /periods
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Get() // GET /periods
  @ApiOperation({ summary: 'Retrieve all periods' }) // Resumen de la operación
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of periods',
    type: [Period], // Indica que retorna un array de la entidad Period
  })
  async findAll(): Promise<Period[]> {
    return this.periodsService.findAll();
  }

  @Get(':id') // GET /periods/:id
  @ApiOperation({ summary: 'Retrieve a single period by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the period to retrieve',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the period',
    type: Period,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Period not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Period> {
    return this.periodsService.findOne(id);
  }

  @Post() // POST /periods
  @HttpCode(HttpStatus.CREATED) // Retorna 201 Created si la creación es exitosa.
  @ApiOperation({ summary: 'Create a new period' })
  @ApiBody({
    type: CreatePeriodDto,
    description: 'Data for the period to be created',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The period has been successfully created',
    type: Period,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid period data provided',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Aplica validación DTO.
  async create(@Body() createPeriodDto: CreatePeriodDto): Promise<Period> {
    return this.periodsService.create(createPeriodDto);
  }

  @Put(':id') // PUT /periods/:id
  @ApiOperation({ summary: 'Update an existing period by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the period to update',
    type: String,
    format: 'uuid',
  })
  @ApiBody({
    type: UpdatePeriodDto,
    description: 'Data to update the period (partial updates allowed)',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The period has been successfully updated',
    type: Period,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Period not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data provided',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePeriodDto: UpdatePeriodDto,
  ): Promise<Period> {
    return this.periodsService.update(id, updatePeriodDto);
  }

  @Delete(':id') // DELETE /periods/:id
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content si la eliminación es exitosa.
  @ApiOperation({ summary: 'Delete a period by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the period to delete',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The period has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Period not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.periodsService.remove(id);
  }
}
