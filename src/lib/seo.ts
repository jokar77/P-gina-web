import { opcional } from './ajustes';
import site from '../data/site.json';
import { costeEnvio, METODOS } from './envio';

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
  /**
   * Sin oferta no hay precio que enseñar: es el caso del archivo, que no se vende.
   * `devolucion` es si tiene los 14 días de desistimiento: las piezas de colección sí,
   * las hechas por encargo no (TRLGDCU art. 103.c; ver desistimiento.md).
   */
  oferta?: { precio: number; disponible: boolean; devolucion: boolean };
}

/*
 * Adónde se envía, en códigos postales: toda España menos Canarias (35, 38), Ceuta (51)
 * y Melilla (52), que es lo que dicen las condiciones de venta. Por códigos postales
 * porque schema.org no tiene forma de decir «España salvo estas provincias».
 */
const DESTINO = [
  ['01000', '34999'],
  ['36000', '37999'],
  ['39000', '50999'],
].map(([desde, hasta]) => ({
  '@type': 'DefinedRegion',
  addressCountry: 'ES',
  postalCodeRange: { postalCodeBegin: desde, postalCodeEnd: hasta },
}));

/**
 * Lo que cuesta el envío de esta pieza sola, con las mismas tarifas que el pedido
 * (src/lib/envio.ts): una entrada por forma de envío, y gratis si la pieza ya pasa del
 * mínimo. No se inventa plazo de entrega: no es obligatorio y no hay uno fijo.
 */
const envios = (precio: number) =>
  METODOS.map((m) => ({
    '@type': 'OfferShippingDetails',
    shippingLabel: m.nombre,
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: costeEnvio(precio, m.id),
      currency: 'EUR',
    },
    shippingDestination: DESTINO,
  }));

/**
 * La política de devolución, tal cual está en la página de desistimiento: 14 días, por
 * correo y pagando la vuelta quien compra. Lo hecho por encargo no se puede devolver.
 */
const devoluciones = (devolucion: boolean) =>
  devolucion
    ? {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'ES',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      }
    : {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'ES',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      };

/**
 * Ficha de producto. No hay carrito de compra de verdad —todo se cierra por
 * WhatsApp—, pero el precio, la disponibilidad, el material, el envío y las
 * devoluciones sí son reales, así que vale la pena que el buscador los lea.
 *
 * Google avisa también de que faltan valoraciones («aggregateRating», «review»). Se
 * deja así a propósito: no hay reseñas, y ponerlas inventadas va contra sus normas.
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
  // Son piezas hechas a mano: no tienen código de barras (GTIN), así que el
  // identificador que Google pide es la marca.
  brand: { '@type': 'Brand', name: site.marca },
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
          shippingDetails: envios(d.oferta.precio),
          hasMerchantReturnPolicy: devoluciones(d.oferta.devolucion),
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
