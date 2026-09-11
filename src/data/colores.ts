export const COLORES = {
  azul: { nombre: 'Azul', muestra: '#2FB0A2' },
  rojo: { nombre: 'Rojo', muestra: '#BE1F26' },
  granate: { nombre: 'Granate', muestra: '#7A2231' },
  rosa: { nombre: 'Rosa', muestra: '#F28A76' },
  teja: { nombre: 'Teja', muestra: '#D07850' },
  amarillo: { nombre: 'Amarillo', muestra: '#F5B301' },
  verde: { nombre: 'Verde', muestra: '#5F7A52' },
  morado: { nombre: 'Morado', muestra: '#7B5EA7' },
  crudo: { nombre: 'Crudo', muestra: '#E4D8C4' },
  blanco: { nombre: 'Blanco', muestra: '#FFFFFF' },
  dorado: { nombre: 'Dorado', muestra: '#B0A06B' },
  chocolate: { nombre: 'Chocolate', muestra: '#493428' },
  gris: { nombre: 'Gris', muestra: '#B6B2AE' },
  negro: { nombre: 'Negro', muestra: '#1E1E1E' },
  bicolor: {
    nombre: 'Bicolor',
    muestra: 'linear-gradient(135deg, #EFE9DD 0 50%, #1E1E1E 50% 100%)',
  },
} as const;

export type ColorId = keyof typeof COLORES;

export const COLOR_IDS = Object.keys(COLORES) as ColorId[];
