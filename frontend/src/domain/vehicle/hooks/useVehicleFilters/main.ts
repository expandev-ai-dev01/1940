import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';

export const useVehicleFilters = () => {
  return useQuery({
    queryKey: ['vehicle-filters'],
    queryFn: () => vehicleService.getFilters(),
  });
};
