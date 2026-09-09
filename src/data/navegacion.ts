import site from './site.json';

/**
 * Los nombres salen de site.json, que es lo que Sakina edita desde el formulario: así,
 * si cambia el título de una sección, el menú cambia con él y no se quedan discordando.
 */
export const SECCIONES = [
  { href: '/#bolsos', texto: site.secciones.bolsos.titulo },
  { href: '/#nino', texto: site.secciones.nino.titulo },
  { href: '/#disena', texto: site.secciones.disena.titulo },
  { href: '/#taller', texto: site.taller.titulo },
];

/** Páginas legales. El aviso legal falta a propósito: ver PLAN.md §4. */
export const LEGALES = [
  { href: '/condiciones', texto: 'Condiciones de venta' },
  { href: '/desistimiento', texto: 'Devoluciones' },
  { href: '/privacidad', texto: 'Privacidad' },
];
