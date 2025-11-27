import type { FilterOptions, VehicleFiltersType } from '../../types';

export interface VehicleFiltersProps {
  options: FilterOptions;
  defaultValues: VehicleFiltersType;
  onApply: (filters: VehicleFiltersType) => void;
  onClear: () => void;
  className?: string;
}
