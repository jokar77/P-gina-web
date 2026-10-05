import { readdirSync } from 'node:fs';
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

/*
 * Fuera del sitemap: el pedido, que es la cesta de cada cual y para Google está vacío,
 * y /accesorios mientras no haya ningún accesorio (la página existe, pero solo dice que
 * aún no hay nada). En cuanto Sakina suba el primero, entra sola.
 */
const hayAccesorios = readdirSync('./src/content/accesorios').some((f) => f.endsWith('.md'));
const fueraDelSitemap = ['/pedido', ...(hayAccesorios ? [] : ['/accesorios'])];

export default defineConfig({
  site,
  integrations: [
    sitemap({
      filter: (pagina) => !fueraDelSitemap.some((r) => new URL(pagina).pathname.startsWith(r)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
