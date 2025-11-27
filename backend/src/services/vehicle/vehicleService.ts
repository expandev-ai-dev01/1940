/**
 * @summary
 * Business logic for Vehicle entity.
 * Handles CRUD operations, filtering, sorting and pagination.
 *
 * @module services/vehicle/vehicleService
 */

import { VEHICLE_DEFAULTS } from '@/constants/vehicle';
import { vehicleStore } from '@/instances/vehicle';
import { ServiceError } from '@/utils';
import {
  VehicleEntity,
  VehicleListResponse,
  VehicleFiltersResponse,
  VehicleDetailResponse,
} from './vehicleTypes';
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleParamsSchema,
  listVehicleSchema,
} from './vehicleValidation';

/**
 * @summary
 * Lists vehicles with filtering, sorting and pagination.
 *
 * @function vehicleList
 * @module services/vehicle
 *
 * @param {unknown} params - Query parameters
 * @returns {Promise<VehicleListResponse>} Paged list of vehicles
 */
export async function vehicleList(params: unknown): Promise<VehicleListResponse> {
  const validation = listVehicleSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid parameters', 400, validation.error.errors);
  }

  const filters = validation.data;
  let records = vehicleStore.getAll();

  // Apply Filters
  if (filters.marca && filters.marca.length > 0) {
    records = records.filter((r) => filters.marca!.includes(r.marca));
  }

  if (filters.modelo && filters.modelo.length > 0) {
    records = records.filter((r) => filters.modelo!.includes(r.modelo));
  }

  if (filters.ano_min) {
    records = records.filter((r) => r.ano_fabricacao >= filters.ano_min!);
  }

  if (filters.ano_max) {
    records = records.filter((r) => r.ano_fabricacao <= filters.ano_max!);
  }

  if (filters.preco_min) {
    records = records.filter((r) => r.preco >= filters.preco_min!);
  }

  if (filters.preco_max) {
    records = records.filter((r) => r.preco <= filters.preco_max!);
  }

  if (filters.cambio && filters.cambio.length > 0) {
    records = records.filter((r) => r.cambio && filters.cambio!.includes(r.cambio));
  }

  // Apply Sorting
  const sort = filters.sort || VEHICLE_DEFAULTS.DEFAULT_SORT;
  records.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.preco - b.preco;
      case 'price_desc':
        return b.preco - a.preco;
      case 'year_asc':
        return a.ano_fabricacao - b.ano_fabricacao;
      case 'year_desc':
        return b.ano_fabricacao - a.ano_fabricacao;
      case 'model_asc':
        return a.modelo.localeCompare(b.modelo);
      case 'model_desc':
        return b.modelo.localeCompare(a.modelo);
      case 'relevance':
      default:
        return b.id - a.id; // Newest first as relevance proxy
    }
  });

  // Apply Pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || VEHICLE_DEFAULTS.ITEMS_PER_PAGE;
  const total = records.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const pagedData = records.slice(offset, offset + pageSize);

  return {
    data: pagedData,
    metadata: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}

/**
 * @summary
 * Retrieves available filters based on current data.
 *
 * @function vehicleGetFilters
 * @module services/vehicle
 *
 * @returns {Promise<VehicleFiltersResponse>} Available filter options
 */
export async function vehicleGetFilters(): Promise<VehicleFiltersResponse> {
  const records = vehicleStore.getAll();

  const marcas = Array.from(new Set(records.map((r) => r.marca))).sort();
  const modelos = Array.from(new Set(records.map((r) => r.modelo))).sort();
  const anos = Array.from(new Set(records.map((r) => r.ano_fabricacao))).sort((a, b) => b - a);
  const precios = records.map((r) => r.preco);
  const cambios = Array.from(
    new Set(records.map((r) => r.cambio).filter(Boolean) as string[])
  ).sort();

  return {
    marcas,
    modelos,
    anos,
    precoMin: precios.length ? Math.min(...precios) : 0,
    precoMax: precios.length ? Math.max(...precios) : 0,
    cambios,
  };
}

/**
 * @summary
 * Creates a new vehicle.
 *
 * @function vehicleCreate
 * @module services/vehicle
 *
 * @param {unknown} body - Request body
 * @returns {Promise<VehicleEntity>} Created vehicle
 */
export async function vehicleCreate(body: unknown): Promise<VehicleEntity> {
  const validation = createVehicleSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const data = validation.data;
  const id = vehicleStore.getNextId();
  const now = new Date().toISOString();

  // Auto-generate title if not provided
  const titulo_anuncio =
    data.titulo_anuncio || `${data.marca} ${data.modelo} ${data.ano_fabricacao}`;

  // Determine principal image
  const principalPhoto = data.fotos.find((f) => f.principal) || data.fotos[0];
  const imagem_principal = principalPhoto ? principalPhoto.url : '';

  const newVehicle: VehicleEntity = {
    id,
    id_veiculo: id.toString(),
    ...data,
    titulo_anuncio,
    imagem_principal,
    dateCreated: now,
    dateModified: now,
  };

  vehicleStore.add(newVehicle);
  return newVehicle;
}

/**
 * @summary
 * Gets a vehicle by ID with full details and derived data.
 *
 * @function vehicleGet
 * @module services/vehicle
 *
 * @param {unknown} params - Request params
 * @returns {Promise<VehicleDetailResponse>} Vehicle details
 */
export async function vehicleGet(params: unknown): Promise<VehicleDetailResponse> {
  const validation = vehicleParamsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = vehicleStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Vehicle not found', 404);
  }

  // Calculate Similar Vehicles
  // Criteria: Same Brand OR Same Body Type, Price +/- 20%, Exclude current
  const allRecords = vehicleStore.getAll();
  const similar = allRecords
    .filter(
      (v) =>
        v.id !== record.id &&
        (v.marca === record.marca || v.carroceria === record.carroceria) &&
        v.preco >= record.preco * 0.8 &&
        v.preco <= record.preco * 1.2
    )
    .slice(0, 6)
    .map((v) => ({
      id: v.id,
      titulo_anuncio: v.titulo_anuncio,
      preco: v.preco,
      imagem_principal: v.imagem_principal,
      marca: v.marca,
      modelo: v.modelo,
      ano_fabricacao: v.ano_fabricacao,
      quilometragem: v.quilometragem,
    }));

  // Generate Sharing Info
  const baseUrl = process.env.CORS_ORIGINS?.split(',')[0] || 'http://localhost:3000';
  const slug = `${record.marca}-${record.modelo}-${record.ano_fabricacao}-${record.id}`
    .toLowerCase()
    .replace(/\s+/g, '-');
  const shareUrl = `${baseUrl}/veiculo/${slug}`;

  const shareText = `Confira este ${record.marca} ${record.modelo} ${
    record.ano_fabricacao
  } por R$ ${record.preco.toLocaleString('pt-BR')}`;

  return {
    ...record,
    veiculos_similares: similar,
    compartilhamento: {
      url: shareUrl,
      texto: shareText,
      redes: ['Facebook', 'Twitter', 'WhatsApp', 'Telegram', 'Email'],
    },
  };
}

/**
 * @summary
 * Updates a vehicle.
 *
 * @function vehicleUpdate
 * @module services/vehicle
 *
 * @param {unknown} params - Request params
 * @param {unknown} body - Request body
 * @returns {Promise<VehicleEntity>} Updated vehicle
 */
export async function vehicleUpdate(params: unknown, body: unknown): Promise<VehicleEntity> {
  const paramsValidation = vehicleParamsSchema.safeParse(params);
  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = updateVehicleSchema.safeParse(body);
  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = vehicleStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Vehicle not found', 404);
  }

  const data = bodyValidation.data;

  // Update derived fields if necessary
  let titulo_anuncio = existing.titulo_anuncio;
  if (data.titulo_anuncio) {
    titulo_anuncio = data.titulo_anuncio;
  } else if (data.marca || data.modelo || data.ano_fabricacao) {
    const marca = data.marca || existing.marca;
    const modelo = data.modelo || existing.modelo;
    const ano = data.ano_fabricacao || existing.ano_fabricacao;
    titulo_anuncio = `${marca} ${modelo} ${ano}`;
  }

  let imagem_principal = existing.imagem_principal;
  if (data.fotos) {
    const principalPhoto = data.fotos.find((f) => f.principal) || data.fotos[0];
    imagem_principal = principalPhoto ? principalPhoto.url : '';
  }

  const updated = vehicleStore.update(id, {
    ...data,
    titulo_anuncio,
    imagem_principal,
    dateModified: new Date().toISOString(),
  });

  return updated as VehicleEntity;
}

/**
 * @summary
 * Deletes a vehicle.
 *
 * @function vehicleDelete
 * @module services/vehicle
 *
 * @param {unknown} params - Request params
 * @returns {Promise<{ message: string }>} Success message
 */
export async function vehicleDelete(params: unknown): Promise<{ message: string }> {
  const validation = vehicleParamsSchema.safeParse(params);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  if (!vehicleStore.exists(id)) {
    throw new ServiceError('NOT_FOUND', 'Vehicle not found', 404);
  }

  vehicleStore.delete(id);
  return { message: 'Deleted successfully' };
}
