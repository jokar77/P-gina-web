/**
 * Zonas clicables sobre la foto de grupo (`_portada/grupo.jpg`).
 * Coordenadas en % de la imagen: x/y es el centro de la pieza, w/h el área sensible.
 * Si se cambia la foto de portada hay que volver a medirlas.
 */
export interface Zona {
  slug: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ZONAS: Zona[] = [
  { slug: 'rescoldo', x: 22.5, y: 19.5, w: 29, h: 16 },
  { slug: 'amapola', x: 49, y: 14.5, w: 22, h: 21 },
  { slug: 'vendimia', x: 74, y: 17.5, w: 28, h: 19 },
  { slug: 'escarcha', x: 18.5, y: 31, w: 29, h: 20 },
  { slug: 'mimosa', x: 85.5, y: 31, w: 28, h: 18 },
  { slug: 'domino', x: 85.5, y: 48.5, w: 28, h: 21 },
  { slug: 'marea', x: 13, y: 62.5, w: 26, h: 21 },
  { slug: 'cacao', x: 40.5, y: 74, w: 31, h: 26 },
  { slug: 'duna', x: 75, y: 71, w: 28, h: 16 },
];
