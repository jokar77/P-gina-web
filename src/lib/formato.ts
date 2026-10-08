const euro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const euroConCentimos = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** «5 €» si es redondo; «5,99 €» si lleva céntimos (y sin restos de sumar decimales). */
export const precio = (n: number) => {
  const c = Math.round(n * 100) / 100;
  return Number.isInteger(c) ? euro.format(c) : euroConCentimos.format(c);
};

export const medidas = (ancho: number, alto: number) => `${ancho} × ${alto} cm`;
