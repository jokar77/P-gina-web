import site from '../data/site.json';

/**
 * Los campos de site.json que pueden quedar vacíos.
 *
 * Pages CMS no guarda en blanco lo que se deja en blanco: borra la clave del JSON. Así
 * que vaciar el Instagram desde el formulario hace desaparecer `instagram` del archivo,
 * y cualquier sitio que lo leyera directamente dejaría de compilar. Ha pasado ya una vez.
 *
 * Aquí faltar y estar en blanco son lo mismo, que es lo que significan para quien edita.
 */
type Opcional = 'instagram' | 'tiktok' | 'youtube' | 'piePortada';

const ajustes = site as Partial<Record<Opcional, string>>;

export const opcional = (clave: Opcional) => ajustes[clave]?.trim() ?? '';
