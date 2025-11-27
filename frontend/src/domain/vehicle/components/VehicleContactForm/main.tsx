import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import { Checkbox } from '@/core/components/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { cn } from '@/core/lib/utils';
import {
  contactSchema,
  type ContactFormInput,
  type ContactFormOutput,
  contactPreferenceOptions,
  bestTimeOptions,
  subjectOptions,
} from '../../validations/contact';
import { vehicleService } from '../../services/vehicleService';
import type { VehicleContactFormProps } from './types';

function VehicleContactForm({ vehicle, className }: VehicleContactFormProps) {
  const form = useForm<ContactFormInput, any, ContactFormOutput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      nome_completo: '',
      email: '',
      telefone: '',
      preferencia_contato: undefined,
      melhor_horario: undefined,
      id_veiculo: vehicle.id,
      modelo_veiculo: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
      assunto: 'Informações gerais',
      mensagem: `Olá, tenho interesse no veículo ${vehicle.brand} ${vehicle.model} ${vehicle.year}. Gostaria de mais informações.`,
      financiamento: false,
      termos_privacidade: false,
      receber_novidades: false,
    },
  });

  const assunto = form.watch('assunto');

  useEffect(() => {
    if (assunto === 'Financiamento') {
      form.setValue('financiamento', true);
    }
  }, [assunto, form]);

  const onSubmit = async (data: ContactFormOutput) => {
    try {
      const response = await vehicleService.sendContact(data);
      toast.success('Mensagem enviada com sucesso!', {
        description: `Protocolo: ${response.protocolo}. ${response.prazo_resposta}`,
        duration: 6000,
      });
      form.reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Tente novamente mais tarde.';
      toast.error('Erro ao enviar mensagem', {
        description: errorMessage,
      });
    }
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader>
        <CardTitle>Tenho Interesse</CardTitle>
        <CardDescription>Preencha o formulário para entrarmos em contato.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome_completo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome e sobrenome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="preferencia_contato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferência de Contato *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactPreferenceOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="melhor_horario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Melhor Horário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione (Opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bestTimeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escreva sua mensagem..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-end">
                    <span className="text-muted-foreground text-xs">
                      {field.value?.length || 0}/1000
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="financiamento"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Tenho interesse em financiamento</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termos_privacidade"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">
                      Li e aceito os{' '}
                      <a
                        href="#"
                        className="text-primary underline"
                        onClick={(e) => e.preventDefault()}
                      >
                        Termos de Privacidade
                      </a>{' '}
                      *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receber_novidades"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">
                      Aceito receber novidades e ofertas por e-mail
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export { VehicleContactForm };
