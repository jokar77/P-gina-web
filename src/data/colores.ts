export const COLORES = {
  turquesa: { nombre: 'Turquesa', muestra: '#2FB0A2' },
  rojo: { nombre: 'Rojo', muestra: '#BE1F26' },
  granate: { nombre: 'Granate', muestra: '#7A2231' },
  coral: { nombre: 'Coral', muestra: '#F28A76' },
  teja: { nombre: 'Teja', muestra: '#D07850' },
  amarillo: { nombre: 'Amarillo', muestra: '#F5B301' },
  crudo: { nombre: 'Crudo', muestra: '#E4D8C4' },
  dorado: { nombre: 'Dorado', muestra: '#B0A06B' },
  chocolate: { nombre: 'Chocolate', muestra: '#493428' },
  gris: { nombre: 'Gris', muestra: '#B6B2AE' },
  bicolor: {
    nombre: 'Bicolor',
    muestra: 'linear-gradient(135deg, #EFE9DD 0 50%, #1E1E1E 50% 100%)',
  },
} as const;

export type ColorId = keyof typeof COLORES;

export const COLOR_IDS = Object.keys(COLORES) as ColorId[];
