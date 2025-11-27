/**
 * @summary
 * Business logic for Contact entity.
 * Handles contact creation, protocol generation, and management.
 *
 * @module services/contact/contactService
 */

import { CONTACT_DEFAULTS } from '@/constants/contact';
import { contactStore } from '@/instances/contact';
import { vehicleStore } from '@/instances/vehicle';
import { ServiceError } from '@/utils';
import { ContactEntity, ContactCreateResponse, ContactListResponse } from './contactTypes';
import {
  createContactSchema,
  updateContactSchema,
  listContactSchema,
  contactParamsSchema,
} from './contactValidation';

/**
 * Generates a unique protocol number
 * Format: YYYYMMDD + Sequence (e.g., 2023051200001)
 */
function generateProtocol(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const dailyCount = contactStore.getDailyCount(dateStr) + 1;
  const sequence = dailyCount.toString().padStart(5, '0');
  return `${dateStr}${sequence}`;
}

/**
 * @summary
 * Creates a new contact request.
 *
 * @function contactCreate
 * @module services/contact
 *
 * @param {unknown} body - Request body
 * @param {string} ipAddress - User IP address
 * @returns {Promise<ContactCreateResponse>} Created contact info with protocol
 */
export async function contactCreate(
  body: unknown,
  ipAddress: string
): Promise<ContactCreateResponse> {
  const validation = createContactSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const data = validation.data;

  // Validate Vehicle ID if possible (optional per requirements, but good practice)
  // We won't block if not found to allow manual entry fallback as per requirements
  const vehicleIdNum = parseInt(data.id_veiculo);
  if (!isNaN(vehicleIdNum) && !vehicleStore.exists(vehicleIdNum)) {
    // Log warning or handle specific logic if needed
    // For now, we accept the data as is
  }

  // Auto-select financing if subject is financing
  const financiamento = data.assunto === 'Financiamento' ? true : data.financiamento;

  const id = contactStore.getNextId();
  const protocol = generateProtocol();
  const now = new Date().toISOString();

  const newContact: ContactEntity = {
    id,
    protocolo: protocol,
    ...data,
    financiamento: financiamento || false,
    status: 'Novo',
    ip_usuario: ipAddress,
    dateCreated: now,
    dateModified: now,
  };

  contactStore.add(newContact);

  // Simulate Email Sending
  console.log(`[EMAIL MOCK] Sending confirmation email to ${data.email} for protocol ${protocol}`);
  console.log(`[EMAIL MOCK] Sending notification email to sales team for protocol ${protocol}`);

  return {
    protocolo: protocol,
    mensagem: 'Solicitação recebida com sucesso',
    prazo_resposta: '24h úteis',
  };
}

/**
 * @summary
 * Lists contacts with filtering and pagination.
 *
 * @function contactList
 * @module services/contact
 *
 * @param {unknown} params - Query parameters
 * @returns {Promise<ContactListResponse>} Paged list of contacts
 */
export async function contactList(params: unknown): Promise<ContactListResponse> {
  const validation = listContactSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid parameters', 400, validation.error.errors);
  }

  const filters = validation.data;
  let records = contactStore.getAll();

  // Apply Filters
  if (filters.status) {
    records = records.filter((r) => r.status === filters.status);
  }

  if (filters.id_veiculo) {
    records = records.filter((r) => r.id_veiculo === filters.id_veiculo);
  }

  if (filters.date_min) {
    records = records.filter((r) => r.dateCreated >= filters.date_min!);
  }

  if (filters.date_max) {
    records = records.filter((r) => r.dateCreated <= filters.date_max!);
  }

  // Sort by Date Descending (Newest first)
  records.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());

  // Pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || CONTACT_DEFAULTS.ITEMS_PER_PAGE;
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
 * Gets a contact by ID.
 *
 * @function contactGet
 * @module services/contact
 *
 * @param {unknown} params - Request params
 * @returns {Promise<ContactEntity>} Contact details
 */
export async function contactGet(params: unknown): Promise<ContactEntity> {
  const validation = contactParamsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = contactStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Contact not found', 404);
  }

  return record;
}

/**
 * @summary
 * Updates a contact status or notes.
 *
 * @function contactUpdate
 * @module services/contact
 *
 * @param {unknown} params - Request params
 * @param {unknown} body - Request body
 * @returns {Promise<ContactEntity>} Updated contact
 */
export async function contactUpdate(params: unknown, body: unknown): Promise<ContactEntity> {
  const paramsValidation = contactParamsSchema.safeParse(params);
  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = updateContactSchema.safeParse(body);
  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = contactStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Contact not found', 404);
  }

  const updated = contactStore.update(id, {
    ...bodyValidation.data,
    dateModified: new Date().toISOString(),
  });

  return updated as ContactEntity;
}
