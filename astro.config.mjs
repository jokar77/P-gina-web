import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * De dónde sale la URL del sitio, en orden:
 *
 * 1. SITE_URL — por si algún día hay que construir para otra dirección sin tocar esto.
 * 2. El dominio propio, sakinaplatero.com (comprado en Cloudflare en septiembre 2026).
 *
 * De aquí salen las URL absolutas de las etiquetas Open Graph, la canonical, el sitemap
 * y el robots.txt. Y decide si la web se deja indexar: en una dirección provisional de
 * Cloudflare (.workers.dev, .pages.dev) lleva "noindex" (ver src/lib/sitio.ts); en el
 * dominio de verdad, no.
 *
 * La dirección provisional del Worker (sakina-platero.sakinaplateroben.workers.dev)
 * sigue funcionando, pero ya no es la del sitio: su canonical apunta al dominio, así
 * que Google se queda con este.
 */
const site = process.env.SITE_URL || 'https://sakinaplatero.com';

export default defineConfig({
  site,
  // El pedido es la cesta de cada cual: vacía para Google, no pinta nada en el sitemap.
  integrations: [sitemap({ filter: (pagina) => !new URL(pagina).pathname.startsWith('/pedido') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
