import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { COLOR_IDS } from './data/colores';

const estado = z.enum(['disponible', 'vendido', 'encargo']).default('disponible');

const bolsos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bolsos' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      color: z.enum(COLOR_IDS as [string, ...string[]]),
      precio: z.number(),
      estado,
      material: z.string(),
      ancho: z.number(),
      alto: z.number(),
      foto: image(),
      fotos: z.array(image()).default([]),
      orden: z.number().default(0),
    }),
});

const ninos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ninos' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      precioDesde: z.number(),
      tallas: z.string(),
      material: z.string(),
      estado: estado.default('encargo'),
      foto: image(),
      fotos: z.array(image()).default([]),
      orden: z.number().default(0),
    }),
});

export const collections = { bolsos, ninos };
