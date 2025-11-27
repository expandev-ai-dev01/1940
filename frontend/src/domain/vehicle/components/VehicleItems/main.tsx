import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import type { VehicleItemsProps } from './types';

function VehicleItems({ standardItems = [], optionalItems = [], className }: VehicleItemsProps) {
  const [showAll, setShowAll] = useState(false);
  const limit = 10;

  const groupByCategory = (items: Array<{ name: string; category: string }>) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item.name);
      return acc;
    }, {} as Record<string, string[]>);
  };

  const standardGrouped = groupByCategory(standardItems);

  const hasItems = standardItems.length > 0 || optionalItems.length > 0;

  if (!hasItems) return null;

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Itens e Opcionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(standardGrouped).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {items.slice(0, showAll ? undefined : limit).map((item, idx) => (
                <Badge key={idx} variant="secondary" className="font-normal">
                  {item}
                </Badge>
              ))}
              {!showAll && items.length > limit && (
                <Badge variant="outline" className="text-muted-foreground font-normal">
                  +{items.length - limit} mais
                </Badge>
              )}
            </div>
          </div>
        ))}

        {optionalItems.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-primary font-medium">Opcionais</h4>
            <div className="flex flex-wrap gap-2">
              {optionalItems.map((item, idx) => (
                <Badge
                  key={idx}
                  variant="default"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                >
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {standardItems.length > limit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="mt-2 w-full"
          >
            {showAll ? 'Ver menos' : 'Ver todos os itens'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export { VehicleItems };
