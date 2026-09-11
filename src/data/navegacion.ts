import { getCollection } from 'astro:content';
import site from './site.json';

/**
 * Los nombres salen de site.json, que es lo que Sakina edita desde el formulario: así,
 * si cambia el título de una sección, el menú cambia con él y no se quedan discordando.
 *
 * «Otros trabajos» solo aparece cuando hay algo dentro. Un enlace del menú que lleva a
 * una sección vacía —o peor, a una sección que no existe— es una promesa incumplida.
 */
export async function secciones() {
  const archivo = await getCollection('archivo');
  return [
    { href: '/#bolsos', texto: site.secciones.bolsos.titulo },
    { href: '/#nino', texto: site.secciones.nino.titulo },
    ...(archivo.length > 0
      ? [{ href: '/#archivo', texto: site.secciones.archivo.titulo }]
      : []),
    { href: '/#disena', texto: site.secciones.disena.titulo },
    { href: '/#taller', texto: site.taller.titulo },
  ];
}

/** Páginas legales. El aviso legal falta a propósito: ver PLAN.md §4. */
export const LEGALES = [
  { href: '/condiciones', texto: 'Condiciones de venta' },
  { href: '/desistimiento', texto: 'Devoluciones' },
  { href: '/privacidad', texto: 'Privacidad' },
];
