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

## Marca

Tres piezas, cada una con su sitio. No se mezclan.

| Pieza | Dónde | Por qué |
|---|---|---|
| **Logotipo** (script sobre serif condensada) | Portada y pie | Es la firma completa: va donde se declara quién es. |
| **Símbolo** (el lazo de pincel) | Barra de navegación y favicon | El logotipo completo a 40px sería ilegible; el lazo aguanta. |
| **Firma** (rotulador) | Cierre de "El taller" | Es una firma: significa algo al final de un texto en primera persona, no en una cabecera. |

Llegaron en JPEG sobre crema. El alfa está derivado de la luminancia del propio dibujo
—no es un recorte de contorno—, lo que conserva los pelos del pincel y el antialias. El
color se fija a tinta plana para que el borde componga bien sobre el papel.

Sobre superficies oscuras van las variantes `-claro`, teñidas de papel: la tinta negra
sobre el `--deep` del pie desaparece.

El favicon lleva el papel horneado detrás, porque un símbolo negro sobre transparente se
pierde en una pestaña oscura, y el alfa va con ganancia a 32px para que el trazo fino no
se apague.

**"Sakina Studio" no está en esta web.** Es otra marca, no otra versión de esta, y usar
las dos haría que no se supiera quién vende.

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

## La portada

Quién es, y tres puertas. Nada más.

La web era una sola página larguísima: aterrizabas ante el logotipo y para llegar a
cualquier cosa había que bajar por todo lo demás, el configurador incluido. Ahora cada
familia tiene su página —`/bolsos`, `/ninos`, `/archivo`, `/taller`— y la portada solo
presenta.

El nombre va pequeño, no a pantalla completa: quien entra tiene que ver la obra, no un
logotipo. El nombre entero ya está en el pie y el símbolo en la barra.

Cada familia enseña sus piezas **recortadas y amontonadas**, no en cuadrícula. Una
cuadrícula sería el catálogo otra vez, y el catálogo está una página más allá; amontonadas
se leen como lo que son, un montón de cosas hechas a mano, y caben todas en una pantalla.
El tamaño está calibrado para que los doce bolsos quepan en una fila: uno más grande y el
último se cae solo a una segunda fila, que se lee como un error.

Los recortes se hacen a mano (rembg, fuera de la web: el modelo pesa 179 MB y no cabe en
la construcción). Por eso el campo `recorte` es **opcional**: una pieza recién subida sale
en su página desde el primer momento y se une al montón cuando alguien le haga el recorte.
Obligarlo sería poner una puerta entre Sakina y publicar.

## Otros trabajos

Obra hecha que no está a la venta. No es otra categoría de producto: es la prueba de lo
que sabe hacer cuando el encargo no es un bolso.

Van agrupadas por tipo, con encabezado: un vestido de flamenca no se parece en nada a un
bolso de trapillo, y meterlos en la misma rejilla los convertiría a los dos en catálogo.
La disparidad se enseña en vez de disimularse, porque la disparidad es justo lo que dice
«esto también lo hago».

Sin precio y sin botón de comprar. Se puede preguntar, y preguntar entra en el mismo
pedido que todo lo demás —no se inventa un segundo camino—, como línea «a consultar» que
no suma al total. Si en el pedido solo hay preguntas no se enseña ni total ni envío: no
hay nada que sumar todavía.

Vacía, la sección no existe. Una sección vacía en una web publicada es peor que no
tenerla, y un enlace del menú que lleva a ella es una promesa incumplida.
