import type { CollectionEntry } from 'astro:content';

/**
 * El orden de los accesorios en la franja de la portada y en su página: el que pone
 * Sakina, pero con los vendidos al final, para que lo primero que se vea se pueda
 * comprar (como en «Últimas novedades» de los bolsos).
 */
export const porOrdenConVendidosAlFinal = (l: CollectionEntry<'accesorios'>[]) =>
  [...l].sort(
    (a, b) =>
      Number(a.data.estado === 'vendido') - Number(b.data.estado === 'vendido') ||
      a.data.orden - b.data.orden,
  );

/** La línea del pedido de un accesorio tal cual (sin opciones elegidas todavía). */
export const lineaAccesorio = (a: CollectionEntry<'accesorios'>) => ({
  // Con prefijo: el nombre de un accesorio podría coincidir con el de un bolso.
  id: `accesorio-${a.id}`,
  nombre: a.data.nombre,
  precio: a.data.precio,
  detalle: [a.data.material, a.data.medidas].filter(Boolean).join(' · '),
  url: `/accesorios/${a.id}`,
  ...(a.data.estado === 'encargo' ? { orientativo: true } : {}),
  // Un solo 3x2 para todos los accesorios: se pueden mezclar piezas distintas.
  ...(a.data.tresPorDos ? { tresPorDos: 'accesorios' } : {}),
});
