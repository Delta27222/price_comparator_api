// src/services/stores.service.ts (o src/modules/stores/services/stores.service.ts)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreDto } from 'src/dto/store/create_store.dto';
import { UpdateStoreDto } from 'src/dto/store/update_store.dto';
import { Store } from 'src/entities/store/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) // Inyecta el repositorio de la entidad Store
    private readonly storeRepository: Repository<Store>,
  ) {}

  /**
   * Obtiene todas las tiendas.
   * @returns Una promesa que resuelve a un array de tiendas.
   */
  async findAll(): Promise<Store[]> {
    return this.storeRepository.find();
  }

  /**
   * Obtiene una tienda por su ID.
   * @param id El ID de la tienda (UUID).
   * @returns Una promesa que resuelve a la tienda encontrada.
   * @throws NotFoundException Si la tienda no se encuentra.
   */
  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException(`Store with ID "${id}" not found.`);
    }
    return store;
  }

  /**
   * Crea una nueva tienda.
   * @param createStoreDto Los datos para crear la tienda.
   * @returns Una promesa que resuelve a la tienda creada.
   */
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    // 'create' crea una nueva instancia de la entidad Store, pero no la guarda en la BD
    const newStore = this.storeRepository.create(createStoreDto);
    // 'save' guarda la instancia en la base de datos (inserta o actualiza)
    return this.storeRepository.save(newStore);
  }

  /**
   * Actualiza una tienda existente.
   * @param id El ID de la tienda a actualizar.
   * @param updateStoreDto Los datos para actualizar la tienda.
   * @returns Una promesa que resuelve a la tienda actualizada.
   * @throws NotFoundException Si la tienda no se encuentra.
   */
  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    // Primero, intenta encontrar la tienda. Si no existe, NotFoundException será lanzada.
    const store = await this.findOne(id);

    // 'merge' combina el objeto existente (store) con el objeto de actualización (updateStoreDto)
    // Esto asegura que solo las propiedades proporcionadas en updateStoreDto sean modificadas.
    this.storeRepository.merge(store, updateStoreDto);

    // 'save' actualiza la tienda existente en la base de datos
    return this.storeRepository.save(store);
  }

  /**
   * Elimina una tienda por su ID.
   * @param id El ID de la tienda a eliminar.
   * @returns Una promesa que no resuelve nada (void).
   * @throws NotFoundException Si la tienda no se encuentra.
   */
  async remove(id: string): Promise<void> {
    // 'delete' elimina el registro por ID. Retorna un objeto con 'affected' indicando las filas eliminadas.
    const result = await this.storeRepository.delete(id);

    if (result.affected === 0) {
      // Si no se eliminó ninguna fila, significa que la tienda con ese ID no existía.
      throw new NotFoundException(`Store with ID "${id}" not found.`);
    }
    // No hay nada que retornar en caso de éxito para una eliminación.
  }
}
