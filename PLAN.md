# Sakina Platero — plan y memoria del proyecto

Este archivo es la memoria: qué está hecho, qué falta, qué se decidió y por qué. Los otros
dos documentos cubren lo suyo y no se repiten aquí:

- **`PRODUCT.md`** — qué es el producto, a quién le habla, sus restricciones.
- **`DESIGN.md`** — el mundo visual: paleta, tipografía, marca, reglas.

---

## 1. Estado actual

Web construida y funcionando, sin publicar. Astro 7 + Tailwind 4, sitio estático, sin
servidor ni base de datos.

- 11 bolsos y 2 conjuntos de niño, **cada uno con su página propia** y etiquetas Open
  Graph, para que el enlace compartido por WhatsApp llegue con miniatura.
- Portada interactiva: la foto de grupo es un mapa, cada bolso lleva a su página, y debajo
  una tira a sangre con las once piezas que se desliza sola y se arrastra con el dedo.
- Rejilla con filtros por color y conmutador de disponibles.
- Configurador de encargo con fotos reales.
- Carrito que reúne el pedido entre páginas, calcula el envío según recogida o domicilio, y
  lo entrega escrito por WhatsApp con la dirección si se ha rellenado. **No cobra.**
- Contenido en archivos del repositorio con esquema tipado, listo para un CMS de formularios.

Verificado con navegador real: recorrido completo de portada → ficha → carrito →
configurador → total, en escritorio y móvil, sin errores ni imágenes rotas.

**Peso real:** una visita completa a la portada son unos 2 MB (1 MB si solo ve la primera
pantalla). El sitio construido son 68 MB y 317 archivos, muy dentro de los límites de
Cloudflare Pages.

---

## 2. Lo que bloquea publicar

Nada de esto es código. Son datos que solo tiene ella.

| Qué | Por qué bloquea |
|---|---|
| **Número de WhatsApp real** | Ahora hay un `34600000000` de relleno: **ningún botón de la web funciona**. Está en `src/data/site.json`. |
| **Enlaces de las redes** | Instagram, TikTok y YouTube en `site.json`. Cada icono del pie aparece solo cuando su URL está rellena, así que ahora mismo solo se ve WhatsApp. Instagram es de donde va a venir la gente. |
| **Nombres, precios y medidas reales** | Los actuales vienen del boceto y son inventados. Ver §6. |
| **Texto de "El taller"** | Hay uno provisional escrito por mí, marcado como tal en `site.json`. |
| **Consulta con la gestoría** | Ver §4. Esto condiciona qué se puede publicar. |

---

## 3. Roadmap

### Fase 1 — Antes de publicar

- [ ] Rellenar los datos de §2 en `src/data/site.json` y en las piezas.
- [ ] **Repetir las fotos de producto sobre el lino tostado.** Las actuales están sobre una
      manta gris azulada más oscura que el papel de la web, así que se leen como recuadros
      en vez de fundirse con la página, que era la idea de todo el diseño. La de grupo sí
      está sobre el lino bueno. Esto sube el nivel más que cualquier cambio de código.
- [ ] **Conseguir la foto de grupo a resolución completa.** Es la que abre la web y es la
      más pequeña de todas: 928×1152, mientras que las demás son 1536×2048.
- [ ] **Página 404.** No hay ninguna; ahora saldría la genérica de Cloudflare. Es barata y
      es la única página que alguien ve cuando algo va mal.
- [ ] **`robots.txt` y comprobar el sitemap.** El sitemap ya se genera solo.
- [ ] Decidir si se crea la rama `main` para producción, o se despliega desde
      `claude/ipad-access-issue-xczlml`.
- [ ] Desplegar en Cloudflare Pages (ver §5).

### Fase 2 — Legal y cumplimiento

**Lo primero, porque ahorra trabajo: hoy no hace falta banner de cookies.**

La web **no pone ni una cookie** y no carga ningún script de terceros — verificado. Lo único
que guarda en el navegador es el carrito, en `localStorage`. La obligación de pedir
consentimiento (LSSI-CE art. 22.2) cubre también el `localStorage`, no solo las cookies,
pero **exceptúa lo estrictamente necesario para un servicio pedido por el usuario**, y un
carrito de la compra es el ejemplo de manual de esa excepción.

Un banner ahora sería trabajo inútil, molestaría al visitante y no lo exige nadie.

**Cuándo sí hará falta:** en cuanto entre Google Analytics, un píxel de Meta, un
`<iframe>` de Instagram o YouTube, o cualquier tercero que ponga identificadores. Entonces
el banner tiene que cumplir el criterio de la AEPD: rechazar tan fácil como aceptar, nada
premarcado, y **no cargar nada hasta que acepten**. Ver la alternativa sin banner en §3.5.

Pendiente de verdad:

- [ ] **Aviso legal** (LSSI-CE art. 10): nombre, NIF, domicilio y contacto de quien vende.
      **Ojo, esto choca de frente con §4:** publicar NIF y domicilio es exactamente lo que
      se está evitando. Es una decisión para la gestoría, no para el código.
- [x] **Política de privacidad, condiciones de venta y desistimiento** escritas y enlazadas
      desde el pie. Redactadas sobre lo que la web hace de verdad, no sobre una plantilla:
      la de privacidad nombra la clave real del carrito y explica por qué no hay banner.
      **Les faltan 16 datos**, todos marcados en el texto como `[PENDIENTE: ...]`. El más
      urgente es **quién paga la devolución**: si no se dice antes de comprar, por ley lo
      paga la vendedora.
- [ ] Registro de actividades de tratamiento (versión simplificada para actividad pequeña).

> Nada de esto es asesoramiento legal. Son los puntos a llevar a la gestoría para que ella
> confirme cuáles aplican y en qué orden.

### Fase 3 — Seguridad

Conviene decirlo claro: **un sitio estático tiene muy poca superficie de ataque.** No hay
servidor, ni base de datos, ni usuarios, ni sesiones. La mayoría de agujeros clásicos
—inyección SQL, robo de sesión, subida de archivos— aquí no existen.

Lo que sí aplica, por orden de utilidad real:

- [ ] **2FA en GitHub y en Cloudflare.** Este es el riesgo de verdad: no que alguien
      "hackee la web", sino que entre en la cuenta y la cambie o la redirija. Es lo más
      importante de esta lista y no toca ni una línea de código.
- [ ] **Cabeceras de seguridad** en `public/_headers`, que ya existe para el cacheado.
      Añadir:
      ```
      /*
        X-Content-Type-Options: nosniff
        Referrer-Policy: strict-origin-when-cross-origin
        Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
        Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'self'; upgrade-insecure-requests
        Strict-Transport-Security: max-age=31536000; includeSubDomains
      ```
      **Probar la CSP antes de darla por buena**: si más adelante entra un tercero
      (analítica, un embed), hay que abrirle hueco ahí o dejará de cargar en silencio.
      `frame-ancestors 'none'` impide que metan la web dentro de un iframe ajeno, que es
      cómo se montan las suplantaciones.
- [ ] **Nunca meter claves en el repositorio.** Cuando llegue Stripe, las claves van en las
      variables de entorno de Cloudflare. El número de WhatsApp sí es público a propósito:
      es un contacto de negocio.
- [ ] **Actualizar dependencias cada pocos meses** (Astro, Tailwind). Riesgo bajo en un
      sitio estático, pero conviene no dejarlo pudrir. Dependabot lo hace solo.
- [ ] Si algún día hay formulario de contacto, protegerlo contra spam **sin** meter reCAPTCHA
      (que sí obliga a banner de cookies): un honeypot o Cloudflare Turnstile.

### Fase 4 — Que Sakina lo lleve sola

Era el requisito número uno y sigue pendiente. La base está: cada pieza es un archivo con
esquema tipado, que es justo lo que un CMS de formularios necesita.

- [x] **Configuración del CMS escrita** en `.pages.yml`: formularios para las piezas, los
      conjuntos, los textos de la web y los precios del configurador. Validada contra el
      esquema real de `content.config.ts` — ningún campo falta ni sobra.
- [ ] **Conectarlo**: cuenta de GitHub para Sakina, acceso al repositorio, y entrar en
      pagescms.org. Esa parte no se puede probar desde el entorno de trabajo, así que hay
      que comprobarla la primera vez con ella delante.
- [ ] Enseñarle el flujo: entra, cambia una foto o un precio, guarda, y en un minuto está
      online. Sin tocar código y sin pedírselo a nadie.
- [ ] Repasar que pueda hacer sola lo que hace a menudo: añadir pieza, marcar vendida,
      cambiar precio, cambiar el texto del taller, cambiar tarifas de envío.

### Fase 5 — Crecer

- [ ] **Analítica sin banner.** Cloudflare Web Analytics no usa cookies ni identifica al
      visitante, así que no dispara la obligación de consentimiento. Es la opción sensata
      aquí: se entera de qué piezas se miran sin ensuciar la web con un banner.
- [ ] **Datos estructurados** (JSON-LD `Product` con `Offer`) en las páginas de pieza, para
      que Google enseñe precio y disponibilidad en los resultados.
- [ ] **Estado "reservado"** manual, además de disponible/vendido. Dos personas pueden
      preguntar por la misma pieza el mismo día; con esto ella la aparta en dos toques.
- [ ] **Dominio propio** y, si quiere correo con el dominio, reenvío gratuito de Cloudflare
      a su Gmail (recibir es gratis; enviar desde esa dirección ya pide más).
- [ ] **Stripe**, solo cuando §4 esté resuelto. Se enchufa sin rehacer nada. En torno al
      1,5 % + 0,25 € por operación con tarjetas europeas.
- [x] **Auditoría de accesibilidad hecha** y aplicado lo medible: contraste del pie
      (4,16 → 5,25:1, verificado sobre píxeles), zonas de toque por encima de 24 px,
      anillo de foco sin recortar en la tira, y la tira ya no se mueve sin parar
      (WCAG 2.2.2). Pendientes tres decisiones de diseño, no fallos:
      el bloque de dirección no se ve en pantallas de 320 px sin desplazar mucho;
      el configurador deja añadir el mismo encargo dos veces sin avisar; y los filtros
      de color no dicen cuántas piezas quedan.
- [ ] El ASCII del logo (`src/assets/marca/ascii.jpg`) como comentario en el código fuente,
      si gusta la idea. Está sin usar.

---

## 4. El asunto que condiciona todo

**Sakina no está dada de alta como autónoma y de momento no quiere estarlo.**

En España, vender de forma continuada exige alta censal en Hacienda (modelo 036 o 037) e
IVA trimestral, aunque el importe sea pequeño. El alta en la Seguridad Social se exige
cuando la actividad es habitual; hay sentencias que han admitido no cotizar por debajo del
SMI, pero no es una exención oficial.

**Lo que define la actividad es vender de forma habitual, no el medio de cobro.** Quitar la
pasarela reduce el rastro documental, no cambia la obligación. Esa es la razón real de que
la web no cobre, y conviene tomar la decisión sabiéndolo, no creyendo que sin pasarela el
problema desaparece.

**Consulta con gestoría antes de publicar.** De ahí sale también qué se puede poner en el
aviso legal (§3.2).

---

## 5. Alojamiento

**Cloudflare Pages, plan gratuito.** Sin límite de tráfico, HTTPS y dominio propio
incluidos, y permite uso comercial. Se descartaron GitHub Pages (sus condiciones prohíben
montar un negocio online) y el plan gratis de Vercel (solo uso personal).

**Lo único que se paga es el dominio: 10-12 €/año.** Todo lo demás, cero. Se puede empezar
en un `.pages.dev` gratuito y enganchar el dominio después sin rehacer nada.

Configuración del despliegue:

- Build command: `npm run build` · Output: `dist` · Node fijado en `.nvmrc` (22)
- **No hace falta ninguna variable de entorno.** La URL del sitio sale de `CF_PAGES_URL`,
  que Cloudflare inyecta sola. Cuando haya dominio, se pone `SITE_URL` a mano y manda esa.
- De ahí salen las URL absolutas de las etiquetas Open Graph. Si apuntan a un dominio que
  no existe, **los enlaces de WhatsApp llegan sin miniatura**. Ya pasó y está corregido.

Probado como lo ejecuta Cloudflare: clon limpio, `npm ci`, `npm run build`.

---

## 6. Supuestos que hay que verificar

Cosas que decidí yo y pueden estar mal.

- **Los nombres, precios y medidas son de trabajo.** Vienen del boceto original y son
  inventados. A 62 € por 8-12 horas salen 5-7 €/hora antes de material: conviene rehacer
  los números con ella. La dirección editorial de la web aguanta precios bastante más
  altos.
- **El bolso rojo liso lo tomé por el reverso del rojo con flores** (misma forma, mismo
  tono, y en la foto de grupo solo hay un rojo). Si son dos piezas distintas, falta una.
- **El primer plano de punto gris con ribete blanco lo asigné a Cacao**, aunque ahí el
  color tira más a gris que a chocolate.
- **"Espiga" es un nombre que me inventé** para el bolso de hilo dorado, que no estaba en
  el catálogo original. Hay que cambiarlo.
- **"Sakina Studio" no está en la web.** Es otra marca, no otra versión de esta, y usar las
  dos haría que no se supiera quién vende. Si Studio es otra cosa (¿la parte de ropa?),
  decidir dónde va.

---

## 7. Decisiones tomadas, y por qué

- **Contenido en el repositorio, no en la nube.** Son 12 piezas: el contenido es diminuto,
  queda versionado y reversible, es gratis para siempre y se puede arreglar a mano. Sanity
  daría mejor experiencia en móvil pero mete una dependencia externa que no compensa a esta
  escala.
- **Carrito de verdad, elegido por el cliente** por encima de la recomendación del brief. No
  cobra: reúne el pedido y lo manda escrito por WhatsApp, así que no cambia la posición
  legal de §4.
- **Se usa `localStorage`, que el brief prohibía.** Con carrito y página propia por pieza,
  sin persistencia el pedido se vaciaría en cada clic. Aquella regla venía del entorno de
  artefactos de Claude, no de un requisito real. Degrada bien: si el navegador lo bloquea,
  el carrito sigue funcionando dentro de la página.
- **Los estados son manuales.** Nunca aparece "agotado" solo. Todo se confirma hablando.
- **Las piezas vendidas no se ocultan.** Son el portfolio.
- **Nada de crema + terracota + serif de alto contraste.** Es la paleta por defecto de toda
  la artesanía en internet, y se descartó a propósito.
- **El configurador enseña fotos de piezas reales**, no un dibujo vectorial. Un SVG con
  trama de puntos imitando ganchillo parecía un juguete al lado de la fotografía y era la
  parte más cara de mantener.
- **La portada no recorta siluetas.** El foco sobre la pieza señalada es luz, no una máscara
  que imite el contorno de un bolso.
- **Los logos llegaron en JPEG sobre crema.** El alfa está derivado de la luminancia del
  propio dibujo, no de un recorte de contorno, para conservar los pelos del pincel.

---

## 8. Notas del entorno de trabajo

Para no repetir callejones sin salida en sesiones futuras:

- **Las imágenes pegadas en el chat no llegan al disco.** Se ven, pero no dejan archivo, y
  no se pueden meter en el repositorio. Un SVG pegado **como texto** sí sirve.
- **`drive.google.com` está bloqueado** por la política de red de este entorno (403 en el
  proxy). El conector de Drive sí funcionó mientras estuvo conectado, pero se cae a menudo.
- **La vía fiable para pasar archivos:** subirlos por `github.com` desde el navegador (la
  app de GitHub no deja subir), a cualquier carpeta, y ya se colocan luego.
- Los cuatro logos originales tal como se subieron están en el historial, en el commit
  `b9fb663`.
