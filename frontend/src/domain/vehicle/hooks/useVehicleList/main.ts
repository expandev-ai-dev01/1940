import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';

export const useVehicleList = (params: any) => {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.list(params),
  });
};
