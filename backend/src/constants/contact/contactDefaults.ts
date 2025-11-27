/**
 * @summary
 * Default values and constants for Contact entity.
 * Provides centralized configuration for contact forms, status, and validation rules.
 *
 * @module constants/contact/contactDefaults
 */

/**
 * @constant CONTACT_STATUSES
 * @description Allowed contact statuses
 */
export const CONTACT_STATUSES = ['Novo', 'Em atendimento', 'Concluído', 'Cancelado'] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

/**
 * @constant CONTACT_SUBJECTS
 * @description Allowed contact subjects
 */
export const CONTACT_SUBJECTS = [
  'Informações gerais',
  'Agendamento de test drive',
  'Negociação de preço',
  'Financiamento',
  'Outro',
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

/**
 * @constant CONTACT_PREFERENCES
 * @description Allowed contact preferences
 */
export const CONTACT_PREFERENCES = ['Telefone', 'E-mail', 'WhatsApp'] as const;

export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

/**
 * @constant CONTACT_BEST_TIMES
 * @description Allowed best times for contact
 */
export const CONTACT_BEST_TIMES = ['Manhã', 'Tarde', 'Noite', 'Qualquer horário'] as const;

export type ContactBestTime = (typeof CONTACT_BEST_TIMES)[number];

/**
 * @interface ContactLimitsType
 * @description Validation constraints for Contact entity fields.
 */
export const CONTACT_LIMITS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 100,
  PHONE_MIN_DIGITS: 10,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
} as const;

export type ContactLimitsType = typeof CONTACT_LIMITS;

/**
 * @constant CONTACT_DEFAULTS
 * @description Default values for contact operations
 */
export const CONTACT_DEFAULTS = {
  ITEMS_PER_PAGE: 20,
  DEFAULT_SORT: 'date_desc',
  RESPONSE_DEADLINE_HOURS: 24,
} as const;
