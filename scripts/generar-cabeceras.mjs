// Se ejecuta después de `astro build`. Busca en el HTML ya construido los <script>
// sin `src` (hoy, solo los de datos estructurados application/ld+json: cualquier otro
// script del sitio lo empaqueta Astro en un archivo aparte), calcula el hash sha256 de
// cada uno tal cual queda en el HTML y los mete en dist/_headers, sustituyendo el
// marcador __LD_JSON_HASHES__. Así script-src puede quedarse en 'self' sin
// 'unsafe-inline': un hash exacto por contenido es tan seguro como servirlo desde un
// archivo propio, y aquí hace falta porque el contenido (precio, nombre de la pieza…)
// cambia de una página a otra y no se puede escribir a mano.
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

const hashes = new Set();
for (const archivo of await htmlFiles(DIST)) {
  const html = await readFile(archivo, 'utf8');
  for (const [, cuerpo] of html.matchAll(RE_SCRIPT_INLINE)) {
    if (!cuerpo.trim()) continue;
    const hash = createHash('sha256').update(cuerpo, 'utf8').digest('base64');
    hashes.add(`'sha256-${hash}'`);
  }
}

const rutaCabeceras = path.join(DIST, '_headers');
const cabeceras = await readFile(rutaCabeceras, 'utf8');
const apariciones = cabeceras.split('__LD_JSON_HASHES__').length - 1;
if (apariciones !== 1) {
  throw new Error(
    `dist/_headers tiene ${apariciones} apariciones de __LD_JSON_HASHES__ y hacía falta exactamente 1`
  );
}
await writeFile(rutaCabeceras, cabeceras.replace('__LD_JSON_HASHES__', [...hashes].join(' ')));

console.log(`generar-cabeceras: ${hashes.size} hash(es) de script en dist/_headers`);
