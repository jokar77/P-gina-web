import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
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

/**
 * Obra hecha que no está a la venta.
 *
 * Vestidos de flamenca, otros vestidos, lo que vaya saliendo: piezas que ya tienen dueña
 * o que se hicieron para alguien, y que se enseñan porque cuentan de lo que es capaz, no
 * porque se puedan comprar. Por eso no hay precio ni estado: no hay nada que vender.
 *
 * `tipo` es texto libre a propósito. Agrupar por él es lo que hace legible un conjunto
 * de piezas que no se parecen en nada, y una lista cerrada obligaría a tocar código el
 * día que aparezca algo que no estaba previsto.
 */
const archivo = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/archivo' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      tipo: z.string(),
      material: z.string().optional(),
      nota: z.string().optional(),
      ano: z.number().optional(),
      foto: image(),
      fotos: z.array(image()).default([]),
      orden: z.number().default(0),
    }),
});

/**
 * Las tres fotos grandes de la portada de escritorio: una por sección, elegidas a mano
 * en vez de sacadas de la pieza que toque en la colección. Así Sakina puede poner una
 * foto de conjunto (o de grupo, como la de bolsos) sin que dependa de cuál sea la
 * primera pieza por orden, ni se quede rota si esa pieza se borra.
 *
 * Solo hay una entrada: el archivo siempre es el mismo, "portada.md".
 */
const portada = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portada' }),
  schema: ({ image }) =>
    z.object({
      bolsos: image(),
      bolsosAlt: z.string().optional(),
      ninos: image(),
      ninosAlt: z.string().optional(),
      archivo: image(),
      archivoAlt: z.string().optional(),
    }),
});

export const collections = { bolsos, ninos, archivo, portada };
