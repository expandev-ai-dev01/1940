import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Checkbox } from '@/core/components/checkbox';
import { Separator } from '@/core/components/separator';
import { cn } from '@/core/lib/utils';
import type { VehicleFiltersProps } from './types';
import type { VehicleFiltersType } from '../../types';

function VehicleFilters({
  options,
  defaultValues,
  onApply,
  onClear,
  className,
}: VehicleFiltersProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<VehicleFiltersType>({
    defaultValues,
  });

  const selectedBrand = watch('brand');
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    if (selectedBrand && options.models && !Array.isArray(options.models)) {
      setAvailableModels(options.models[selectedBrand] || []);
    } else if (Array.isArray(options.models)) {
      setAvailableModels(options.models);
    } else {
      setAvailableModels([]);
    }
  }, [selectedBrand, options.models]);

  const onSubmit = (data: VehicleFiltersType) => {
    onApply(data);
  };

  const handleClear = () => {
    reset({});
    onClear();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Marca</Label>
          <Select
            value={watch('brand') || 'all'}
            onValueChange={(val) => setValue('brand', val === 'all' ? undefined : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as marcas</SelectItem>
              {options.brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Modelo</Label>
          <Select
            value={watch('model') || 'all'}
            onValueChange={(val) => setValue('model', val === 'all' ? undefined : val)}
            disabled={!selectedBrand && !Array.isArray(options.models)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os modelos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os modelos</SelectItem>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Ano</Label>
          <div className="flex gap-2">
            <Select
              value={watch('yearMin')?.toString() || 'all'}
              onValueChange={(val) => setValue('yearMin', val === 'all' ? undefined : Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="De" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">De</SelectItem>
                {options.years.map((year) => (
                  <SelectItem key={`min-${year}`} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={watch('yearMax')?.toString() || 'all'}
              onValueChange={(val) => setValue('yearMax', val === 'all' ? undefined : Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Até" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Até</SelectItem>
                {options.years.map((year) => (
                  <SelectItem key={`max-${year}`} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Preço (R$)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Mín"
              {...register('priceMin', { valueAsNumber: true })}
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Máx"
              {...register('priceMax', { valueAsNumber: true })}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Câmbio</Label>
          <div className="space-y-2">
            {options.transmissions.map((transmission) => (
              <div key={transmission} className="flex items-center space-x-2">
                <Checkbox
                  id={`trans-${transmission}`}
                  checked={watch('transmission')?.includes(transmission)}
                  onCheckedChange={(checked) => {
                    const current = watch('transmission') || [];
                    if (checked) {
                      setValue('transmission', [...current, transmission]);
                    } else {
                      setValue(
                        'transmission',
                        current.filter((t) => t !== transmission)
                      );
                    }
                  }}
                />
                <Label htmlFor={`trans-${transmission}`} className="cursor-pointer font-normal">
                  {transmission}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <Button type="submit" className="w-full">
          Aplicar Filtros
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={handleClear}>
          Limpar Filtros
        </Button>
      </div>
    </form>
  );
}

export { VehicleFilters };
