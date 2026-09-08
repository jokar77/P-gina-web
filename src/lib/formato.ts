const euro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const precio = (n: number) => euro.format(n);

export const medidas = (ancho: number, alto: number) => `${ancho} × ${alto} cm`;
