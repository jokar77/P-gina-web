import site from '../data/site.json';

export const enlaceWhatsapp = (texto: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
