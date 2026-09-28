/**
 * Cloudflare Web Analytics: cuenta visitas y páginas vistas sin cookies y sin
 * identificar a nadie, así que no hace falta banner de consentimiento.
 *
 * El token sale del panel de Cloudflare (Analytics & Logs → Web Analytics → el sitio →
 * «Manage site» → el fragmento JS, el valor de "token"). No es secreto: va escrito en
 * el HTML de cada página y solo sirve para que Cloudflare sepa de qué sitio son las
 * visitas.
 *
 * Vacío, no se carga nada. Al rellenarlo, hay que cambiar también la política de
 * privacidad (src/content/legal/privacidad.md), que dice que no hay analítica y que la
 * web no carga nada de otras empresas. La CSP no hay que tocarla:
 * scripts/generar-cabeceras.mjs ya abre el script de Cloudflare y el envío de datos en
 * las páginas que lo llevan, y solo en esas.
 */
export const TOKEN_ANALITICA = '';

/** De dónde se carga el script y adónde manda las visitas. */
export const ANALITICA = {
  script: 'https://static.cloudflareinsights.com/beacon.min.js',
  envio: 'https://cloudflareinsights.com',
};
