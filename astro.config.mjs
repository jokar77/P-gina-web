import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * De dónde sale la URL del sitio, en orden:
 *
 * 1. SITE_URL — la que se pone a mano cuando haya dominio propio.
 * 2. CF_PAGES_URL — la que Cloudflare Pages inyecta sola en cada despliegue.
 * 3. El dominio definitivo, para construir en local.
 *
 * Esto importa más de lo que parece: de aquí salen las URL absolutas de las
 * etiquetas Open Graph. Si apunta a un dominio que todavía no existe, los enlaces
 * compartidos por WhatsApp llegan sin miniatura.
 */
const site = process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://sakinaplatero.com';

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
