/**
 * La geometría del dibujo del bolso a medida (ver components/Maqueta.astro).
 *
 * Cada forma es un puñado de números —ancho, alto, cuánto se abomba, cómo es el asa—
 * y todo el dibujo sale de ellos. Así pasar de una forma a otra es interpolar números:
 * el bolso se estira, se encoge y el asa crece o se esconde, en vez de cambiar un dibujo
 * por otro. Lo usan igual el servidor (el primer dibujo, que se ve aunque no cargue el
 * JavaScript) y el navegador (cada fotograma de la animación).
 *
 * Todo está medido sobre las fotos de las piezas: el punto es trapillo grueso, unas
 * doce vueltas de alto y catorce puntos de ancho en un bolso mediano; cada punto es una
 * «uve» de dos granos rellenos; las asas son una trenza de esos mismos granos.
 */

export type Punto = [number, number];

export const LIENZO = { ancho: 280, alto: 310 } as const;
const CX = 140;
/** Altura de una vuelta de punto. */
export const FILA = 12;
/** Ancho aproximado de un punto: al repartir una vuelta se redondea a puntos enteros. */
const PUNTO = 13;
/** Altura a la que queda centrado el conjunto bolso + asa. */
const CENTRO = 146;

export interface Parametros {
  ancho: number;
  alto: number;
  /** Cuánto más estrecha es la boca que la base, por cada lado. */
  estrechez: number;
  radioArriba: number;
  radioAbajo: number;
  /** Cuánto se abomban los costados: el trapillo cede, no es una caja. */
  panza: number;
  /** Alto de la boca abierta que se ve por arriba; 0 es un bolso cerrado. */
  boca: number;
  /** Media separación entre los dos enganches del asa. */
  asaMedio: number;
  asaAlto: number;
  asaGrosor: number;
  /** 1 = asa redonda, menos = más en punta, como las asas cortas de un tote. */
  asaCurva: number;
  asaVisible: number;
  anillas: number;
  ranura: number;
  ranuraAncho: number;
}

export type FormaId = 'tote' | 'hombro' | 'sin-asa';

export const FORMAS: Record<FormaId, Parametros> = {
  // Sayf: tote ancho y bajo, con un asa corta y gruesa casi en pico.
  tote: {
    ancho: 196,
    alto: 116,
    estrechez: 6,
    radioArriba: 9,
    radioAbajo: 20,
    panza: 5,
    boca: 11,
    asaMedio: 48,
    asaAlto: 64,
    asaGrosor: 14,
    asaCurva: 0.62,
    asaVisible: 1,
    anillas: 0,
    ranura: 0,
    ranuraAncho: 64,
  },
  // Sakura: casi cuadrado, con una correa larga que sale de las esquinas con anillas.
  hombro: {
    ancho: 156,
    alto: 126,
    estrechez: 2,
    radioArriba: 10,
    radioAbajo: 16,
    panza: 4,
    boca: 10,
    asaMedio: 64,
    asaAlto: 104,
    asaGrosor: 10,
    asaCurva: 0.95,
    asaVisible: 1,
    anillas: 1,
    ranura: 0,
    ranuraAncho: 64,
  },
  // Duna: de mano, ancho y cerrado, con la ranura del agarre abierta en el propio tejido.
  'sin-asa': {
    ancho: 214,
    alto: 104,
    estrechez: 4,
    radioArriba: 11,
    radioAbajo: 22,
    panza: 6,
    boca: 0,
    asaMedio: 30,
    asaAlto: 0,
    asaGrosor: 8,
    asaCurva: 0.8,
    asaVisible: 0,
    anillas: 0,
    ranura: 1,
    ranuraAncho: 68,
  },
};

export const mezclar = (a: Parametros, b: Parametros, t: number): Parametros => {
  const r = { ...a };
  for (const k of Object.keys(a) as (keyof Parametros)[]) r[k] = a[k] + (b[k] - a[k]) * t;
  return r;
};

const f = (n: number) => Math.round(n * 10) / 10;

/** La línea del suelo: se mueve con la forma para que bolso + asa queden centrados. */
export const suelo = (p: Parametros) => CENTRO + (p.alto + p.asaAlto * Math.max(0, p.asaVisible)) / 2;

export interface Caja {
  yT: number;
  yB: number;
  xLT: number;
  xRT: number;
  xLB: number;
  xRB: number;
}

export const caja = (p: Parametros): Caja => {
  const yB = suelo(p);
  const xLB = CX - p.ancho / 2;
  const xRB = CX + p.ancho / 2;
  return { yT: yB - p.alto, yB, xLB, xRB, xLT: xLB + p.estrechez, xRT: xRB - p.estrechez };
};

const xIzq = (c: Caja, y: number) => c.xLT + ((c.xLB - c.xLT) * (y - c.yT)) / (c.yB - c.yT);
const xDer = (c: Caja, y: number) => c.xRT + ((c.xRB - c.xRT) * (y - c.yT)) / (c.yB - c.yT);

/**
 * El contorno del cuerpo. Siempre con los mismos comandos en el mismo orden, para que se
 * pueda interpolar punto a punto: la boca cae un poco en el centro, los costados se
 * abomban y la base se descuelga, que es lo que hace el trapillo con su propio peso.
 */
export function cuerpo(p: Parametros, c = caja(p)): string {
  const { yT, yB } = c;
  const rT = p.radioArriba;
  const rB = p.radioAbajo;
  const b = p.panza;
  const y2 = yT + rT;
  const y3 = yB - rB;
  const ya = y2 + (y3 - y2) / 3;
  const yb = y2 + (2 * (y3 - y2)) / 3;
  const x0 = c.xLT + rT;
  const x1 = c.xRT - rT;
  const x4 = c.xRB - rB;
  const x5 = c.xLB + rB;
  return (
    `M${f(x0)} ${f(yT)}` +
    `C${f(x0 + (x1 - x0) / 3)} ${f(yT + 2.5)} ${f(x0 + (2 * (x1 - x0)) / 3)} ${f(yT + 2.5)} ${f(x1)} ${f(yT)}` +
    `Q${f(c.xRT)} ${f(yT)} ${f(xDer(c, y2))} ${f(y2)}` +
    `C${f(xDer(c, ya) + b)} ${f(ya)} ${f(xDer(c, yb) + b)} ${f(yb)} ${f(xDer(c, y3))} ${f(y3)}` +
    `Q${f(c.xRB)} ${f(yB)} ${f(x4)} ${f(yB)}` +
    `C${f(x4 - (x4 - x5) / 3)} ${f(yB + 3)} ${f(x4 - (2 * (x4 - x5)) / 3)} ${f(yB + 3)} ${f(x5)} ${f(yB)}` +
    `Q${f(c.xLB)} ${f(yB)} ${f(xIzq(c, y3))} ${f(y3)}` +
    `C${f(xIzq(c, yb) - b)} ${f(yb)} ${f(xIzq(c, ya) - b)} ${f(ya)} ${f(xIzq(c, y2))} ${f(y2)}` +
    `Q${f(c.xLT)} ${f(yT)} ${f(x0)} ${f(yT)}Z`
  );
}

/**
 * El remate de la boca: la última vuelta, más gruesa, que corre por el borde de arriba y
 * dobla un poco en las esquinas, por donde se va hacia atrás.
 */
export function remate(p: Parametros, c = caja(p)): Punto[] {
  const y = c.yT + 4;
  const r = Math.max(3, p.radioArriba - 3);
  const xL = c.xLT + 4;
  const xR = c.xRT - 4;
  const P = Math.PI;
  const medio = Array.from({ length: 25 }, (_, i): Punto => {
    const u = i / 24;
    return [xL + r + (xR - xL - 2 * r) * u, y + 2.5 * (1 - (2 * u - 1) ** 2)];
  });
  return [...arco(xL + r, y + r, r, r, 1.15 * P, 1.5 * P, 5), ...medio.slice(1, -1), ...arco(xR - r, y + r, r, r, -0.5 * P, -0.15 * P, 5)];
}

export interface Boca {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** La mitad de atrás del borde, que se ve por encima del remate de delante. */
  borde: Punto[];
}

export function boca(p: Parametros, c = caja(p)): Boca {
  const cx = CX;
  const cy = c.yT + 2;
  const rx = (c.xRT - c.xLT) / 2 - 4;
  const ry = Math.max(0.01, p.boca);
  return {
    cx: f(cx),
    cy: f(cy),
    rx: f(rx),
    ry: f(ry),
    borde: arco(cx, cy, rx, ry, Math.PI, 2 * Math.PI, 30),
  };
}

/** Los cuatro puntos de la curva del asa: sale del borde y vuelve a él. */
export function asa(p: Parametros, c = caja(p)): Punto[] {
  const y = c.yT + 5;
  const alto = p.asaAlto * 1.34;
  return [
    [CX - p.asaMedio, y],
    [CX - p.asaMedio * p.asaCurva, y - alto],
    [CX + p.asaMedio * p.asaCurva, y - alto],
    [CX + p.asaMedio, y],
  ];
}

export const curva = (pts: Punto[]) =>
  `M${f(pts[0]![0])} ${f(pts[0]![1])}C${pts
    .slice(1)
    .map(([x, y]) => `${f(x)} ${f(y)}`)
    .join(' ')}`;

export function ranura(p: Parametros, c = caja(p)) {
  const alto = 13;
  return { x: f(CX - p.ranuraAncho / 2), y: f(c.yT + 12), ancho: f(p.ranuraAncho), alto, radio: alto / 2 };
}

export function sombra(p: Parametros) {
  return { cx: CX, cy: f(suelo(p) + 3), rx: f(p.ancho * 0.56), ry: 10, rxContacto: f(p.ancho * 0.44) };
}

export const FLECOS = 13;

/** El grueso de cada cadeneta: el remate, la vuelta de atrás de la boca, la ranura y la
 *  solapa del monedero. El del asa va con cada forma. */
export const GROSOR = { remate: 7.5, boca: 6.4, ranura: 5.6, solapa: 4.6 } as const;

/**
 * Dónde va cada detalle. Se calculan desde la forma, así que al cambiarla los detalles
 * viajan pegados al bolso en vez de quedarse flotando donde estaban.
 */
export function anclas(p: Parametros, c = caja(p)) {
  const flecos = Array.from({ length: FLECOS }, (_, i) => {
    const u = i / (FLECOS - 1);
    const x = c.xLB + p.radioAbajo * 0.75 + (p.ancho - p.radioAbajo * 1.5) * u;
    // La base se descuelga un poco en el centro: los flecos salen de ahí, no de una recta.
    const y = c.yB - 1.5 + 3 * (1 - (2 * u - 1) ** 2);
    return [f(x), f(y)] as const;
  });
  return {
    flor: [f(c.xLB + p.ancho * 0.24), f(c.yT + p.alto * 0.52)] as const,
    lazo: [f(c.xRB - p.ancho * 0.23), f(c.yT + p.alto * 0.3)] as const,
    monedero: [f(c.xRB - 6), f(c.yB - 13)] as const,
    bolsillo: { x: CX, y: f(c.yT + p.alto * 0.63), ancho: f(p.ancho * 0.32), alto: f(p.alto * 0.34) },
    flecos,
  };
}

// ---------------------------------------------------------------------------------------
// El punto.

/** Un número entre 0 y 1 que siempre sale igual para la misma posición: el «a mano» del
 *  dibujo —cada grano un pelo distinto— sin que parpadee al redibujar. */
const azar = (a: number, b: number, c = 0) => {
  let h = Math.imul(a + 7, 374761393) ^ Math.imul(b + 13, 668265263) ^ Math.imul(c + 29, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return ((h >>> 0) % 10000) / 10000;
};

/** Una elipse girada como trazo de path, para meter cientos en un solo elemento. */
const elipse = (cx: number, cy: number, rx: number, ry: number, grados: number) => {
  const r = (grados * Math.PI) / 180;
  const dx = rx * Math.cos(r);
  const dy = rx * Math.sin(r);
  return (
    `M${f(cx - dx)} ${f(cy - dy)}A${f(rx)} ${f(ry)} ${f(grados)} 1 0 ${f(cx + dx)} ${f(cy + dy)}` +
    `A${f(rx)} ${f(ry)} ${f(grados)} 1 0 ${f(cx - dx)} ${f(cy - dy)}Z`
  );
};

export interface Tejido {
  /** Lo oscuro que asoma bajo cada grano: es lo que le da bulto. */
  sombra: string;
  /** Los granos, del color de la lana. */
  lana: string;
  /** El brillo de arriba de cada grano. */
  luz: string;
  /** La raya entre vuelta y vuelta. */
  surcos: string;
}

/**
 * Todos los puntos de una superficie, vuelta a vuelta desde abajo, como se teje.
 * Cada vuelta reparte un número entero de puntos en su ancho —las de arriba de un bolso
 * que se estrecha llevan alguno menos—, y cada punto es una uve de dos granos.
 */
export function tejido(c: Caja, zonaArriba = 7, semilla = 1): Tejido {
  let sombra = '';
  let lana = '';
  let luz = '';
  let surcos = '';
  for (let k = 0; ; k++) {
    const yb = c.yB - k * FILA;
    const ym = yb - FILA / 2;
    if (ym < c.yT + zonaArriba) break;
    const xl = xIzq(c, ym);
    const xr = xDer(c, ym);
    const n = Math.max(2, Math.round((xr - xl) / PUNTO));
    const s = (xr - xl) / n;
    if (k > 0) {
      const a = xIzq(c, yb);
      const b = xDer(c, yb);
      surcos += `M${f(a - 4)} ${f(yb)}Q${f((a + b) / 2)} ${f(yb + 1.2)} ${f(b + 4)} ${f(yb)}`;
    }
    for (let j = 0; j < n; j++) {
      const x = xl + s * (j + 0.5) + (azar(k, j, semilla) - 0.5) * 1.2;
      for (const lado of [-1, 1]) {
        const r = azar(k, j * 2 + lado, semilla);
        const cx = x + lado * s * 0.19;
        const cy = ym + (r - 0.5) * 0.8;
        const ancho = s * 0.2 * (0.94 + r * 0.12);
        const largoGrano = FILA * 0.54;
        // Cada grano se inclina hacia fuera por arriba: los dos juntos hacen la uve.
        const giro = 90 + lado * (26 + (r - 0.5) * 8);
        sombra += elipse(cx + 0.2, cy + 0.9, largoGrano * 1.08, ancho * 1.3, giro);
        lana += elipse(cx, cy, largoGrano, ancho, giro);
        luz += elipse(cx - lado * 0.5, cy - 2, largoGrano * 0.46, ancho * 0.45, giro);
      }
    }
  }
  return { sombra, lana, luz, surcos };
}

export interface Cadeneta {
  /** La línea por la que corre, para el fondo y el contorno. */
  linea: string;
  sombra: string;
  lana: string;
  luz: string;
}

const polilinea = (pts: Punto[]) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L');

export const muestrearCubica = (pts: Punto[], n = 60): Punto[] => {
  const [p0, p1, p2, p3] = pts as [Punto, Punto, Punto, Punto];
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  });
};

/** Una trenza a lo largo de una curva de cuatro puntos: el asa. */
export const trenza = (pts: Punto[], grosor: number) => cadeneta(muestrearCubica(pts), grosor);

/**
 * La cadeneta gruesa de las asas, el remate de la boca y los bordes de la ranura y del
 * monedero: granos inclinados a un lado y a otro a lo largo de la línea, como está hecha
 * de verdad cada una de esas partes.
 */
export function cadeneta(pts: Punto[], grosor: number, cerrada = false): Cadeneta {
  const muestras: { x: number; y: number; s: number }[] = [];
  let largo = 0;
  let prev = pts[0]!;
  for (const q of cerrada ? [...pts, pts[0]!] : pts) {
    largo += Math.hypot(q[0] - prev[0], q[1] - prev[1]);
    muestras.push({ x: q[0], y: q[1], s: largo });
    prev = q;
  }
  const linea = polilinea(pts) + (cerrada ? 'Z' : '');
  let sombra = '';
  let lana = '';
  let luz = '';
  if (grosor < 1 || largo < 4) return { linea, sombra, lana, luz };
  // Un número entero de granos, para que en una cadeneta cerrada no quede un salto.
  const paso = largo / Math.max(1, Math.round(largo / (grosor * 0.6)));
  let m = 1;
  for (let i = 0, s = paso / 2; s < largo - paso / 3; i++, s += paso) {
    while (m < muestras.length - 1 && muestras[m]!.s < s) m++;
    const a = muestras[m - 1]!;
    const b = muestras[m]!;
    const t = (s - a.s) / Math.max(0.001, b.s - a.s);
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    const lado = i % 2 ? 1 : -1;
    const cx = x - Math.sin(ang) * lado * grosor * 0.17;
    const cy = y + Math.cos(ang) * lado * grosor * 0.17;
    const giro = (ang * 180) / Math.PI + lado * 34;
    const rx = paso * 0.92;
    const ry = grosor * 0.3;
    sombra += elipse(cx + 0.3, cy + 1.1, rx * 1.05, ry * 1.12, giro);
    lana += elipse(cx, cy, rx, ry, giro);
    luz += elipse(cx - 0.4, cy - ry * 0.45, rx * 0.5, ry * 0.42, giro);
  }
  return { linea, sombra, lana, luz };
}

/** Los puntos de un arco de elipse, entre dos ángulos. */
export const arco = (cx: number, cy: number, rx: number, ry: number, desde: number, hasta: number, n = 40): Punto[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = desde + ((hasta - desde) * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

export function rectanguloRedondo(x: number, y: number, w: number, h: number, r: number): Punto[] {
  const rr = Math.min(r, w / 2, h / 2);
  const P = Math.PI;
  return [
    ...arco(x + w - rr, y + rr, rr, rr, -P / 2, 0, 8),
    ...arco(x + w - rr, y + h - rr, rr, rr, 0, P / 2, 8),
    ...arco(x + rr, y + h - rr, rr, rr, P / 2, P, 8),
    ...arco(x + rr, y + rr, rr, rr, P, (3 * P) / 2, 8),
  ];
}

// ---------------------------------------------------------------------------------------
// El color.

/**
 * Las franjas de color del cuerpo, como paradas de un degradado vertical sin fundido.
 * Con un color es una sola franja; con dos, alternan cada dos vueltas desde la base,
 * que es como se cambia de hilo en ganchillo. `hasta` es la vuelta a la que ha llegado
 * el tejido nuevo: por debajo va el color nuevo, por encima sigue el anterior.
 */
export function franjas(nuevos: string[], viejos: string[], ySuelo: number, hasta: number): string {
  const tramos = (tonos: string[]) => {
    const a = tonos[0]!;
    const b = tonos[1] ?? a;
    const r: [number, number, string][] = [[ySuelo, LIENZO.alto, a]];
    for (let k = 0; ySuelo - k * FILA > -FILA * 2; k += 2) {
      r.push([ySuelo - (k + 2) * FILA, ySuelo - k * FILA, (k / 2) % 2 ? b : a]);
    }
    return r;
  };
  const recortar = (r: [number, number, string][], y0: number, y1: number) =>
    r
      .map(([a, b, c]) => [Math.max(a, y0), Math.min(b, y1), c] as [number, number, string])
      .filter(([a, b]) => b > a);
  const todos = [...recortar(tramos(viejos), 0, hasta), ...recortar(tramos(nuevos), hasta, LIENZO.alto)].sort(
    (x, y) => x[0] - y[0]
  );
  const off = (y: number) => Math.min(1, Math.max(0, y / LIENZO.alto)).toFixed(4);
  return todos
    .map(([a, b, c]) => `<stop offset="${off(a)}" stop-color="${c}"/><stop offset="${off(b)}" stop-color="${c}"/>`)
    .join('');
}
