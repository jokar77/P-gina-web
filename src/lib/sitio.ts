/**
 * ¿La web se está sirviendo en una dirección provisional de Cloudflare?
 *
 * Cubre las dos: `.pages.dev` y `.workers.dev`. Cuando SITE_URL apunte al dominio de
 * verdad, esto devuelve false solo y se acabaron las restricciones de provisional.
 */
export const esProvisional = (url: URL | undefined) =>
  url?.hostname.endsWith('.pages.dev') || url?.hostname.endsWith('.workers.dev') || false;
