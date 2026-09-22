import site from '../data/site.json';
import { precio } from './formato';

const { envios } = site;

const MARCADORES: Record<string, string> = {
  '{precioRecogida}': precio(envios.puntoRecogida),
  '{precioDomicilio}': precio(envios.domicilio),
  '{precioGratis}': precio(envios.gratisDesde),
  '{zonaEnvio}': envios.zona,
  '{plazoDias}': envios.plazoDias,
};

/**
 * El HTML ya compilado del cuerpo de una página legal (ver content.config.ts →
 * `legal`), con los marcadores de precio y plazo sustituidos por lo que haya en
 * site.json → envíos.
 *
 * La sustitución va sobre el HTML ya compilado, no reescribiendo el markdown
 * antes de compilarlo: mutar `entry.body` no sirve, Astro compila igual el
 * original y ese cambio se pierde (comprobado a mano antes de escribir esto).
 * `entry.rendered.html` sí es el HTML final tal cual queda cacheado, así que
 * sustituir ahí llega a tiempo.
 */
export function cuerpoLegal(entry: { rendered?: { html: string } }): string {
  let html = entry.rendered?.html ?? '';
  for (const [marcador, valor] of Object.entries(MARCADORES)) {
    html = html.replaceAll(marcador, valor);
  }
  return html;
}
