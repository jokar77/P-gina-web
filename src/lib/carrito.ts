/**
 * Carrito del lado del cliente.
 *
 * No cobra nada: reúne el pedido y lo entrega escrito por WhatsApp, que es donde se
 * acuerda el pago. Ver PRODUCT.md → Restricciones.
 *
 * Persiste en localStorage para sobrevivir a la navegación entre páginas (cada pieza
 * tiene página propia). Si el navegador lo bloquea —modo privado, cookies desactivadas—
 * el carrito sigue funcionando dentro de la misma página y se pierde al cambiar de una a
 * otra, que es la degradación aceptable.
 */

const CLAVE = 'sakina.carrito.v1';

export interface Linea {
  /** Único por línea. Para una pieza del catálogo es su slug: no se puede pedir dos veces. */
  id: string;
  nombre: string;
  precio: number;
  /** Segunda línea en el resumen: medidas, material o los extras de un encargo. */
  detalle?: string;
  /** Ruta de la ficha, para volver a ella desde el carrito. */
  url?: string;
  /** Las piezas por encargo llevan precio orientativo, no cerrado. */
  orientativo?: boolean;
  /**
   * Una pregunta, no una compra: las piezas del archivo no están a la venta y no tienen
   * precio. Suman 0 al total y se escriben como «a consultar», porque poner 0 € sería
   * decir que son gratis.
   */
  consultar?: boolean;
}

let memoria: Linea[] = [];
let usaAlmacen = true;

function leerAlmacen(): Linea[] {
  try {
    const bruto = localStorage.getItem(CLAVE);
    if (!bruto) return [];
    const datos = JSON.parse(bruto);
    if (!Array.isArray(datos)) return [];
    return datos.filter(
      (l): l is Linea =>
        !!l && typeof l.id === 'string' && typeof l.nombre === 'string' && typeof l.precio === 'number'
    );
  } catch {
    usaAlmacen = false;
    return [];
  }
}

function escribirAlmacen(lineas: Linea[]) {
  if (!usaAlmacen) return;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lineas));
  } catch {
    usaAlmacen = false;
  }
}

memoria = typeof localStorage !== 'undefined' ? leerAlmacen() : [];

const oyentes = new Set<(lineas: Linea[]) => void>();

function avisar() {
  for (const oyente of oyentes) oyente(memoria);
}

export const leer = (): Linea[] => memoria.slice();

export const contiene = (id: string) => memoria.some((l) => l.id === id);

export const total = () => memoria.reduce((suma, l) => suma + l.precio, 0);

/** ¿Algún precio del pedido es orientativo? Entonces el total también lo es. */
export const hayOrientativos = () => memoria.some((l) => l.orientativo);

/** ¿Solo hay preguntas? Entonces no hay ni total ni envío que enseñar todavía. */
export const soloConsultas = () => memoria.length > 0 && memoria.every((l) => l.consultar);

export function anadir(linea: Linea) {
  if (contiene(linea.id)) return false;
  memoria = [...memoria, linea];
  escribirAlmacen(memoria);
  avisar();
  return true;
}

export function quitar(id: string) {
  memoria = memoria.filter((l) => l.id !== id);
  escribirAlmacen(memoria);
  avisar();
}

export function vaciar() {
  memoria = [];
  escribirAlmacen(memoria);
  avisar();
}

export function suscribir(oyente: (lineas: Linea[]) => void) {
  oyentes.add(oyente);
  oyente(memoria);
  return () => oyentes.delete(oyente);
}

/** Otra pestaña ha tocado el carrito: mantenerlo en sincronía. */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== CLAVE) return;
    memoria = leerAlmacen();
    avisar();
  });
}
