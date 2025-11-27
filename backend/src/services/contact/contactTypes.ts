/**
 * @summary
 * Type definitions for Contact entity.
 *
 * @module services/contact/contactTypes
 */

import {
  ContactStatus,
  ContactSubject,
  ContactPreference,
  ContactBestTime,
} from '@/constants/contact';

/**
 * @interface ContactEntity
 * @description Represents a contact request entity
 */
export interface ContactEntity {
  id: number;
  protocolo: string;
  // Personal Data
  nome_completo: string;
  email: string;
  telefone: string;
  preferencia_contato: ContactPreference;
  melhor_horario: ContactBestTime;
  // Vehicle Interest
  id_veiculo: string;
  modelo_veiculo: string;
  assunto: ContactSubject;
  mensagem: string;
  financiamento: boolean;
  // System Data
  status: ContactStatus;
  consultor_responsavel?: string;
  notas_atendimento?: string;
  termos_privacidade: boolean;
  receber_novidades: boolean;
  ip_usuario: string;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface ContactCreateRequest
 * @description Request payload for creating a contact
 */
export interface ContactCreateRequest {
  nome_completo: string;
  email: string;
  telefone: string;
  preferencia_contato: ContactPreference;
  melhor_horario?: ContactBestTime;
  id_veiculo: string;
  modelo_veiculo: string;
  assunto: ContactSubject;
  mensagem: string;
  financiamento?: boolean;
  termos_privacidade: boolean;
  receber_novidades?: boolean;
  captcha_token?: string; // For validation only, not stored
}

/**
 * @interface ContactUpdateRequest
 * @description Request payload for updating a contact status/notes
 */
export interface ContactUpdateRequest {
  status?: ContactStatus;
  consultor_responsavel?: string;
  notas_atendimento?: string;
}

/**
 * @interface ContactListParams
 * @description Parameters for listing contacts with filters
 */
export interface ContactListParams {
  page?: number;
  pageSize?: number;
  status?: ContactStatus;
  date_min?: string;
  date_max?: string;
  id_veiculo?: string;
}

/**
 * @interface ContactListResponse
 * @description Response structure for listing contacts
 */
export interface ContactListResponse {
  data: ContactEntity[];
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
 * @interface ContactCreateResponse
 * @description Response structure after creating a contact
 */
export interface ContactCreateResponse {
  protocolo: string;
  mensagem: string;
  prazo_resposta: string;
}
