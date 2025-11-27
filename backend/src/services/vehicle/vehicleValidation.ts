/**
 * @summary
 * Validation schemas for Vehicle entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/vehicle/vehicleValidation
 */

import { z } from 'zod';
import {
  VEHICLE_LIMITS,
  VEHICLE_TRANSMISSION_TYPES,
  VEHICLE_SORT_OPTIONS,
  VEHICLE_FUEL_TYPES,
  VEHICLE_BODY_TYPES,
  VEHICLE_STATUSES,
  VEHICLE_ITEM_CATEGORIES,
  VEHICLE_PAYMENT_METHODS,
} from '@/constants/vehicle';

// Helper schemas
const photoSchema = z.object({
  url: z.string().url().max(VEHICLE_LIMITS.URL_MAX_LENGTH),
  principal: z.boolean(),
  legenda: z.string().max(VEHICLE_LIMITS.PHOTO_CAPTION_MAX_LENGTH).optional(),
});

const itemSchema = z.object({
  nome: z.string().min(1).max(100),
  categoria: z.enum(VEHICLE_ITEM_CATEGORIES),
});

const historySchema = z.object({
  procedencia: z.string().min(1).max(50),
  proprietarios: z.number().int().min(0),
  garantia: z.string().max(100).optional(),
  revisoes: z
    .array(
      z.object({
        data: z.string(),
        km: z.number().int().min(0),
        local: z.string().max(100),
      })
    )
    .optional(),
  sinistros: z
    .array(
      z.object({
        data: z.string(),
        tipo: z.string().max(50),
        descricao: z.string().max(200),
      })
    )
    .optional(),
  laudo_tecnico: z
    .object({
      data: z.string(),
      resultado: z.string().max(50),
    })
    .optional(),
});

const salesConditionsSchema = z.object({
  formas_pagamento: z.array(z.enum(VEHICLE_PAYMENT_METHODS)).min(1),
  financiamento: z
    .object({
      entrada_minima: z.number().min(0),
      taxa_juros: z.number().min(0),
      prazo_maximo: z.number().int().positive(),
    })
    .optional(),
  aceita_troca: z.boolean(),
  observacoes_venda: z.string().max(500).optional(),
  documentacao_necessaria: z.array(
    z.object({
      nome: z.string().min(1).max(100),
      obs: z.string().max(200).optional(),
    })
  ),
  situacao_documental: z.object({
    status: z.string().min(1).max(50),
    pendencias: z.string().max(200).optional(),
    obs: z.string().max(200).optional(),
  }),
});

/**
 * Schema for create request validation
 */
export const createVehicleSchema = z.object({
  titulo_anuncio: z.string().max(VEHICLE_LIMITS.TITLE_MAX_LENGTH).optional(),
  preco: z.number().positive(),
  status: z.enum(VEHICLE_STATUSES),
  fotos: z.array(photoSchema).min(1).max(VEHICLE_LIMITS.MAX_PHOTOS),
  marca: z.string().min(1).max(VEHICLE_LIMITS.BRAND_MAX_LENGTH),
  modelo: z.string().min(1).max(VEHICLE_LIMITS.MODEL_MAX_LENGTH),
  ano_fabricacao: z.number().int().min(1900),
  ano_modelo: z.number().int().min(1900),
  quilometragem: z.number().int().min(0),
  combustivel: z.enum(VEHICLE_FUEL_TYPES),
  cambio: z.enum(VEHICLE_TRANSMISSION_TYPES),
  potencia: z.string().max(20),
  cor: z.string().max(30),
  portas: z.number().int().min(2).max(5),
  carroceria: z.enum(VEHICLE_BODY_TYPES),
  motor: z.string().max(20),
  final_placa: z.number().int().min(0).max(9),
  itens_serie: z.array(itemSchema),
  opcionais: z.array(itemSchema),
  historico: historySchema.optional(),
  condicoes: salesConditionsSchema,
});

/**
 * Schema for update request validation
 */
export const updateVehicleSchema = createVehicleSchema.partial();

/**
 * Schema for list params validation
 */
export const listVehicleSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.enum(VEHICLE_SORT_OPTIONS).optional(),
  marca: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (Array.isArray(val) ? val : val ? [val] : undefined)),
  modelo: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (Array.isArray(val) ? val : val ? [val] : undefined)),
  ano_min: z.coerce.number().int().optional(),
  ano_max: z.coerce.number().int().optional(),
  preco_min: z.coerce.number().optional(),
  preco_max: z.coerce.number().optional(),
  cambio: z
    .union([z.enum(VEHICLE_TRANSMISSION_TYPES), z.array(z.enum(VEHICLE_TRANSMISSION_TYPES))])
    .optional()
    .transform((val) => (Array.isArray(val) ? val : val ? [val] : undefined)),
});

/**
 * Schema for ID parameter validation
 */
export const vehicleParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Inferred types from schemas
 */
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type ListVehicleInput = z.infer<typeof listVehicleSchema>;
export type VehicleParamsInput = z.infer<typeof vehicleParamsSchema>;
