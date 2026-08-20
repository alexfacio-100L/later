# Button

<!-- Generado desde _base.json extraído el 2026-08-20T19:08 · Figma: https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=3566-3197 -->

## Overview

El Button es el control de acción del sistema: **ejecuta, no navega**. Lo que navega es un `Link`, que nació al separar el antiguo valor `tertiary`.

**Ejes de variante.** `variant`, `surface`, `size` y `state`, que se descompone en la API. Son 60 variantes en Figma; la API expone 9 propiedades.

> **Nota sobre el idioma.** La prosa está en español; **los encabezados de sección, los nombres de columna y los identificadores están en inglés a propósito**. Los nombres de propiedad y de token deben coincidir con el código.

### Composition

- **content** — decorative · se pliega en Structure y Color
- **labelBox** — decorative · se pliega en Structure y Color
- **iconLeft** — referenced · se documenta como componente referenciado, no se re-especifica

## Anatomy

Los elementos que componen el Button, en el orden en que los numera el preview. **La numeración es un contrato: los marcadores del frame y las filas de esta tabla son la misma lista.**

| # | Type | Element | Notes |
| --- | --- | --- | --- |
| 1 | Frame | Button | Contenedor raíz. Fondo tokenizado, radio 8 y sombra; fija el padding por `size` y la separación entre elementos. |
| 2 | Instance | iconLeft | Icono opcional antes del texto. Instancia de `ArrowRight` (Phosphor). Lo revela `showIconLeft`; oculto por defecto. |
| 3 | Text | labelBox | El texto de la acción. Siempre visible — es el único elemento obligatorio. |
| 4 | Instance | iconRight | Icono opcional después del texto. Instancia de `ArrowRight` (Phosphor). Lo revela `showIconRight`; oculto por defecto. |

**El preview muestra la variante por defecto** —`size=s, surface=product, variant=primary, state=default`— con ambos iconos revelados, para que los cuatro elementos sean visibles a la vez. En uso real los iconos son opcionales e independientes.

## Known gaps

### Unresolved

- **Alta** 🔴 — **`size` no escala la tipografía.** Los tres tamaños usan fuente 14: `size` solo cambia el padding. Antes del 20 de agosto lo único que diferenciaba `l` de `m` eran 2px fuera de escala; al alinearlos a la escala, la diferencia desapareció y se restauró con la progresión de padding. **Es un hueco abierto, no una decisión de diseño.**
- **Media** — **`background/disabled` apenas se distingue del lienzo en Light**: 1.30:1 sobre `background/primary`. El texto sí es legible (4.50:1), pero el contorno del control se pierde.
- **Media** — el icono de carga sigue sin decidirse. `isLoading` es propiedad de código sin variante en Figma.
- **Baja** — structure: Sin figmaLink: no se pudo verificar en vivo si el radio crudo (8/12) y el trazo de focus (1.5 en s/m, 2 en l) tienen binding a variables no resueltas  *(no verificable: se extrajo sin `figmaLink`)*
- **Baja** — color: Verificar en canvas los fills resueltos en mode Dark; se derivaron de los alias de semanticColors en _base.json *(no verificable: se extrajo sin `figmaLink`)*
- **Baja** — voice: Confirmar bindings de visibilidad de iconLeft / iconRight y ejes de la instancia preferida del icono directamente en Figma. *(no verificable: se extrajo sin `figmaLink`)*

## Follow-ups

- **`ArrowRight`** es un componente referenciado y su especificación es propia: `./arrow-right.md`.
- Los `#preview` publicados en Supernova corresponden a una corrida anterior y **muestran el componente antes de estas correcciones**.

## API

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `label` | string | string | `Button` | Texto visible. Un boton siempre lleva label: el boton de solo icono no forma parte de este componente. |
| `variant` | enum | primary, secondary | `primary` | Jerarquia visual. Eje en Figma: `variant`. Se renombro desde `Type` porque `type` esta reservado en HTML para el tipo de boton. El antiguo `tertiary` paso a ser el componente Link y `quaternary` se elimino. |
| `surface` | enum | marketing, product | `product` | En que superficie vive el boton, no su jerarquia. `product` cubre app, login y modales; `marketing` cubre landings y campanas. Determina el peso tipografico. |
| `size` | enum | s, m, l | `s` | Controla el padding: s 8/16, m 12/16, l 16/24, con alturas 37, 45 y 53. Todo dentro de la escala space. NO cambia el tamano de fuente: ver Known gaps. |
| `isDisabled` | boolean | true, false | `false` | Estado persistente. Bloquea la interaccion y saca el control del orden de tabulacion. Descompuesto del eje `state` de Figma. |
| `showIconLeft` | boolean | true, false | `false` | Muestra la ranura del icono inicial. Independiente de showIconRight. |
| ↳ `iconLeft` | instance-swap | (instance) | `ArrowRight` | Solo tiene sentido cuando `showIconLeft` = `true`. Acepta cualquier icono de la libreria Phosphor. |
| `showIconRight` | boolean | true, false | `false` | Muestra la ranura del icono final. Independiente de showIconLeft. |
| ↳ `iconRight` | instance-swap | (instance) | `ArrowRight` | Solo tiene sentido cuando `showIconRight` = `true`. Acepta cualquier icono de la libreria Phosphor. |

> Los estados de interaccion -hover, pressed, focus- los dibuja la plataforma y no se configuran por API. El eje `state` de Figma existe para los disenadores.

> El unico estado que fija un ingeniero es `isDisabled`.

> `showIconLeft` y `showIconRight` son independientes: el boton puede mostrar ninguno, uno u otro, o los dos.

### State axis mapping

El eje `state` de Figma se descompone: solo `disabled` llega a la API.

| Figma | API | Runtime condition |
|---|---|---|
| `default` | `isDisabled` = `false` | enabled |
| `disabled` | `isDisabled` = `true` | isDisabled === true |
| `hover` | `isDisabled` = `false` | hovered (lo dibuja la plataforma) |
| `focus` | `isDisabled` = `false` | focused (lo dibuja la plataforma) |
| `pressed` | `isDisabled` = `false` | pressed (lo dibuja la plataforma) |

### Referenced components

- **ArrowRight** — ranura `iconLeft / iconRight` · configuración `Format=Outline, Weight=Fill` · nodo `12376:86676`
  Icono por defecto de ambas ranuras. Pertenece a la libreria Phosphor; su especificacion es propia. Spec: `./arrow-right.md`

### Accion principal

| Property | Value | Notes |
|---|---|---|
| `variant` | `primary` | La accion mas importante de la pantalla |
| `size` | `s` | Variante por defecto en Figma |
| `label` | `Continuar` | Verbo en infinitivo |

### Secundario con icono final

| Property | Value | Notes |
|---|---|---|
| `variant` | `secondary` | Accion de apoyo |
| `showIconRight` | `true` | Revela la ranura final |
| `iconRight` | `ArrowRight` | Sugiere avance |

### Deshabilitado

| Property | Value | Notes |
|---|---|---|
| `isDisabled` | `true` | Bloquea el clic y sale del orden de tabulacion |
| `label` | `Guardar` | El texto se mantiene legible: 4.50:1 en Light, 4.89 en Dark |

## Structure

**Jerarquía de capas:** root → content → [iconLeft, labelBox → label, iconRight]. *Los elementos y su función están en `## Anatomy`; aquí solo se documentan sus medidas.* No hay sub-componentes constitutivos ni slots con contenido preferido: iconLeft e iconRight son instancias referenced (set ArrowRight, Phosphor) y aquí figuran solo por referencia y tamaño; su estructura interna vive en su propia spec. · Espaciado: los paddings están tokenizados al 100% en las 60 variantes, con la progresión corregida el 20 ago 2026 (s: 8/16 · m: 12/16 · l: 16/24, dentro de la escala space 8·12·16·24). Las alturas resultantes son 37, 45 y 53, todas por debajo del mínimo táctil de 44 de WCAG 2.5.8, lo que obliga a resolver el área táctil fuera del componente. · El gap del contenedor raíz es space/zero (0): la separación real entre icono y label la produce el horizontalPadding de labelBox (space/s (8)), constante en los tres tamaños. · HUECO ABIERTO (no es una decisión de diseño): size NO escala la tipografía. Los tres tamaños usan el mismo estilo de texto de 14/21. Tras la corrección del 20 ago, lo único que diferencia l de m es el padding; entre m y s solo cambia el padding vertical. Queda pendiente decidir si la tipografía debe escalar o si el sistema asume un único tamaño de texto. · Anomalías detectadas: (1) cornerRadius es la única familia dimensional sin token —valores crudos 8 y 12— y además depende de dos ejes a la vez (size y surface); (2) labelBox lleva cornerRadius 12 sin pintar relleno ni borde, radio sin efecto visual; (3) el grosor del trazo en focus no es consistente por tamaño: 1.5 en s y m pero 2 en l, y ninguno de los dos valores pertenece a una escala declarada; (4) la instancia de icono embebida trae Weight=Fill mientras el defecto declarado de la librería es Weight=Regular. · Cobertura: cero filas not-measured; los dos FRAME auditables (content y labelBox) tienen todas sus familias no-cero documentadas.

### Button sizes

Propiedades dimensionales a lo largo del eje size, medidas en surface=product, variant=primary, state=default. Los paddings están tokenizados al 100% en las 60 variantes; el radio es el único valor crudo que queda.

| Spec | L | M | S | Notes |
|---|---|---|---|---|
| Container | – | – | – | Raíz del componente: auto-layout horizontal, centrado en ambos ejes. |
| ├ verticalPadding | space/l (16) | space/m (12) | space/s (8) | Progresión corregida el 20 ago 2026: 16/12/8, toda dentro de la escala space. Es el único par que escala con size. |
| ├ horizontalPadding | space/xl (24) | space/l (16) | space/l (16) | m y s comparten space/l (16); solo l sube a space/xl (24). Antes había 18 y 10 crudos, fuera de escala. |
| ├ itemSpacing | space/zero (0) | space/zero (0) | space/zero (0) | El gap real entre icono y label no vive aquí: lo produce el horizontalPadding de labelBox (8). |
| ├ cornerRadius | 12 | 8 | 8 | Valor crudo, sin token: es la única familia dimensional sin tokenizar. También depende de surface (ver Button surface). |
| ├ widthMode | hug | hug | hug | Ancho gobernado por el contenido; no hay minWidth ni maxWidth definidos. |
| └ heightMode | hug | hug | hug | Altura derivada del padding vertical más la línea de 21: resulta 53 / 45 / 37. Ninguna llega a 44, el mínimo táctil de WCAG 2.5.8. |
| Content | – | – | – | Wrapper de layout que agrupa iconLeft, labelBox e iconRight. |
| ├ padding | 0 | 0 | 0 | Sin inset propio: el respiro lo pone el contenedor raíz. |
| └ itemSpacing | 0 | 0 | 0 | Sin gap propio; la separación la aporta el padding de labelBox. |
| Label box | – | – | – | Caja que envuelve al texto y define su separación de los iconos. |
| ├ verticalPadding | 0 | 0 | 0 | Cero deliberado: la altura de la caja la fija la línea del texto (21). |
| ├ horizontalPadding | space/s (8) | space/s (8) | space/s (8) | Constante en los tres tamaños. Es el gap efectivo icono↔label, y no escala con size. |
| └ cornerRadius | 12 | 12 | 12 | Anomalía: labelBox no pinta relleno ni borde, así que este radio no tiene efecto visual. Candidato a limpieza. |
| Label | – | – | – | Nodo de texto del botón; su contenido lo aporta la propiedad label. |
| └ textStyle | Text/M - Poppins/Regular | Text/M - Poppins/Regular | Text/M - Poppins/Regular | HUECO ABIERTO: size no escala la tipografía. Los tres tamaños usan el mismo estilo (14/21, letterSpacing 0.2). No es una decisión documentada. |
| Icon left | – | – | – | Instancia opcional, gobernada por showIconLeft (default false). |
| ├ iconName | ArrowRight | ArrowRight | ArrowRight | Set de Phosphor. La instancia embebida trae Weight=Fill, no el Weight=Regular declarado como defecto: divergencia a revisar. |
| └ iconSize | 20 | 16 | 16 | Único elemento además del padding que reacciona a size: 20 en l, 16 en m y s. |
| Icon right | – | – | – | Instancia opcional, gobernada por showIconRight (default false). |
| ├ iconName | ArrowRight | ArrowRight | ArrowRight | Mismo set y mismo defecto que iconLeft; el par es simétrico. |
| └ iconSize | 20 | 16 | 16 | Idéntico a iconLeft en los tres tamaños. |

### Button surface

Eje property-variant: surface no cambia los hijos ni el espaciado, pero sí el radio y el estilo de texto. Medido en size=s, variant=primary, state=default.

| Spec | Marketing | Product | Notes |
|---|---|---|---|
| cornerRadius | 12 | 8 | Medido en size=s. marketing mantiene 12 en los tres tamaños; product usa 8 en s y m y 12 en l. Ninguno está tokenizado. |
| textStyle | Text/M - Poppins/Semi Bold | Text/M - Poppins/Regular | surface cambia el peso del texto: Semi Bold para marketing, Regular para product. El tamaño (14) no cambia. |

### Button states

Eje state: ninguna medida cambia salvo el grosor del trazo en focus. Padding, radio, altura y tipografía son idénticos en los cinco estados. Medido en size=s, surface=product, variant=primary.

| Spec | enabled | isDisabled === true | focused (lo dibuja la plataforma) | hovered (lo dibuja la plataforma) | pressed (lo dibuja la plataforma) | Notes |
|---|---|---|---|---|---|---|
| borderWidth | 1 | 1 | 1.5 | 1 | 1 | Solo focus altera el grosor. En primary el trazo únicamente se pinta en focus; en secondary se pinta en los cinco estados. |
| borderAlign | inside | inside | inside | inside | inside | Trazo hacia dentro en todos los estados: engrosar el foco no altera la caja externa. |

## Color

Los colores se resuelven por el mode de la colección semanticColors (Light y Dark); los nombres de token son idénticos en ambos modes y solo cambia el alias primitivo al que apuntan. background/brandHover y background/brandPressed aclaran en Light y oscurecen en Dark: la dirección la marca el fondo, no el mode. El estado disabled se corrigió el 20 de agosto — text/disabled pasó a neutral/600 en Light y neutral/700 en Dark, y el contraste sobre background/disabled subió de 1.74:1 a 4.50 (Light) y 4.89 (Dark). Sigue abierto que background/disabled apenas se distingue del lienzo en Light (1.30:1). En Dark, brandHover resuelve a neutral/300 (#BFBFBF) y brandPressed a neutral/200 (#DFDFDF), así que pressed queda más claro que hover sobre un fondo neutral/100: la progresión de énfasis se invierte. Se documenta tal cual está en Figma; conviene revisarlo. El eje size no cambia ningún token de color, solo el escalón de la rampa de sombra: s y m usan sm-1 en surface=product y sm-2 en surface=marketing, mientras que l usa sm-2 y sm-3 respectivamente; las secciones documentan size=s. El eje surface sí afecta la sombra — en product solo hay elevación en default y disabled, en marketing la hay en los cinco estados — por eso tiene sección propia pese a que crossVariant.axisClassification lo marca como color-irrelevant (la huella de ejes no cubre effect styles). iconLeft e iconRight son slots que alojan una instancia hoja de icono (ArrowRight por defecto, Phosphor Outline/Regular): el color lo decide el botón, por eso sus tokens viven en esta tabla. Las sombras (Shadows/Single/Small/sm-1–3) son effect styles con color fijo #0E1F35 al 12% de opacidad, no variables — no cambian con el mode.

*Estrategia B · 8 combinaciones · estados: `default`, `hover`, `pressed`, `focus`, `disabled`*

### Primary / Product / Light

| Element | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| Container fill | `background/brandMain` | `background/brandHover` | `background/brandPressed` | `background/brandHover` | `background/disabled` |
| Container stroke | `none` | `none` | `none` | `border/focus` | `none` |
| Drop shadow | `Shadows/Single/Small/sm-1` | `none` | `none` | `none` | `Shadows/Single/Small/sm-1` |
| iconLeft | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/disabled` |
| Label | `text/primaryInverse` | `text/primaryInverse` | `text/primaryInverse` | `text/primaryInverse` | `text/disabled` |
| iconRight | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/disabled` |

### Primary / Product / Dark

| Element | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| Container fill | `background/brandMain` | `background/brandHover` | `background/brandPressed` | `background/brandHover` | `background/disabled` |
| Container stroke | `none` | `none` | `none` | `border/focus` | `none` |
| Drop shadow | `Shadows/Single/Small/sm-1` | `none` | `none` | `none` | `Shadows/Single/Small/sm-1` |
| iconLeft | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/disabled` |
| Label | `text/primaryInverse` | `text/primaryInverse` | `text/primaryInverse` | `text/primaryInverse` | `text/disabled` |
| iconRight | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/disabled` |

### Primary / Marketing / Light

| Element | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| Container fill | `background/brandMain` | `background/brandHover` | `background/brandPressed` | `background/brandHover` | `background/disabled` |
| Container stroke | `none` | `none` | `none` | `border/focus` | `none` |
| Drop shadow | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` |
| iconLeft | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/disabled` |
| Label | `text/primaryInverse` | `text/primaryInverse` | `text/primaryInverse` | `text/primaryInverse` | `text/disabled` |
| iconRight | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/disabled` |

### Primary / Marketing / Dark

| Element | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| Container fill | `background/brandMain` | `background/brandHover` | `background/brandPressed` | `background/brandHover` | `background/disabled` |
| Container stroke | `none` | `none` | `none` | `border/focus` | `none` |
| Drop shadow | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` |
| iconLeft | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/disabled` |
| Label | `text/primaryInverse` | `text/primaryInverse` | `text/primaryInverse` | `text/primaryInverse` | `text/disabled` |
| iconRight | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/inverse` | `icon/disabled` |

### Secondary / Product / Light

| Element | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| Container fill | `background/secondary` | `background/hover` | `background/selected` | `background/hover` | `background/disabled` |
| Container stroke | `text/secondary` | `text/secondary` | `text/secondary` | `border/focus` | `border/disabled` |
| Drop shadow | `Shadows/Single/Small/sm-1` | `none` | `none` | `none` | `Shadows/Single/Small/sm-1` |
| iconLeft | `text/secondary` | `text/secondary` | `text/secondary` | `text/secondary` | `icon/disabled` |
| Label | `text/secondary` | `text/secondary` | `text/primaryInverse` | `text/secondary` | `text/disabled` |
| iconRight | `text/secondary` | `text/secondary` | `text/secondary` | `text/secondary` | `icon/disabled` |

### Secondary / Product / Dark

| Element | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| Container fill | `background/secondary` | `background/hover` | `background/selected` | `background/hover` | `background/disabled` |
| Container stroke | `text/secondary` | `text/secondary` | `text/secondary` | `border/focus` | `border/disabled` |
| Drop shadow | `Shadows/Single/Small/sm-1` | `none` | `none` | `none` | `Shadows/Single/Small/sm-1` |
| iconLeft | `text/secondary` | `text/secondary` | `text/secondary` | `text/secondary` | `icon/disabled` |
| Label | `text/secondary` | `text/secondary` | `text/primaryInverse` | `text/secondary` | `text/disabled` |
| iconRight | `text/secondary` | `text/secondary` | `text/secondary` | `text/secondary` | `icon/disabled` |

### Secondary / Marketing / Light

| Element | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| Container fill | `background/secondary` | `background/hover` | `background/selected` | `background/hover` | `background/disabled` |
| Container stroke | `text/secondary` | `text/secondary` | `text/secondary` | `border/focus` | `border/disabled` |
| Drop shadow | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` |
| iconLeft | `text/secondary` | `text/secondary` | `text/secondary` | `text/secondary` | `icon/disabled` |
| Label | `text/secondary` | `text/secondary` | `text/primaryInverse` | `text/secondary` | `text/disabled` |
| iconRight | `text/secondary` | `text/secondary` | `text/secondary` | `text/secondary` | `icon/disabled` |

### Secondary / Marketing / Dark

| Element | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| Container fill | `background/secondary` | `background/hover` | `background/selected` | `background/hover` | `background/disabled` |
| Container stroke | `text/secondary` | `text/secondary` | `text/secondary` | `border/focus` | `border/disabled` |
| Drop shadow | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` | `Shadows/Single/Small/sm-2` |
| iconLeft | `text/secondary` | `text/secondary` | `text/secondary` | `text/secondary` | `icon/disabled` |
| Label | `text/secondary` | `text/secondary` | `text/primaryInverse` | `text/secondary` | `text/disabled` |
| iconRight | `text/secondary` | `text/secondary` | `text/secondary` | `text/secondary` | `icon/disabled` |

## Voice / Screen reader

- Button es un componente simple: un unico focus stop. labelBox se fusiona como nombre accesible y iconLeft / iconRight son decorativos, asi que no se documenta seccion "Focus order".
- `label` es obligatorio y es el nombre accesible del control. Sin label el boton se anuncia vacio; nunca sustituirlo por el icono.
- El unico estado que fija un ingeniero es `isDisabled`. hover, focus y pressed los dibuja la plataforma: no se declaran en la capa de accesibilidad y no cambian el anuncio, por eso se agrupan con enabled.
- Estado disabled: el componente sale del orden de foco (0 focus stops) y expone .notEnabled (iOS) / disabled() (Android) / disabled (Web). El texto deshabilitado se corrigio el 20 ago 2026 y ahora cumple contraste: 4.50:1 en Light y 4.89:1 en Dark.
- Hueco abierto de contraste: background/disabled apenas se distingue del lienzo en Light (1.30:1). Es un riesgo de percepcion visual, no de lector de pantalla, pero afecta a usuarios con baja vision.
- Los iconos son Phosphor (Format=Outline, Weight=Regular; ArrowRight por defecto) y son decorativos: accessibilityElementsHidden=true / contentDescription=null / aria-hidden="true". Si el icono aporta significado que el label no dice, el arreglo es corregir el label, no anunciar el icono.
- Los ejes size, surface y variant son puramente visuales: no cambian rol, nombre ni anuncio en ninguna plataforma.
- Mecanismos de fusion por plataforma: iOS usa accessibilityElement(children: .combine); Android usa semantics(mergeDescendants = true); Web fusiona de forma implicita por contenido de texto dentro de <button>.
- Estabilidad del orden de foco: no reordenar el foco entre estados. Button mantiene el indice 1 en todos los estados enfocables y cae a 0 stops solo en disabled.
- Longitud del anuncio: no meter el hint, el valor y el estado dentro del nombre accesible; cada uno tiene su propiedad dedicada.
- Paridad entre plataformas: las tres plataformas fusionan igual y exponen el mismo unico stop; no hay divergencia de merge que documentar.

### State: enabled

Agrupa los estados de Figma default, hover, focus y pressed: los tres ultimos los dibuja la plataforma y tienen semantica de lector de pantalla identica (mismo focus stop, mismo rol, mismo anuncio).

#### VoiceOver (iOS)

**Announcement:** "Button, button"

| Property | Value | Notes |
|---|---|---|
| `accessibilityLabel` | "Button" | Nombre accesible del control; sale del texto de `label` en labelBox y es obligatorio — sin label el botón se anuncia vacío. |
| `accessibilityValue` | – | El botón no tiene valor; el estado va en traits, nunca en value. |
| `accessibilityTraits` | .isButton | Rol del control; hace que VoiceOver diga "button" despues del label. |
| `accessibilityHint` | – | Solo se agrega cuando la consecuencia de activar no es obvia a partir del label. |
| `accessibilityElement(children:)` | .combine | Fusiona labelBox e iconos en un unico elemento: el usuario aterriza una sola vez. |
| `accessibilityAddTraits (interaccion)` | – | hover / focus / pressed los dibuja la plataforma; no se declaran como traits ni cambian el anuncio. |
| `Do NOT` | No leer el label dos veces | Do not read the label twice. The label merges into the stop's name; the platform must not expose the label node (labelBox) as a separate focusable element. |
| `Do NOT` | No anunciar iconLeft / iconRight | Do not announce the decorative icon. Mark it accessibilityElementsHidden=true; iconLeft/iconRight are Phosphor glyphs that duplicate the label's meaning. |

#### TalkBack (Android)

**Announcement:** "Button, button, double-tap to activate"

| Property | Value | Notes |
|---|---|---|
| `contentDescription` | "Button" | Etiqueta hablada; viene de `label`. No incluir la palabra "boton": TalkBack agrega el rol. |
| `role` | Role.Button | Rol semantico dentro del bloque semantics { }. |
| `stateDescription` | – | Sin estado que anunciar mientras isDisabled sea false. |
| `semantics(mergeDescendants = true)` | true | Agrupa labelBox e iconos en un solo nodo de accesibilidad. |
| `onClick` | definido | Expone la accion; TalkBack anade "double-tap to activate". |
| `Do NOT` | No exponer labelBox como nodo aparte | Do not read the label twice. The label merges into the stop's contentDescription via mergeDescendants; labelBox must not be an independent accessibility node. |
| `Do NOT` | No anunciar iconLeft / iconRight | Do not announce the decorative icon. Set contentDescription=null / importantForAccessibility=no on iconLeft and iconRight. |

#### ARIA (Web)

**Announcement:** "Button, button"

| Property | Value | Notes |
|---|---|---|
| `element` | <button type="button"> | HTML nativo antes que role="button": trae foco, teclado y rol sin ARIA. |
| `textContent` | "Button" | Nombre accesible por contenido de texto; es el valor de `label`. |
| `role` | button (implicito) | No declarar role="button" sobre un <button>: es redundante. |
| `aria-label` | – | Solo cuando no hay texto visible. Aqui el texto visible gana. |
| `tabindex` | 0 (implicito) | El boton nativo ya esta en el orden de tabulacion; no forzar tabindex. |
| `teclado` | Enter, Space | Ambas teclas deben activar el control (comportamiento nativo del <button>). |
| `Do NOT` | No duplicar el texto con aria-label | Do not read the label twice. The visible text content is already the accessible name; adding aria-label on top overrides and duplicates it. |
| `Do NOT` | No anunciar iconLeft / iconRight | Do not announce the decorative icon. Mark the SVG aria-hidden="true" and focusable="false". |

### State: isDisabled === true

Estado disabled (state=disabled en Figma, isDisabled=true en la API). El componente queda inerte y sale del orden de foco: 0 focus stops.

#### VoiceOver (iOS)

**Announcement:** "Button, dimmed, button"

| Property | Value | Notes |
|---|---|---|
| `focus stops` | 0 | Estado inerte: el componente sale del orden de foco; el artwork no lleva marcadores. |
| `accessibilityLabel` | "Button" | El nombre se conserva para que el usuario entienda que control esta desactivado. |
| `accessibilityTraits` | [.isButton, .notEnabled] | .notEnabled hace que VoiceOver lo lea como "dimmed". |
| `isAccessibilityElement` | false (al salir del orden de foco) | Si el control debe seguir siendo descubrible, dejarlo en true pero con .notEnabled. |
| `contraste del texto` | 4.50:1 (Light) · 4.89:1 (Dark) | text/disabled se corrigio el 20 ago 2026: el label deshabilitado ya es legible. |
| `Do NOT` | No dejarlo enfocable estando disabled | Do not keep the stop focusable when disabled — remove it from the focus order and set the .notEnabled trait instead of only graying the fill. |

#### TalkBack (Android)

**Announcement:** "Button, button, disabled"

| Property | Value | Notes |
|---|---|---|
| `focus stops` | 0 | Estado inerte: no se recorre con swipe ni entra en la traversal order. |
| `contentDescription` | "Button" | Se conserva la etiqueta; TalkBack agrega el sufijo "disabled". |
| `role` | Role.Button | Mismo rol que en enabled: la consistencia de rol entre estados es obligatoria. |
| `disabled()` | aplicado | Marca el nodo como no interactivo dentro del bloque semantics { }. |
| `onClick` | no definido | Sin accion no hay "double-tap to activate". |
| `Do NOT` | No dejarlo enfocable estando disabled | Do not keep the stop focusable when disabled — apply disabled() in the semantics block and drop enabled=false nodes out of traversal. |

#### ARIA (Web)

**Announcement:** "Button, button, dimmed"

| Property | Value | Notes |
|---|---|---|
| `element` | <button type="button" disabled> | El atributo nativo disabled lo saca del orden de tabulacion y expone el estado. |
| `aria-disabled` | true (solo si se usa el patron enfocable) | Alternativa cuando el control debe seguir siendo descubrible por lector de pantalla. |
| `role` | button (implicito) | Se mantiene el mismo elemento nativo en todos los estados. |
| `textContent` | "Button" | El nombre accesible no cambia al deshabilitar. |
| `tabindex` | no aplica (disabled) | No agregar tabindex="0" a un boton deshabilitado. |
| `Do NOT` | No dejarlo enfocable estando disabled | Do not keep the stop focusable when disabled — use the native disabled attribute (or aria-disabled=true plus tabindex=-1 when the control must stay discoverable). |

## Cross-references

- `Link` — el antiguo `variant=tertiary`. Un enlace navega; un botón actúa.
- `ArrowRight` — icono por defecto de ambas ranuras. Librería Phosphor.
- Tokens de color: colección `semanticColors`, modes Light y Dark.

## Provenance

- **Extraído:** 2026-08-20T19:08 · plugin uSpec Extract
- **Generado:** 2026-08-20 15:02
- **Figma:** `UGwIBzERV4vB7mk0mejZ0y` nodo `3566:3197`
- **Variantes analizadas:** 60
- **Desacuerdos con el diccionario de API:** 0 en los tres especialistas.

<!-- render-meta:start v=1 -->
<!-- Machine-readable appendix consumed by downstream `create-*` skills.
     Carries node IDs so renderers can resolve sections/groups → live Figma layers
     without re-extracting. Schema: see references/component-md/agent-component-md-instruction.md > ## RENDER_META_JSON.
     Do NOT hand-edit; regenerated on every `create-component-md` run. -->
```json
{
  "schemaVersion": "1.0",
  "extractedAt": "2026-08-20T19:08:25.287Z",
  "sourceHash": "sha256:a3e09452a496eb7c25d13df0d73939d48cae730c8225207efc665acee646b27a",
  "fileKey": "UGwIBzERV4vB7mk0mejZ0y",
  "nodeId": "3566:3197",
  "component": {
    "componentName": "Button",
    "compSetNodeId": "3566:3197",
    "isComponentSet": true
  },
  "variantAxes": {
    "size": [
      "l",
      "m",
      "s"
    ],
    "surface": [
      "marketing",
      "product"
    ],
    "variant": [
      "primary",
      "secondary"
    ],
    "state": [
      "default",
      "disabled",
      "focus",
      "hover",
      "pressed"
    ]
  },
  "variantAxesDefaults": {
    "size": "s",
    "surface": "product",
    "variant": "primary",
    "state": "default"
  },
  "propertyDefs": {
    "label#3566:7": {
      "type": "TEXT",
      "defaultValue": "Button",
      "variantOptions": null,
      "description": null
    },
    "showIconLeft#12227:0": {
      "type": "BOOLEAN",
      "defaultValue": false,
      "variantOptions": null,
      "description": null
    },
    "showIconRight#12227:61": {
      "type": "BOOLEAN",
      "defaultValue": false,
      "variantOptions": null,
      "description": null
    },
    "iconLeft#12227:122": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "12376:86685",
      "variantOptions": null,
      "description": null
    },
    "iconRight#12227:183": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "12376:86685",
      "variantOptions": null,
      "description": null
    },
    "size": {
      "type": "VARIANT",
      "defaultValue": "s",
      "variantOptions": [
        "l",
        "m",
        "s"
      ],
      "description": null
    },
    "surface": {
      "type": "VARIANT",
      "defaultValue": "product",
      "variantOptions": [
        "marketing",
        "product"
      ],
      "description": null
    },
    "variant": {
      "type": "VARIANT",
      "defaultValue": "primary",
      "variantOptions": [
        "primary",
        "secondary"
      ],
      "description": null
    },
    "state": {
      "type": "VARIANT",
      "defaultValue": "default",
      "variantOptions": [
        "default",
        "disabled",
        "focus",
        "hover",
        "pressed"
      ],
      "description": null
    }
  },
  "booleanDefs": [
    {
      "key": "showIconLeft#12227:0",
      "default": false,
      "associatedLayerName": "iconLeft",
      "associatedLayerId": "3534:1316"
    },
    {
      "key": "showIconRight#12227:61",
      "default": false,
      "associatedLayerName": "iconRight",
      "associatedLayerId": "3534:1319"
    }
  ],
  "subComponents": [],
  "slotContents": [],
  "sectionTargets": {
    "Button sizes": {
      "name": "__root__",
      "nodeId": "3566:3196"
    },
    "Button surface": {
      "name": "__root__",
      "nodeId": "3566:3196"
    },
    "Button states": {
      "name": "__root__",
      "nodeId": "3566:3196"
    }
  },
  "groupTargets": {
    "Button sizes": {
      "Container": {
        "name": "__root__",
        "nodeId": "3566:3196"
      },
      "Content": {
        "name": "content",
        "nodeId": "3475:862"
      },
      "Label box": {
        "name": "labelBox",
        "nodeId": "3475:861"
      },
      "Label": {
        "name": "label",
        "nodeId": "3475:860"
      },
      "Icon left": {
        "name": "iconLeft",
        "nodeId": "3534:1316"
      },
      "Icon right": {
        "name": "iconRight",
        "nodeId": "3534:1319"
      }
    },
    "Button surface": {},
    "Button states": {}
  }
}
```
<!-- render-meta:end -->
