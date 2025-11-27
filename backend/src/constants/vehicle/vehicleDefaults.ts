/**
 * @summary
 * Default values and constants for Vehicle entity.
 * Provides centralized configuration for entity creation, validation limits,
 * and business rules.
 *
 * @module constants/vehicle/vehicleDefaults
 */

/**
 * @interface VehicleDefaultsType
 * @description Default configuration values applied when creating new Vehicle entities.
 *
 * @property {number} ITEMS_PER_PAGE - Default number of items per page (12)
 * @property {string} DEFAULT_SORT - Default sort order ('relevance')
 * @property {number} MAX_PRICE - Maximum allowed price for validation
 */
export const VEHICLE_DEFAULTS = {
  ITEMS_PER_PAGE: 12,
  DEFAULT_SORT: 'relevance',
  MAX_PRICE: 100000000, // 100 million
  MIN_YEAR: 1900,
  MAX_YEAR: new Date().getFullYear() + 1,
} as const;

/** Type representing the VEHICLE_DEFAULTS constant */
export type VehicleDefaultsType = typeof VEHICLE_DEFAULTS;

/**
 * @interface VehicleLimitsType
 * @description Validation constraints for Vehicle entity fields.
 */
export const VEHICLE_LIMITS = {
  MODEL_MAX_LENGTH: 50,
  BRAND_MAX_LENGTH: 50,
  URL_MAX_LENGTH: 2048,
  TITLE_MAX_LENGTH: 100,
  DESC_MAX_LENGTH: 2000,
  PHOTO_CAPTION_MAX_LENGTH: 50,
  MAX_PHOTOS: 20,
} as const;

/** Type representing the VEHICLE_LIMITS constant */
export type VehicleLimitsType = typeof VEHICLE_LIMITS;

/**
 * @constant VEHICLE_TRANSMISSION_TYPES
 * @description Allowed transmission types
 */
export const VEHICLE_TRANSMISSION_TYPES = [
  'Manual',
  'Automático',
  'CVT',
  'Semi-automático',
  'Automatizado',
] as const;

export type VehicleTransmissionType = (typeof VEHICLE_TRANSMISSION_TYPES)[number];

/**
 * @constant VEHICLE_FUEL_TYPES
 * @description Allowed fuel types
 */
export const VEHICLE_FUEL_TYPES = [
  'Gasolina',
  'Etanol',
  'Flex',
  'Diesel',
  'Elétrico',
  'Híbrido',
] as const;

export type VehicleFuelType = (typeof VEHICLE_FUEL_TYPES)[number];

/**
 * @constant VEHICLE_BODY_TYPES
 * @description Allowed body types
 */
export const VEHICLE_BODY_TYPES = [
  'Hatch',
  'Sedan',
  'SUV',
  'Picape',
  'Minivan',
  'Conversível',
  'Cupê',
  'Wagon',
] as const;

export type VehicleBodyType = (typeof VEHICLE_BODY_TYPES)[number];

/**
 * @constant VEHICLE_STATUSES
 * @description Allowed vehicle statuses
 */
export const VEHICLE_STATUSES = ['Disponível', 'Reservado', 'Vendido'] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

/**
 * @constant VEHICLE_ITEM_CATEGORIES
 * @description Allowed categories for items and options
 */
export const VEHICLE_ITEM_CATEGORIES = [
  'Conforto',
  'Segurança',
  'Tecnologia',
  'Performance',
  'Estética',
] as const;

export type VehicleItemCategory = (typeof VEHICLE_ITEM_CATEGORIES)[number];

/**
 * @constant VEHICLE_PAYMENT_METHODS
 * @description Allowed payment methods
 */
export const VEHICLE_PAYMENT_METHODS = [
  'À vista',
  'Financiamento',
  'Consórcio',
  'Leasing',
] as const;

export type VehiclePaymentMethod = (typeof VEHICLE_PAYMENT_METHODS)[number];

/**
 * @constant VEHICLE_SORT_OPTIONS
 * @description Allowed sort options
 */
export const VEHICLE_SORT_OPTIONS = [
  'relevance',
  'price_asc',
  'price_desc',
  'year_desc',
  'year_asc',
  'model_asc',
  'model_desc',
] as const;

export type VehicleSortOption = (typeof VEHICLE_SORT_OPTIONS)[number];
