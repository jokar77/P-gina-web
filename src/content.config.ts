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
      nota: z.string().optional(),
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

/**
 * Un puñado de fotos y vídeos por red, para el apartado de la portada que enseña uno al
 * azar en cada visita. No son las publicaciones en directo —eso pediría la API de cada
 * plataforma, con token que caduca y hay que ir renovando, que es mantenimiento que no
 * encaja con una web estática sin servidor (ver PLAN.md)—, son capturas y clips que
 * Sakina sube ella misma, como ya hace con las fotos de pieza.
 *
 * Cada foto y cada vídeo lleva su propio `enlace`, opcional: la URL de esa publicación
 * en concreto, para que al pulsar se vaya justo ahí y no al perfil general. Si se deja en
 * blanco, `Sociales.astro` usa el enlace del perfil (el de site.json) como respaldo, así
 * que no hace falta rellenarlo en todas para que el apartado siga funcionando.
 *
 * Los vídeos guardan `video` como `z.string()`, no `image()`: `image()` solo sabe
 * procesar imágenes (pasa cada una por Sharp para optimizarla), así que un vídeo ahí
 * rompería la compilación. En vez de eso, los vídeos se suben a `public/videos/redes` y
 * aquí se guarda la ruta pública tal cual (por ejemplo, `/videos/redes/clip.mp4`): lo de
 * `public/` no pasa por Vite, así que la ruta ya es la URL final, sin nada que resolver.
 *
 * Solo hay una entrada, "redes.md", con las seis listas dentro: no hace falta una
 * colección por red para algo que nunca va a tener más de una entrada.
 */
const redes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/redes' }),
  schema: ({ image }) => {
    const foto = z.object({ foto: image(), enlace: z.string().optional() });
    const video = z.object({ video: z.string(), enlace: z.string().optional() });
    return z.object({
      instagram: z.array(foto).default([]),
      instagramVideos: z.array(video).default([]),
      tiktok: z.array(foto).default([]),
      tiktokVideos: z.array(video).default([]),
      youtube: z.array(foto).default([]),
      youtubeVideos: z.array(video).default([]),
    });
  },
});

/**
 * Las tres páginas legales: condiciones de venta, desistimiento y privacidad.
 *
 * Solo tres entradas posibles, con nombre de archivo fijo (condiciones.md,
 * desistimiento.md, privacidad.md): cada una tiene su propia página en
 * src/pages, así que no puede haber una cuarta sin escribir esa página también.
 * `type: file` en .pages.yml refleja lo mismo del lado del CMS: ahí no se puede
 * añadir ni borrar, solo editar las tres que ya existen.
 *
 * El cuerpo (el markdown que va debajo del frontmatter) admite títulos de nivel
 * 2, enlaces, listas y negrita —lo normal para un texto legal—, y también los
 * marcadores {precioRecogida}, {precioDomicilio}, {precioGratis}, {zonaEnvio} y
 * {plazoDias}: se sustituyen al construir por lo que haya en site.json → envíos
 * (ver src/pages/condiciones.astro y las otras dos), así que una tarifa nueva no
 * hay que tocarla en tres sitios.
 */
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    intro: z.string(),
    actualizado: z.string(),
  }),
});

/**
 * El collage de polaroids junto al texto de «Sobre mí» (ver components/Taller.astro).
 * Una sola entrada: la foto del centro y las de alrededor, que se colocan solas en sus
 * huecos. Cada foto que sea de una pieza enlaza sola a su ficha.
 */
const collage = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/collage' }),
  schema: ({ image }) =>
    z.object({
      central: image(),
      fotos: z.array(image()).default([]),
    }),
});

export const collections = { bolsos, ninos, archivo, portada, redes, legal, collage };
