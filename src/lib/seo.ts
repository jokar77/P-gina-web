import { opcional } from './ajustes';
import site from '../data/site.json';

interface Paso {
  nombre: string;
  url: string;
}

/**
 * Las migas de pan: de dónde a dónde se llega a esta página. Ayuda a que el buscador
 * enseñe la ruta en vez de solo el título, y a que entienda cómo se organiza la web.
 */
export const migasDePan = (base: URL, pasos: Paso[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: pasos.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.nombre,
    item: new URL(p.url, base).href,
  })),
});

interface DatosProducto {
  nombre: string;
  descripcion: string;
  imagen: string;
  sku: string;
  url: string;
  material?: string;
  /** Sin oferta no hay precio que enseñar: es el caso del archivo, que no se vende. */
  oferta?: { precio: number; disponible: boolean };
}

/**
 * Ficha de producto. No hay carrito de compra de verdad —todo se cierra por
 * WhatsApp—, pero el precio, la disponibilidad y el material sí son reales, así que
 * vale la pena que el buscador los lea.
 */
export const producto = (base: URL, d: DatosProducto) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: d.nombre,
  description: d.descripcion,
  // Absoluta: a diferencia del og:image de Layout.astro, esto no pasa por un <meta>
  // que el navegador resuelva solo, así que sin dominio Google no sabría de dónde sacarla.
  image: [new URL(d.imagen, base).href],
  sku: d.sku,
  ...(d.material ? { material: d.material } : {}),
  ...(d.oferta
    ? {
        offers: {
          '@type': 'Offer',
          url: new URL(d.url, base).href,
          priceCurrency: 'EUR',
          price: d.oferta.precio,
          availability: d.oferta.disponible
            ? 'https://schema.org/InStock'
            : 'https://schema.org/SoldOut',
          itemCondition: 'https://schema.org/NewCondition',
        },
      }
    : {}),
});

/**
 * La ficha de la marca: va en todas las páginas, no solo en la portada, que es como
 * Google espera encontrarla. Las redes sociales solo entran si Sakina las ha puesto
 * en el formulario —igual que en el pie de página—, nunca inventadas.
 */
export const organizacion = (base: URL) => {
  const redes = [opcional('instagram'), opcional('tiktok'), opcional('youtube')].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.marca,
    url: base.href,
    logo: new URL('/icono-512.png', base).href,
    ...(redes.length ? { sameAs: redes } : {}),
  };
};
