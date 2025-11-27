import type { VehicleSortType } from '../../types';

export interface VehicleSortProps {
  value: VehicleSortType;
  onChange: (value: VehicleSortType) => void;
  className?: string;
}
