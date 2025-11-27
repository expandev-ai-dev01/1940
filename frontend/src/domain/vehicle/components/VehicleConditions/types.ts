import type { Vehicle } from '../../types';

export interface VehicleConditionsProps {
  conditions: Vehicle['salesConditions'];
  price: number;
  className?: string;
}
