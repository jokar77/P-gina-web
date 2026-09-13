import type { APIRoute } from 'astro';

/**
 * Igual que el resto de URL absolutas del sitio: sale de `site` (ver astro.config.mjs),
 * así que apunta solo a la dirección de verdad sin que nadie tenga que acordarse de
 * cambiarla el día que llegue el dominio propio.
 *
 * No hay ningún Disallow: mientras la web vive en una dirección provisional, quien
 * bloquea el rastreo es la meta "noindex" de Layout.astro, no este archivo — si se
 * bloqueara aquí, Google no llegaría a leer esa meta y podría acabar indexando la URL
 * igualmente con solo la dirección, sin contenido.
 */
export const GET: APIRoute = ({ site }) => {
  const cuerpo = `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}
`;
  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
