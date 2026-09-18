// Se ejecuta después de `astro build`. Busca en el HTML ya construido los <script>
// sin `src` (hoy, solo los de datos estructurados application/ld+json: cualquier otro
// script del sitio lo empaqueta Astro en un archivo aparte), calcula el hash sha256 de
// cada uno tal cual queda en el HTML, y añade a dist/_headers una sección por página con
// una Content-Security-Policy propia que solo lleva los hashes de esa página.
//
// Antes era una única lista global de hashes, metida en el script-src de la CSP de
// `/*`: con cada pieza nueva del catálogo la línea crecía, y Cloudflare rechaza
// cualquier línea de _headers de más de 2000 caracteres —justo lo que pasó al llegar a
// 41 hashes, y volvería a pasar tarde o temprano por mucho que se retrasara-. Por
// página la línea se queda siempre corta (la ficha de la marca más, como mucho, un
// producto y unas migas de pan: 2-3 hashes), así que aguanta crecer el catálogo
// indefinidamente sin volver a tropezar con el límite.
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

async function htmlFiles(dir) {
  const archivos = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) archivos.push(...(await htmlFiles(ruta)));
    else if (entrada.name.endsWith('.html')) archivos.push(ruta);
  }
  return archivos;
}

const RE_SCRIPT_INLINE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;

// La URL con la que Cloudflare compara el patrón de cada sección: quita el prefijo del
// directorio de build, y un "index.html" final se convierte en la barra que sirve ese
// directorio (Astro siempre construye en formato "carpeta/index.html").
function urlPublica(archivo) {
  const ruta = '/' + path.relative(DIST, archivo).split(path.sep).join('/');
  return ruta.endsWith('/index.html') ? ruta.slice(0, -'index.html'.length) : ruta;
}

const baseCsp =
  "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; " +
  "script-src 'self'{HASHES}; font-src 'self' data:; form-action 'none'; " +
  "frame-ancestors 'none'; base-uri 'self'; upgrade-insecure-requests";

const secciones = [];
let totalHashes = 0;
for (const archivo of await htmlFiles(DIST)) {
  const html = await readFile(archivo, 'utf8');
  const hashes = new Set();
  for (const [, cuerpo] of html.matchAll(RE_SCRIPT_INLINE)) {
    if (!cuerpo.trim()) continue;
    const hash = createHash('sha256').update(cuerpo, 'utf8').digest('base64');
    hashes.add(`'sha256-${hash}'`);
  }
  if (hashes.size === 0) continue;
  totalHashes += hashes.size;
  const csp = baseCsp.replace('{HASHES}', ' ' + [...hashes].join(' '));
  secciones.push(`${urlPublica(archivo)}\n  Content-Security-Policy: ${csp}\n`);
}

const rutaCabeceras = path.join(DIST, '_headers');
const cabeceras = await readFile(rutaCabeceras, 'utf8');
if (cabeceras.includes('__LD_JSON_HASHES__')) {
  throw new Error('dist/_headers todavía lleva el marcador __LD_JSON_HASHES__ de la versión antigua');
}
await writeFile(rutaCabeceras, `${cabeceras}\n${secciones.join('\n')}`);

console.log(
  `generar-cabeceras: ${secciones.length} página(s) con CSP propia, ${totalHashes} hash(es) en total`
);
