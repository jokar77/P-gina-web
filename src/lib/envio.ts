import site from '../data/site.json';

export type Metodo = 'recogida' | 'domicilio';

export const METODOS: { id: Metodo; nombre: string; precio: number }[] = [
  { id: 'recogida', nombre: 'Punto de recogida', precio: site.envios.puntoRecogida },
  { id: 'domicilio', nombre: 'A domicilio', precio: site.envios.domicilio },
];

/** Gratis a partir del importe que marque site.json. */
export const costeEnvio = (piezas: number, metodo: Metodo) =>
  piezas >= site.envios.gratisDesde
    ? 0
    : (METODOS.find((m) => m.id === metodo)?.precio ?? site.envios.domicilio);

export const nombreMetodo = (metodo: Metodo) =>
  METODOS.find((m) => m.id === metodo)?.nombre ?? '';
