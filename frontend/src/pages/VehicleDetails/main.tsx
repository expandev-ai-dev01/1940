import { useParams } from 'react-router-dom';
import { useVehicleDetails } from '@/domain/vehicle/hooks';
import {
  VehicleGallery,
  VehicleSpecs,
  VehicleItems,
  VehicleHistory,
  VehicleConditions,
  VehicleContactForm,
  VehicleShare,
  VehicleSimilar,
} from '@/domain/vehicle/components';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { useNavigation } from '@/core/hooks/useNavigation';
import { ChevronLeft } from 'lucide-react';

function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vehicle, isLoading, error } = useVehicleDetails(id || '');
  const { goBack } = useNavigation();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Veículo não encontrado</h1>
        <p className="text-muted-foreground">
          O veículo que você procura não está disponível ou foi removido.
        </p>
        <Button onClick={goBack}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="container space-y-8 py-8">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="hover:text-primary w-fit pl-0 hover:bg-transparent"
          onClick={goBack}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar para listagem
        </Button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {vehicle.brand} {vehicle.model}
              </h1>
              <Badge variant={vehicle.status === 'Vendido' ? 'destructive' : 'default'}>
                {vehicle.status || 'Disponível'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xl">
              {vehicle.year} • {vehicle.mileage?.toLocaleString('pt-BR')} km
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-primary text-3xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                vehicle.price
              )}
            </span>
            <VehicleShare vehicle={vehicle} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - Left Column */}
        <div className="space-y-8 lg:col-span-2">
          <VehicleGallery
            images={vehicle.photos || []}
            mainImage={vehicle.mainImage}
            title={`${vehicle.brand} ${vehicle.model}`}
          />

          <VehicleSpecs vehicle={vehicle} />

          <VehicleItems
            standardItems={vehicle.standardItems}
            optionalItems={vehicle.optionalItems}
          />

          <VehicleHistory history={vehicle.history} />
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-8">
          <div className="sticky top-8 space-y-8">
            <VehicleContactForm vehicle={vehicle} />
            <VehicleConditions conditions={vehicle.salesConditions} price={vehicle.price} />
          </div>
        </div>
      </div>

      {/* Similar Vehicles */}
      <div className="border-t pt-8">
        <VehicleSimilar currentVehicle={vehicle} />
      </div>
    </div>
  );
}

export { VehicleDetailsPage };
