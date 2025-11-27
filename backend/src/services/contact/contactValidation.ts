/**
 * @summary
 * Validation schemas for Contact entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/contact/contactValidation
 */

import { z } from 'zod';
import {
  CONTACT_LIMITS,
  CONTACT_STATUSES,
  CONTACT_SUBJECTS,
  CONTACT_PREFERENCES,
  CONTACT_BEST_TIMES,
} from '@/constants/contact';
import { zEmail } from '@/utils/validation';

/**
 * Schema for create request validation
 */
export const createContactSchema = z.object({
  nome_completo: z
    .string()
    .min(CONTACT_LIMITS.NAME_MIN_LENGTH)
    .max(CONTACT_LIMITS.NAME_MAX_LENGTH)
    .refine((val) => val.trim().split(' ').length >= 2, {
      message: 'Deve conter nome e sobrenome',
    }),
  email: zEmail,
  telefone: z
    .string()
    .min(CONTACT_LIMITS.PHONE_MIN_DIGITS)
    .regex(/^[0-9()\-\s]+$/, 'Formato de telefone inválido'),
  preferencia_contato: z.enum(CONTACT_PREFERENCES),
  melhor_horario: z.enum(CONTACT_BEST_TIMES).optional().default('Qualquer horário'),
  id_veiculo: z.string().min(1),
  modelo_veiculo: z.string().min(1),
  assunto: z.enum(CONTACT_SUBJECTS),
  mensagem: z
    .string()
    .min(CONTACT_LIMITS.MESSAGE_MIN_LENGTH)
    .max(CONTACT_LIMITS.MESSAGE_MAX_LENGTH),
  financiamento: z.boolean().optional().default(false),
  termos_privacidade: z.literal(true, {
    errorMap: () => ({ message: 'É necessário aceitar os termos de privacidade' }),
  }),
  receber_novidades: z.boolean().optional().default(false),
  captcha_token: z.string().optional(), // In a real app, this would be required and validated
});

/**
 * Schema for update request validation
 */
export const updateContactSchema = z.object({
  status: z.enum(CONTACT_STATUSES).optional(),
  consultor_responsavel: z.string().optional(),
  notas_atendimento: z.string().optional(),
});

/**
 * Schema for list params validation
 */
export const listContactSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  status: z.enum(CONTACT_STATUSES).optional(),
  date_min: z.string().datetime().optional(),
  date_max: z.string().datetime().optional(),
  id_veiculo: z.string().optional(),
});

/**
 * Schema for ID parameter validation
 */
export const contactParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Inferred types from schemas
 */
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ListContactInput = z.infer<typeof listContactSchema>;
export type ContactParamsInput = z.infer<typeof contactParamsSchema>;
