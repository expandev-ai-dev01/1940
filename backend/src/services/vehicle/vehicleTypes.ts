/**
 * @summary
 * Type definitions for Vehicle entity.
 *
 * @module services/vehicle/vehicleTypes
 */

import {
  VehicleTransmissionType,
  VehicleSortOption,
  VehicleFuelType,
  VehicleBodyType,
  VehicleStatus,
  VehicleItemCategory,
  VehiclePaymentMethod,
} from '@/constants/vehicle';

/**
 * @interface VehiclePhoto
 * @description Represents a vehicle photo
 */
export interface VehiclePhoto {
  url: string;
  principal: boolean;
  legenda?: string;
}

/**
 * @interface VehicleItem
 * @description Represents a standard or optional item
 */
export interface VehicleItem {
  nome: string;
  categoria: VehicleItemCategory;
}

/**
 * @interface VehicleHistory
 * @description Represents vehicle history information
 */
export interface VehicleHistory {
  procedencia: string;
  proprietarios: number;
  garantia?: string;
  revisoes?: { data: string; km: number; local: string }[];
  sinistros?: { data: string; tipo: string; descricao: string }[];
  laudo_tecnico?: { data: string; resultado: string };
}

/**
 * @interface VehicleSalesConditions
 * @description Represents sales conditions
 */
export interface VehicleSalesConditions {
  formas_pagamento: VehiclePaymentMethod[];
  financiamento?: {
    entrada_minima: number;
    taxa_juros: number;
    prazo_maximo: number;
  };
  aceita_troca: boolean;
  observacoes_venda?: string;
  documentacao_necessaria: { nome: string; obs?: string }[];
  situacao_documental: { status: string; pendencias?: string; obs?: string };
}

/**
 * @interface VehicleEntity
 * @description Represents a complete vehicle entity with all details
 */
export interface VehicleEntity {
  id: number;
  id_veiculo: string;
  // Basic Info
  titulo_anuncio: string;
  preco: number;
  status: VehicleStatus;
  // Photos
  fotos: VehiclePhoto[];
  imagem_principal: string; // Derived from fotos for list view compatibility
  // Specs
  marca: string;
  modelo: string;
  ano_fabricacao: number;
  ano_modelo: number;
  quilometragem: number;
  combustivel: VehicleFuelType;
  cambio: VehicleTransmissionType;
  potencia: string;
  cor: string;
  portas: number;
  carroceria: VehicleBodyType;
  motor: string;
  final_placa: number;
  // Items
  itens_serie: VehicleItem[];
  opcionais: VehicleItem[];
  // History
  historico?: VehicleHistory;
  // Sales
  condicoes: VehicleSalesConditions;
  // System
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface VehicleDetailResponse
 * @description Extended response for vehicle details including derived data
 */
export interface VehicleDetailResponse extends VehicleEntity {
  veiculos_similares: Partial<VehicleEntity>[];
  compartilhamento: {
    url: string;
    texto: string;
    redes: string[];
  };
}

/**
 * @interface VehicleCreateRequest
 * @description Request payload for creating a vehicle
 */
export interface VehicleCreateRequest {
  titulo_anuncio?: string; // Optional, can be auto-generated
  preco: number;
  status: VehicleStatus;
  fotos: VehiclePhoto[];
  marca: string;
  modelo: string;
  ano_fabricacao: number;
  ano_modelo: number;
  quilometragem: number;
  combustivel: VehicleFuelType;
  cambio: VehicleTransmissionType;
  potencia: string;
  cor: string;
  portas: number;
  carroceria: VehicleBodyType;
  motor: string;
  final_placa: number;
  itens_serie: VehicleItem[];
  opcionais: VehicleItem[];
  historico?: VehicleHistory;
  condicoes: VehicleSalesConditions;
}

/**
 * @interface VehicleUpdateRequest
 * @description Request payload for updating a vehicle
 */
export interface VehicleUpdateRequest extends Partial<VehicleCreateRequest> {}

/**
 * @interface VehicleListParams
 * @description Parameters for listing vehicles with filters and pagination
 */
export interface VehicleListParams {
  page?: number;
  pageSize?: number;
  sort?: VehicleSortOption;
  marca?: string[];
  modelo?: string[];
  ano_min?: number;
  ano_max?: number;
  preco_min?: number;
  preco_max?: number;
  cambio?: VehicleTransmissionType[];
}

/**
 * @interface VehicleListResponse
 * @description Response structure for listing vehicles
 */
export interface VehicleListResponse {
  data: VehicleEntity[];
  metadata: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * @interface VehicleFiltersResponse
 * @description Response structure for available filters
 */
export interface VehicleFiltersResponse {
  marcas: string[];
  modelos: string[];
  anos: number[];
  precoMin: number;
  precoMax: number;
  cambios: string[];
}
