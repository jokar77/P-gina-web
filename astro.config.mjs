import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * De dónde sale la URL del sitio, en orden:
 *
 * 1. SITE_URL — se pone a mano el día que haya dominio propio, y manda sobre todo.
 * 2. CF_PAGES_URL — solo existe en Cloudflare Pages, no en Workers.
 * 3. La dirección provisional del Worker, que es donde vive hoy.
 *
 * De aquí salen las URL absolutas de las etiquetas Open Graph. Si apuntan a un dominio
 * que todavía no existe, los enlaces compartidos por WhatsApp llegan sin miniatura.
 *
 * Ojo con el tercer punto: la web acabó desplegada como Worker, no como Pages, así que
 * `CF_PAGES_URL` nunca se rellena y sin este valor el sitio se creería que vive en
 * sakinaplatero.com, un dominio que aún no está comprado.
 */
const site =
  process.env.SITE_URL ||
  process.env.CF_PAGES_URL ||
  'https://sakina-platero.sakinaplateroben.workers.dev';

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
