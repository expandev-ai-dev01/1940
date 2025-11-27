import type { Vehicle } from '../../types';

export interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  className?: string;
}
