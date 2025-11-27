export interface Vehicle {
  id: string;
  model: string;
  brand: string;
  year: number;
  price: number;
  mainImage: string;
  mileage?: number;
  transmission?: string;
  status?: 'Disponível' | 'Reservado' | 'Vendido';
  photos?: string[];
  description?: string;
  fuel?: string;
  power?: string;
  color?: string;
  doors?: number;
  bodyType?: string;
  engine?: string;
  licensePlateEnd?: number;
  modelYear?: number;
  standardItems?: Array<{ name: string; category: string }>;
  optionalItems?: Array<{ name: string; category: string }>;
  history?: {
    provenance: string;
    owners: number;
    warranty?: string;
    revisions?: Array<{ date: string; km: number; location: string }>;
    claims?: Array<{ date: string; type: string; description: string }>;
    technicalReport?: { date: string; result: string };
  };
  salesConditions?: {
    paymentMethods: string[];
    financing?: { downPayment: number; interestRate: number; maxInstallments: number };
    acceptsTrade: boolean;
    observations?: string;
    requiredDocuments?: Array<{ name: string; observation?: string }>;
    documentStatus?: { status: string; pending?: string[]; observations?: string };
  };
}

export interface VehicleFiltersType {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  transmission?: string[];
}

export type VehicleSortType =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'year_desc'
  | 'year_asc'
  | 'model_asc'
  | 'model_desc';

export interface VehiclePaginationType {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterOptions {
  brands: string[];
  models: Record<string, string[]> | string[];
  years: number[];
  transmissions: string[];
}
