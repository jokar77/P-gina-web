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
