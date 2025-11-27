import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { cn } from '@/core/lib/utils';
import { Calculator, FileText, Check } from 'lucide-react';
import type { VehicleConditionsProps } from './types';

function VehicleConditions({ conditions, price, className }: VehicleConditionsProps) {
  const [downPayment, setDownPayment] = useState(price * 0.2);
  const [months, setMonths] = useState(48);

  if (!conditions) return null;

  const calculateInstallment = () => {
    if (!conditions.financing) return 0;
    const principal = price - downPayment;
    const rate = conditions.financing.interestRate / 100;
    if (rate === 0) return principal / months;
    return (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
  };

  const installmentValue = calculateInstallment();

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Condições de Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-muted-foreground text-sm font-medium">Formas de Pagamento</h4>
          <div className="flex flex-wrap gap-2">
            {conditions.paymentMethods.map((method, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm"
              >
                <Check className="text-primary h-3.5 w-3.5" />
                {method}
              </div>
            ))}
          </div>
        </div>

        {conditions.acceptsTrade && (
          <div className="bg-primary/5 text-primary rounded-lg p-3 text-center text-sm font-medium">
            Aceitamos seu veículo na troca!
          </div>
        )}

        {conditions.financing && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center gap-2 font-medium">
              <Calculator className="h-4 w-4" />
              Simulação de Financiamento
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entrada (R$)</Label>
                <Input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Prazo (meses)</Label>
                <Input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="bg-muted flex items-center justify-between rounded-md p-3">
              <span className="text-sm">Valor da parcela:</span>
              <span className="text-lg font-bold">
                {installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <p className="text-muted-foreground text-center text-xs">
              *Valores estimados. Taxa de {conditions.financing.interestRate}% a.m.
            </p>
          </div>
        )}

        {conditions.requiredDocuments && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Documentação Necessária
            </div>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              {conditions.requiredDocuments.map((doc, idx) => (
                <li key={idx}>{doc.name}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { VehicleConditions };
