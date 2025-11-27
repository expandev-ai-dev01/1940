import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterIcon } from 'lucide-react';

import { Button } from '@/core/components/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/core/components/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/core/components/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { cn } from '@/core/lib/utils';

import {
  VehicleList,
  VehicleFilters,
  VehicleSort,
  type VehicleFiltersType,
  type VehicleSortType,
} from '@/domain/vehicle/_module';
import { useVehicleList, useVehicleFilters } from '@/domain/vehicle/hooks';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Parse params from URL
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;
  const sort = (searchParams.get('sort') as VehicleSortType) || 'relevance';

  const filters: VehicleFiltersType = {
    brand: searchParams.get('brand') || undefined,
    model: searchParams.get('model') || undefined,
    yearMin: searchParams.get('yearMin') ? Number(searchParams.get('yearMin')) : undefined,
    yearMax: searchParams.get('yearMax') ? Number(searchParams.get('yearMax')) : undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    transmission:
      searchParams.getAll('transmission').length > 0
        ? searchParams.getAll('transmission')
        : undefined,
  };

  // Fetch data
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicleList({
    page,
    limit,
    sort,
    ...filters,
  });

  const { data: filterOptions } = useVehicleFilters();

  // Handlers
  const handleFiltersApply = (newFilters: VehicleFiltersType) => {
    const params = new URLSearchParams(searchParams);

    // Reset page on filter change
    params.set('page', '1');

    // Update filter params
    if (newFilters.brand) params.set('brand', newFilters.brand);
    else params.delete('brand');

    if (newFilters.model) params.set('model', newFilters.model);
    else params.delete('model');

    if (newFilters.yearMin) params.set('yearMin', newFilters.yearMin.toString());
    else params.delete('yearMin');

    if (newFilters.yearMax) params.set('yearMax', newFilters.yearMax.toString());
    else params.delete('yearMax');

    if (newFilters.priceMin) params.set('priceMin', newFilters.priceMin.toString());
    else params.delete('priceMin');

    if (newFilters.priceMax) params.set('priceMax', newFilters.priceMax.toString());
    else params.delete('priceMax');

    params.delete('transmission');
    if (newFilters.transmission && newFilters.transmission.length > 0) {
      newFilters.transmission.forEach((t) => params.append('transmission', t));
    }

    setSearchParams(params);
    setIsMobileFiltersOpen(false);
  };

  const handleFiltersClear = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', limit.toString());
    params.set('sort', sort);
    setSearchParams(params);
    setIsMobileFiltersOpen(false);
  };

  const handleSortChange = (newSort: VehicleSortType) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', newLimit);
    params.set('page', '1');
    setSearchParams(params);
  };

  // Pagination Logic
  const totalPages = vehiclesData?.metadata.totalPages || 1;
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={page === i}
            onClick={() => handlePageChange(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (startPage > 1) {
      items.unshift(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
      items.unshift(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="container space-y-8 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Veículos</h1>
          <p className="text-muted-foreground">
            {vehiclesData?.metadata.total
              ? `Exibindo ${vehiclesData.data.length} de ${vehiclesData.metadata.total} veículos`
              : 'Encontre o carro dos seus sonhos'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <FilterIcon className="size-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {filterOptions && (
                  <VehicleFilters
                    options={filterOptions}
                    defaultValues={filters}
                    onApply={handleFiltersApply}
                    onClear={handleFiltersClear}
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>

          <VehicleSort value={sort} onChange={handleSortChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-6">
            <div className="text-lg font-semibold">Filtros</div>
            {filterOptions ? (
              <VehicleFilters
                options={filterOptions}
                defaultValues={filters}
                onApply={handleFiltersApply}
                onClear={handleFiltersClear}
              />
            ) : (
              <div className="space-y-4">
                <div className="bg-muted h-10 animate-pulse rounded" />
                <div className="bg-muted h-10 animate-pulse rounded" />
                <div className="bg-muted h-20 animate-pulse rounded" />
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-8 lg:col-span-3">
          <VehicleList vehicles={vehiclesData?.data || []} isLoading={isVehiclesLoading} />

          {vehiclesData && vehiclesData.metadata.totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>Itens por página:</span>
                <Select value={limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      className={cn(
                        page <= 1 && 'pointer-events-none opacity-50',
                        'cursor-pointer'
                      )}
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      className={cn(
                        page >= totalPages && 'pointer-events-none opacity-50',
                        'cursor-pointer'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { HomePage };
