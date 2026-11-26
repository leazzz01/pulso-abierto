import { z } from 'zod';

export const querySchema = z.object({
  search: z.string().trim().refine(
    (value) => value.length === 0 || value.length >= 2,
    'Escribe al menos 2 caracteres o deja la búsqueda vacía.',
  ),
  currency: z.enum(['usd', 'eur', 'ars'], { error: 'Selecciona una moneda válida.' }),
  favoritesOnly: z.boolean(),
});

export type QueryValues = z.infer<typeof querySchema>;
