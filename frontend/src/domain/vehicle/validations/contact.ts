import { z } from 'zod';

export const contactPreferenceOptions = ['Telefone', 'E-mail', 'WhatsApp'] as const;
export const bestTimeOptions = ['Manhã', 'Tarde', 'Noite', 'Qualquer horário'] as const;
export const subjectOptions = [
  'Informações gerais',
  'Agendamento de test drive',
  'Negociação de preço',
  'Financiamento',
  'Outro',
] as const;

export const contactSchema = z.object({
  nome_completo: z
    .string('Nome é obrigatório')
    .min(3, 'Mínimo de 3 caracteres')
    .max(100, 'Máximo de 100 caracteres')
    .refine((val) => val.trim().split(' ').length >= 2, 'Informe nome e sobrenome'),
  email: z
    .string('Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Máximo de 100 caracteres'),
  telefone: z
    .string('Telefone é obrigatório')
    .min(10, 'Mínimo de 10 dígitos')
    .regex(/^[\d()-\s]+$/, 'Formato inválido (apenas números, parênteses e hífen)'),
  preferencia_contato: z.enum(contactPreferenceOptions, 'Selecione uma preferência'),
  melhor_horario: z.enum(bestTimeOptions).optional(),
  id_veiculo: z.string(),
  modelo_veiculo: z.string(),
  assunto: z.enum(subjectOptions, 'Selecione um assunto'),
  mensagem: z
    .string('Mensagem é obrigatória')
    .min(10, 'Mínimo de 10 caracteres')
    .max(1000, 'Máximo de 1000 caracteres'),
  financiamento: z.boolean().default(false),
  termos_privacidade: z
    .boolean('Você deve aceitar os termos')
    .refine((val) => val === true, 'Você deve aceitar os termos de privacidade'),
  receber_novidades: z.boolean().default(false),
});

export type ContactFormInput = z.input<typeof contactSchema>;
export type ContactFormOutput = z.output<typeof contactSchema>;
