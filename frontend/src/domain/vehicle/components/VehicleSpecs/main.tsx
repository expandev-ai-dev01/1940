import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { cn } from '@/core/lib/utils';
import type { VehicleSpecsProps } from './types';

function VehicleSpecs({ vehicle, className }: VehicleSpecsProps) {
  const specs = [
    { label: 'Marca', value: vehicle.brand },
    { label: 'Modelo', value: vehicle.model },
    { label: 'Ano Fabricação', value: vehicle.year },
    { label: 'Ano Modelo', value: vehicle.modelYear || vehicle.year },
    {
      label: 'Quilometragem',
      value: vehicle.mileage ? `${vehicle.mileage.toLocaleString('pt-BR')} km` : 'N/A',
    },
    { label: 'Combustível', value: vehicle.fuel || 'N/A' },
    { label: 'Câmbio', value: vehicle.transmission || 'N/A' },
    { label: 'Potência', value: vehicle.power || 'N/A' },
    { label: 'Cor', value: vehicle.color || 'N/A' },
    { label: 'Portas', value: vehicle.doors || 'N/A' },
    { label: 'Carroceria', value: vehicle.bodyType || 'N/A' },
    { label: 'Motor', value: vehicle.engine || 'N/A' },
    { label: 'Final da Placa', value: vehicle.licensePlateEnd || 'N/A' },
  ];

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Especificações Técnicas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { VehicleSpecs };
