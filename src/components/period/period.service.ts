/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/services/periods.service.ts (o src/modules/periods/services/periods.service.ts)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePeriodDto } from 'src/dto/period/create_period.dto';
import { UpdatePeriodDto } from 'src/dto/period/update_period.dto';
import { Period } from 'src/entities/period/period.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period) // Inyecta el repositorio de la entidad Period
    private readonly periodRepository: Repository<Period>,
  ) {}

  /**
   * Obtiene todos los periodos.
   * @returns Una promesa que resuelve a un array de periodos.
   */
  async findAll(): Promise<Period[]> {
    return this.periodRepository.find();
  }

  /**
   * Obtiene un periodo por su ID.
   * @param id El ID del periodo (UUID).
   * @returns Una promesa que resuelve al periodo encontrado.
   * @throws NotFoundException Si el periodo no se encuentra.
   */
  async findOne(id: string): Promise<Period> {
    const period = await this.periodRepository.findOne({ where: { id } });
    if (!period) {
      throw new NotFoundException(`Period with ID "${id}" not found.`);
    }
    return period;
  }

  /**
   * Crea un nuevo periodo.
   * @param createPeriodDto Los datos para crear el periodo.
   * @returns Una promesa que resuelve al periodo creado.
   */
  async create(createPeriodDto: CreatePeriodDto): Promise<Period> {
    const newPeriod = this.periodRepository.create(createPeriodDto);
    return this.periodRepository.save(newPeriod);
  }

  /**
   * Actualiza un periodo existente.
   * @param id El ID del periodo a actualizar.
   * @param updatePeriodDto Los datos para actualizar el periodo.
   * @returns Una promesa que resuelve al periodo actualizado.
   * @throws NotFoundException Si el periodo no se encuentra.
   */
  async update(id: string, updatePeriodDto: UpdatePeriodDto): Promise<Period> {
    const period = await this.findOne(id); // Reutiliza findOne para verificar si existe y obtenerlo.
    this.periodRepository.merge(period, updatePeriodDto); // Combina los datos del DTO con la entidad existente.
    return this.periodRepository.save(period); // Guarda los cambios.
  }

  /**
   * Elimina un periodo por su ID.
   * @param id El ID del periodo a eliminar.
   * @returns Una promesa que no resuelve nada (void).
   * @throws NotFoundException Si el periodo no se encuentra.
   */
  async remove(id: string): Promise<void> {
    const result = await this.periodRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Period with ID "${id}" not found.`);
    }
  }
}
