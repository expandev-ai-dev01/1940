import { useVehicleList } from '../../hooks/useVehicleList';
import { VehicleList } from '../VehicleList';
import { cn } from '@/core/lib/utils';
import type { VehicleSimilarProps } from './types';

function VehicleSimilar({ currentVehicle, className }: VehicleSimilarProps) {
  // Fetch similar vehicles based on brand, excluding current vehicle
  const { data, isLoading } = useVehicleList({
    brand: currentVehicle.brand,
    limit: 4,
    page: 1,
  });

  // Filter out the current vehicle from results
  const similarVehicles = data?.data.filter((v) => v.id !== currentVehicle.id).slice(0, 4) || [];

  if (!isLoading && similarVehicles.length === 0) return null;

  return (
    <div className={cn('space-y-6', className)}>
      <h3 className="text-2xl font-bold tracking-tight">Veículos Similares</h3>
      <VehicleList
        vehicles={similarVehicles}
        isLoading={isLoading}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
      />
    </div>
  );
}

export { VehicleSimilar };
