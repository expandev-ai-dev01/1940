import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { cn } from '@/core/lib/utils';
import type { VehicleSortProps } from './types';
import type { VehicleSortType } from '../../types';

function VehicleSort({ value, onChange, className }: VehicleSortProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-muted-foreground whitespace-nowrap text-sm">Ordenar por:</span>
      <Select value={value} onValueChange={(val) => onChange(val as VehicleSortType)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevância</SelectItem>
          <SelectItem value="price_asc">Preço (menor para maior)</SelectItem>
          <SelectItem value="price_desc">Preço (maior para menor)</SelectItem>
          <SelectItem value="year_desc">Ano (mais recente)</SelectItem>
          <SelectItem value="year_asc">Ano (mais antigo)</SelectItem>
          <SelectItem value="model_asc">Modelo (A-Z)</SelectItem>
          <SelectItem value="model_desc">Modelo (Z-A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export { VehicleSort };
