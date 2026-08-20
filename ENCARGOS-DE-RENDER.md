# Encargos de render — plantilla reutilizable

**Para qué sirve.** Cada skill `create-*` necesita las mismas instrucciones para funcionar en este entorno. Reconstruirlas de memoria en cada render cuesta tiempo y se olvidan trampas ya resueltas. Aquí están listas.

**Cómo se usa.** Copiar el bloque común + el bloque de la skill que toque, y lanzarlo como encargo a un agente. **Una skill a la vez: se solapan si corren en paralelo.**

---

## Bloque común — va en todos los encargos

```text
Follow the skill at "…/2. Proyecto/uSpec/.claude/skills/create-<SKILL>/SKILL.md".

PATHS:
- uSpec root (uspecs.config.json): "…/Later: Brand System/2. Proyecto/uSpec"
- componentMdPath: "…/Later: Brand System/3. Entregables/Componentes/<slug>.md"
- There is NO .uspec-cache (regenerable, not migrated). Work from the .md alone —
  it ends with a render-meta JSON block carrying every node id.
- fileKey: UGwIBzERV4vB7mk0mejZ0y · mcpProvider: figma-mcp
  (pass skillNames: "resource:figma-use" on EVERY use_figma call)

THREE VERIFIED ENVIRONMENT FACTS — do not rediscover them:
1. `figma.importComponentByKeyAsync` DOES NOT WORK. The seven uSpec templates are
   LOCAL, UNPUBLISHED components on page "_Local Componentes" in the same file.
   Find the local COMPONENT whose `key` equals the templateKey in uspecs.config.json
   (match by key, NOT by name), instance it, detach it, then move the detached frame
   to the target page in a SEPARATE use_figma call (one setCurrentPageAsync per script).
   NOTE: since 18 ago the seven are named with a leading dot (`.Anatomy`, `.Motion`…)
   so Figma keeps them out of the published library. The dot does NOT change the `key`,
   so matching by key works unchanged. Never match by name.
2. `counterAxisSizingMode: 'FILL'` is rejected in this sandbox — use `layoutAlign = 'STRETCH'`.
3. Cloned template cells keep `WIDTH_AND_HEIGHT` and overflow their column — after
   populating, set `textAutoResize = 'HEIGHT'` + `layoutSizingHorizontal = 'FILL'`
   on the cell text nodes.

BRAND STYLING — the templates are bound to design-system variables and text styles.
Two rules, both verified on the 18 ago renders:
- Set ONLY `characters` on text nodes. Do NOT assign fills, strokes, fontName or
  fontSize — let the template's own bindings stand. If the skill script assigns a
  colour or font, skip that assignment.
- If the script hardcodes a colour for annotation graphics (markers, leader lines,
  dashed outlines), DO NOT use the literal. Read the paint from the closest
  brand-bound template node and reuse that paint array, so the graphics inherit the
  variable too. (Proven in Anatomy: its hardcoded pink marker colour was replaced by
  reading `#marker-example`'s own bound fill.)

LANGUAGE — two rules:
(a) Copy the .md content VERBATIM. Its prose is Spanish and its headings, column names
    and identifiers are English ON PURPOSE — the skills parse them literally.
    Do not translate in either direction.
(b) AS A FINAL STEP, translate into Spanish the skill's own hardcoded boilerplate
    (section titles and helper sentences the script writes itself, which never come
    from the .md). Leave the template's table column headers in English.

Report back ONE short paragraph: new frame node id, confirmation the old frame was
deleted, whether the text came out in Spanish, which boilerplate strings you translated,
and anything you could not complete. Do not paste frame contents.
```

---

## Los cuatro que faltan del Button

Página destino en todos: `↳ Button` (id `80:19`). **Borrar primero el frame en inglés** y renderizar en su sitio.

| Skill | Plantilla local | Frame a reemplazar | Posición |
| --- | --- | --- | --- |
| `create-property` | `.Property` · `12214:6624` | `Button Properties` · `12236:11098` | x 5606, y −716 |
| `create-structure` | `.Structure` · `12214:6590` | `Button Structure` · `12242:1646` | x 7800, y −716 |
| `create-color` | `.Color Annotation` · `12214:6768` | `Button Color` · `12249:1648` | x 10000, y −716 |
| `create-voice` | `.Screen reader` · `12214:6551` | `Button Screen reader` · `12258:2172` | x 12200, y −716 |

**Las seis reconstruidas con la plantilla brandeada, en español (18 ago):**
`Anatomy` `12290:10522` · `API` `12292:10564` · `Properties` `12301:2020` · `Structure` `12304:2187` · `Color` `12311:2189` · `Screen reader` `12318:2192`
Los seis frames en inglés del 17 ago fueron borrados.

### Contexto que conviene pasar a cada una

**`create-property`** — ejes: `Size` (L/M/S), `Surface` (Marketing/Product), `Type` (Primary/Secondary), `State` (5). En la API son `size`, `surface`, `variant` (renombrado desde `Type`) y, para `State`, descompuesto en `isDisabled` / `isLoading`. Más dos booleanos y dos instance-swap.

**`create-structure`** — el `.md` trae *Type deltas* y tres secciones dimensionales: *Button sizes* (30 filas), *Button surface shape* (3) y *Button focus ring* (3). El render-meta lleva los `sectionTargets` y `groupTargets` de las tres.

**`create-color`** — Strategy B: cuatro secciones, una por combinación `Surface`×`Type`, con las columnas ya relabeladas a condiciones de ejecución. ⚠️ **Las celdas ahora traen dos valores: `token (#Light · #Dark)`.** Copiarlos tal cual — es la única forma en que el modo oscuro aparece en la documentación.

**`create-voice`** — 4 estados × 3 plataformas, una sola parada de foco. El `.md` lleva un comentario oculto `<!-- voice-render-meta v=1 … -->` con los nombres de capa de las paradas. ⚠️ **Dentro del Button hay dos nodos llamados `Button`** —la raíz y el TEXT del label—: `findStopNode` busca solo descendientes y marca el texto. Preferir la raíz cuando `root.name === stop.name`.

---

## Estado de la personalización

**18 ago 2026 — las siete plantillas usan el brand system.** 158 valores ligados a variables, cero colores crudos salvo los conservados a propósito.

| Rol | Variable |
| --- | --- |
| `#header` (y `Title` en `Motion`) | `background/brandMain` · texto encima en **`text/primaryInverse`**, no `Static`: `brandMain` invierte con el mode y el texto debe acompañarlo |
| `#marker-example` | `background/accent` |
| `#preview` y placeholders | `background/primary` |
| Tablas de anotación | `background/secondary` + borde `border/primary` |
| Filas de encabezado (Motion) | `background/subtle` |
| Títulos de sección | `text/primary` |
| **Descripciones y `{marcadores}`** | **`text/tertiary`** |
| Encabezados de columna y `{number}` | `text/primary` |
| Vectores | `icon/primary` (stroke) |

**Tipografía:** `Heading/4XL/Semi Bold` (56) · `Heading/XL/Semi Bold` (32) · `Text/L - Nunito Sans/Bold` y `/Regular` (16).
⚠️ **`fontFamily` en `uspecs.config.json` sigue siendo `Inter`** — es lo que las skills usan al escribir texto nuevo, y coincide con lo que quedó sin estilo a propósito. Si algún día se cambia la tipografía del texto que escriben las skills, hay que actualizarlo ahí.

**Conservado sin tocar en `Motion`:** `#0A5DB3` (bezier), `#10723A` (linear) y `#6852CB` (hold) — **la simbología de las curvas de easing**. No tienen equivalente en el sistema y su color *es* su significado.

⚠️ **`#434343` estaba en esta lista por error:** no es simbología, es la regla de tiempo. Corregido — `#tick` → `border/primary`, `#tick-value` → `text/tertiary`.

**Conservado en las siete:** `#BF4D45` y `#FF7B71`, los dos rojos del **logotipo** que el Lead añadió el 18 ago. Es una instancia del componente de marca: su color es su identidad y **no se liga a tokens**. El logo no tocó banderas ni estructura.

---

### ⚠️ Las banderas `#` son direcciones, no una taxonomía

**Tres fallos el 18 ago, todos por personalizar mirando el nombre de la capa en vez de lo que hay debajo:**

| Caso | Qué pasó |
| --- | --- |
| `#header-row` (Screen reader) | Recibió la regla de `#header` por parecido de prefijo. **No son padre e hijo**: `#header-row` hereda el `background/secondary` de `#state-table`, no un fondo oscuro. Texto claro sobre claro. |
| `Title` (Motion) | **El banner de `Motion` no se llama `#header`.** Su capa `#header` es un encabezado de sección anidado en `Content`. El banner real quedó en `background/systemStatic` — negro. |
| Seis textos en `Static` | `#component-name`, `#component-description`, `#composition-meta` (Motion) y `Element`, `State`, `Notes` (Color Annotation) quedaron en `text/primaryInverseStatic` sobre fondo blanco. Invisibles. |

**Antes de aplicar una regla de color a una capa, comprobar el fondo efectivo** —el primer ancestro con relleno sólido— **y su tamaño.** Un nombre parecido no implica un rol parecido, y un rol puede no tener bandera.

**Verificación que conviene correr al final de cualquier personalización:** recorrer todos los TEXT, resolver su fondo efectivo y listar los que queden por debajo de 3:1. Las siete plantillas están hoy en **cero**.

### ⚠️ `#header` y `#header-row` NO son padre e hijo

**Las banderas `#` no forman una jerarquía semántica: son roles distintos que comparten prefijo.** Al personalizar el 18 ago se aplicó a `#header-row` la regla de `#header` —texto en `text/primaryInverseStatic`— por parecido de nombre. Pero `#header-row` **no tiene fondo oscuro debajo**: hereda el `background/secondary` de `#state-table`. Resultado: texto claro sobre fondo claro, ilegible, en cada tabla de toda anotación de voz.

**Corregido** en la plantilla `Screen reader` (`12214:6551`) y en el frame ya renderizado: fondo `background/subtle` + texto `text/primary`, que es la regla ya fijada para filas de encabezado.

**La lección para futuras personalizaciones: mirar qué hay debajo del nodo, no cómo se llama.** Un fallo así no da error — solo se descubre cuando alguien intenta leer el resultado.

## Las plantillas están ocultas de la librería

**Desde el 18 ago las siete llevan un punto por delante** —`.Anatomy`, `.API`, `.Property`, `.Structure`, `.Color Annotation`, `.Screen reader`, `.Motion`—. Es el mecanismo de Figma para componentes privados: **no aparecen en la librería publicada.**

**Verificado antes de aplicarlo: el punto no cambia la `key`.** Se renombró `Motion` a `.Motion` y su key siguió siendo `60bf0b6a…400f`, y el componente se localizó igual con el valor del config. Como el pipeline **busca por `key` y nunca por nombre**, el cambio es transparente.

⚠️ **Dónde sí rompería el punto:** un componente privado no se puede importar por key **desde otro archivo**, porque no está publicado. Eso invalida el camino oficial de uSpec —el de la librería publicada—, que es precisamente el que aquí no funciona y que sustituye el fallback local. **Si algún día se decide publicar las plantillas (tarea 2.6), hay que quitar el punto primero.**

## Personalizar las plantillas: qué es seguro

**Seguro:** colores y rellenos. Las skills localizan por `key` de componente, y repintar no la cambia. *Verificado el 18 ago 2026.*

**Rompe el render:**

- **Renombrar capas.** Las 31 banderas `#` (`#main-api-table`, `#property-name`, `#preview`…) son cómo la skill encuentra dónde escribir.
- **Tocar los `{marcadores}`** — `{property}`, `{value}`, `{notes}`, `{component-name}`. **Parecen etiquetas y son huecos de sustitución.**
- **Cambiar la estructura** o la jerarquía de frames.

**Requiere un cambio extra:** la **tipografía**. Si se cambia en la plantilla, hay que actualizar `fontFamily` en `uspecs.config.json` — las skills usan ese valor al escribir texto nuevo, así que si no coinciden, **la plantilla sale con una fuente y el contenido con otra**, sin error que lo avise.
