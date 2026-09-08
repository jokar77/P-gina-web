# Sakina Platero — sistema visual

Mundo fijado por el cliente. No es una propuesta abierta: estas decisiones ya se tomaron y
se descartaron alternativas a propósito.

## Idea

El fondo de la web es un gris verdoso frío, cercano al tono de la tela sobre la que están
hechas las fotos. Las imágenes se apoyan en la página sin marco ni sombra, y todo el color
lo ponen los bolsos. La página es el taller; las piezas son lo único que se mira.

**Anti-referencia explícita:** crema + acento terracota + serif de alto contraste. Es la
paleta por defecto de toda la artesanía en internet y aquí está descartada.

## Tokens

| Token | Valor | Uso |
|---|---|---|
| `--color-paper` | `#E6E8E5` | Fondo general |
| `--color-panel` | `#D3D8D4` | Fondos de sección, marcadores de imagen |
| `--color-deep` | `#22282A` | Configurador, pie, botones |
| `--color-ink` | `#1F1D1B` | Texto |
| `--color-ink-soft` | `#5F5E58` | Texto secundario |
| `--color-line` | `#A9AFA9` | Filetes |

`--paper` y `--panel` están muy cerca en luminosidad a propósito. La separación entre
secciones la hace el filete de 1px, nunca una caja ni una sombra.

## Tipografía

- **Gloock** — marca, títulos de sección, nombre de pieza, precio en ficha.
- **Karla** — todo lo demás, incluidos los títulos de las condiciones.

Cuerpo 17px / 1.65. Titulares en 1.06 con `letter-spacing: -0.015em`. Medida de lectura
65–75ch.

## Reglas

- Nada de mayúsculas sostenidas en etiquetas ni antetítulos.
- Ninguna palabra suelta coloreada dentro de un titular.
- Una sola animación autoral: los marcadores de la portada asentándose al cargar. El resto
  es respuesta al toque. `prefers-reduced-motion` respetado.
- Espaciado en múltiplos de 4. Secciones a 74px de padding vertical.
- Elevación declarada una sola vez: o filete o sombra, nunca las dos.
- Los estados de foco se ven siempre (`:focus-visible`).
- Las piezas vendidas no se ocultan. Se quedan como portfolio, con el precio sustituido.

## Fotografía

Las fotos de producto están tomadas sobre una manta gris azulada; la de grupo, sobre lino
tostado. Van sin borde, sin sombra y sin esquinas redondeadas: se apoyan directamente en el
papel. Formato vertical 3:4.

La foto de grupo es el único objeto cálido de una página fría, y por eso abre la web.

## Portada interactiva

La foto de grupo es un mapa: cada bolso es un enlace a su página. Al señalar uno, la imagen
se atenúa salvo un foco suave sobre esa pieza y aparece su nombre. No se recortan siluetas
—no hay máscara que imite el contorno de un bolso—, el foco es luz, no recorte.

En táctil los marcadores se ven siempre, porque nadie descubre que una foto es clicable si
no se le dice.
