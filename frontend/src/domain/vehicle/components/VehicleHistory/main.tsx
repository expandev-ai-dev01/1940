import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { cn } from '@/core/lib/utils';
import { CheckCircle2, Clock } from 'lucide-react';
import type { VehicleHistoryProps } from './types';

function VehicleHistory({ history, className }: VehicleHistoryProps) {
  if (!history) return null;

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Histórico do Veículo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Procedência</span>
            <span className="font-medium">{history.provenance}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Proprietários</span>
            <span className="font-medium">{history.owners}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Garantia</span>
            <span className="font-medium">{history.warranty || 'Sem garantia'}</span>
          </div>
        </div>

        {(!history.claims || history.claims.length === 0) && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Sem registro de sinistros</span>
          </div>
        )}

        {history.revisions && history.revisions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Últimas Revisões</h4>
            <div className="space-y-2">
              {history.revisions.map((revision, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span>{revision.date}</span>
                  </div>
                  <span className="font-medium">{revision.km.toLocaleString('pt-BR')} km</span>
                  <span className="text-muted-foreground">{revision.location}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.technicalReport && (
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium">Laudo Técnico</h4>
              <span className="text-muted-foreground text-xs">{history.technicalReport.date}</span>
            </div>
            <p className="text-muted-foreground text-sm">{history.technicalReport.result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { VehicleHistory };
