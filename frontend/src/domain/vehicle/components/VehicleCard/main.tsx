import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';
import { cn } from '@/core/lib/utils';
import type { VehicleCardProps } from './types';

function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const { navigate } = useNavigation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatMileage = (km?: number) => {
    if (km === undefined || km === null) return '';
    return `${km.toLocaleString('pt-BR')} km`;
  };

  return (
    <Card
      className={cn(
        'group flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:shadow-md',
        className
      )}
      onClick={() => navigate(`/vehicle/${vehicle.id}`)}
    >
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        {vehicle.mainImage ? (
          <img
            src={vehicle.mainImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center">
            Sem imagem
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="line-clamp-1 text-lg">{vehicle.model}</CardTitle>
            <CardDescription>{vehicle.brand}</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {vehicle.year}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-2">
        <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
          {vehicle.mileage !== undefined && <span>{formatMileage(vehicle.mileage)}</span>}
          {vehicle.mileage !== undefined && vehicle.transmission && <span>•</span>}
          {vehicle.transmission && <span>{vehicle.transmission}</span>}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between p-4 pt-0">
        <span className="text-primary text-xl font-bold">{formatPrice(vehicle.price)}</span>
        <Button size="sm" variant="outline">
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

export { VehicleCard };
