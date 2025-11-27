import { publicClient } from '@/core/lib/api';
import type { Vehicle, VehiclePaginationType, FilterOptions } from '../types';
import type { ContactFormOutput } from '../validations/contact';

interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  transmission?: string[];
}

interface ListResponse {
  data: Vehicle[];
  metadata: VehiclePaginationType;
}

export interface ContactResponse {
  protocolo: string;
  mensagem: string;
  prazo_resposta: string;
}

export const vehicleService = {
  list: async (params: ListParams): Promise<ListResponse> => {
    const { data } = await publicClient.get('/vehicle', { params });
    return data;
  },
  getById: async (id: string): Promise<Vehicle> => {
    const { data } = await publicClient.get(`/vehicle/${id}`);
    return data.data;
  },
  getFilters: async (): Promise<FilterOptions> => {
    const { data } = await publicClient.get('/vehicle/filters');
    return data.data;
  },
  sendContact: async (data: ContactFormOutput): Promise<ContactResponse> => {
    const { data: response } = await publicClient.post('/contact', data);
    return response.data;
  },
};
