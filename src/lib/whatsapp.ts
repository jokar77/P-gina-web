import site from '../data/site.json';

export const enlaceWhatsapp = (texto: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;

export const mensajePieza = (nombre: string, precio: number, vendido: boolean) =>
  vendido
    ? `Hola Sakina, he visto ${nombre} y sé que está vendido. ¿Podrías hacer uno parecido?`
    : `Hola Sakina, me interesa ${nombre} (${precio} €). ¿Sigue disponible?`;

export const mensajeEncargo = (nombre: string, precioDesde: number) =>
  `Hola Sakina, me interesa ${nombre} (desde ${precioDesde} €). ¿Lo hacéis por encargo?`;
