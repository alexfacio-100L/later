# Descripciones de `semanticColors` — para aplicar en Figma

> **Qué es esto.** Las descripciones propuestas para los tokens de la colección `semanticColors`, redactadas el 14 ago 2026 resolviendo cada token en los modes `Light` y `Dark`.
>
> **El criterio, ya decidido:** *la descripción no dice qué es el token, dice **cuándo usarlo**.* El valor ya está a la vista. Formato: **cuándo usarlo · cuándo no · con qué se confunde.**
>
> **De 95 tokens, se documentan 56.** Los otros 39 no, porque su nombre o su valor van a cambiar — y **la descripción viaja a Supernova y de ahí a código, así que explicar un defecto lo convierte en doctrina.**
>
> *Fuente: Supernova MCP, `sn_get_token_detail` con themes `light`/`dark`, sobre el último import. Ver `DECISIONS.md`, 14 ago 2026.*

---

## `text/` — 13 tokens

| Token | Light | Dark | Descripción |
| --- | --- | --- | --- |
| `text/primary` | `#000000` | `#FFFFFF` | Color de texto por defecto para cuerpo y títulos sobre las superficies del tema. Es el que usas si no tienes una razón para usar otro. Si el texto va sobre una superficie que no invierte con el tema —un overlay sobre imagen, un banner oscuro fijo— usa `text/primaryInverseStatic`. |
| `text/tertiary` | `#404040` | `#DADADA` | Texto de apoyo: captions, metadatos, ayuda bajo un campo. Tercer nivel de jerarquía. No lo uses para un control inactivo — eso es `text/disabled`, que además comunica que no se puede interactuar. |
| `text/primaryInverse` | `#F9F9F9` | `#000000` | Texto principal sobre superficies que llevan el color opuesto al tema: un botón `background/mono`, un tooltip, una barra invertida. Invierte con el tema. Si la superficie **no** invierte, usa `text/primaryInverseStatic`. |
| `text/secondaryInverse` | `#E9E9E9` | `#202020` | Segundo nivel de jerarquía sobre superficies invertidas — subtítulo dentro de un tooltip o de una barra oscura. Es el hermano de `text/secondary` para fondo invertido. |
| `text/tertiaryInverse` | `#DADADA` | `#404040` | Texto de apoyo sobre superficies invertidas: metadatos dentro de un panel oscuro. Tercer nivel. No lo uses para deshabilitado. |
| `text/selected` | `#041B3D` | `#B2D1FF` | Texto de un elemento en estado seleccionado: ítem de lista activo, pestaña activa, opción marcada. Va emparejado con `background/selected` y `border/selected`. No lo uses para hover ni para foco — el foco se expresa con `border/focus`. |
| `text/disabled` | `#A6A6A6` | `#606060` | Texto de un control que existe pero no se puede usar. Comunica *no disponible*, no *menos importante*: para jerarquía usa `text/tertiary`. No cumple contraste AA a propósito, así que nunca lo uses para información que el usuario necesite leer. |
| `text/brand` | `#041B3D` | `#FFFFFF` | Texto que representa a la marca en sí: wordmark escrito, firma, encabezado de marca. No lo uses para texto normal aunque el azul te guste — para eso está `text/primary`. |
| `text/info` | `#1C64EB` | igual | Texto de un mensaje informativo neutro: nota, aviso sin urgencia, ayuda contextual. No cambia con el tema. Si el texto es navegable usa `text/link`, que comparte el color pero significa otra cosa. |
| `text/link` | `#1C64EB` | igual | Texto de un enlace navegable en reposo. Reservado a lo que **navega**; una acción que ejecuta algo es un botón, no un link. Comparte valor con `text/info`, que informa pero no es clicable. |
| `text/linkHover` | `#114FC4` | igual | Color del enlace mientras el cursor está encima. Solo para hover: el estado presionado es `text/linkPressed` y el reposo `text/link`. |
| `text/warning` | `#965F05` | igual | Texto de una advertencia: algo requiere atención pero no ha fallado. Es la versión legible sobre fondo claro; para el mismo mensaje sobre un fondo naranja usa `text/warningSubtle`. Si algo sí falló, es `text/negative`. |
| `text/primaryInverseStatic` | `#F9F9F9` | igual | Texto claro que **no** cambia con el tema. Úsalo sobre superficies que se ven igual en claro y oscuro: overlays sobre imagen, banners de campaña, `background/inverseStatic`. Si la superficie sí invierte con el tema, usa `text/primaryInverse`. |

---

## `background/` — 20 tokens

| Token | Light | Dark | Descripción |
| --- | --- | --- | --- |
| `background/primary` | `#F4F7FB` | `#000000` | Fondo de la página o del lienzo: la capa más al fondo. Los contenedores que van encima llevan `background/secondary`. Si necesitas una superficie que no invierta con el tema, usa `background/inverseStatic`. |
| `background/secondary` | `#FFFFFF` | `#202020` | Fondo de las superficies que se elevan sobre la página: cards, modales, paneles, inputs. Es el contenedor por defecto. No lo uses para el lienzo — eso es `background/primary`. |
| `background/neutral` | `#DADADA` | `#808080` | Fondo de un control sin carga semántica: botón secundario, chip neutro, badge de conteo. Sus estados son `background/neutralHover` y `background/neutralPressed`. No lo uses para deshabilitado — eso es `background/disabled`. |
| `background/neutralHover` | `#CCCCCC` | `#9F9F9F` | El estado hover de un control `background/neutral`. Solo para hover; el clic sostenido es `background/neutralPressed`. |
| `background/neutralPressed` | `#BFBFBF` | `#BFBFBF` | El estado presionado de un control `background/neutral`, mientras el clic está sostenido. No lo uses para *seleccionado*, que persiste después de soltar: eso es `background/selected`. |
| `background/selected` | `#315FA3` | igual | Fondo de un elemento en estado seleccionado que persiste: ítem de lista activo, pestaña activa, fila marcada. Va con `text/selected` y `border/selected`. No cambia con el tema. Distinto de `background/pressed`, que solo dura mientras el dedo está encima. |
| `background/inverse` | `#000000` | `#FFFFFF` | Fondo que lleva el color opuesto al tema: tooltip, snackbar, barra de contraste. **Sí invierte con el tema** — en Dark se vuelve claro. Si la superficie debe verse igual en ambos temas, usa `background/inverseStatic`. |
| `background/disabled` | `#DADADA` | `#B2B2B2` | Fondo de un control que existe pero no se puede usar. Va con `text/disabled` y `border/disabled`. No lo uses para un control neutro activo — eso es `background/neutral`. |
| `background/brandHover` | `#1C488A` | igual | Estado hover de una superficie `background/brandMain`. No cambia con el tema. Solo para hover; el clic sostenido es `background/brandPressed`. |
| `background/brandPressed` | `#133970` | igual | Estado presionado de una superficie `background/brandMain`, mientras el clic está sostenido. |
| `background/brandSubtle` | `#B2D1FF` | igual | Fondo de baja intensidad para destacar sin gritar: badge de marca, banda de aviso institucional, fondo de sección. No cambia con el tema, así que verifica el contraste del texto que pongas encima en Dark. |
| `background/info` | `#1C64EB` | igual | Fondo saturado de un mensaje informativo: banner, badge, indicador. Lleva texto claro encima. Para la versión de baja intensidad usa `background/infoSubtle`. |
| `background/infoSubtle` | `#E1E9F4` | `#0F2C57` | Fondo de baja intensidad para un mensaje informativo: alert inline, callout. Invierte con el tema, a diferencia de sus hermanos `warningSubtle` y `brandSubtle`. Lleva `text/info` encima, no texto blanco. |
| `background/warning` | `#E59206` | igual | Fondo saturado de una advertencia: banner, badge, indicador de riesgo. Para la versión de baja intensidad usa `background/warningSubtle`. Si algo sí falló, es `background/negative`. |
| `background/warningSubtle` | `#FCC15E` | igual | Fondo de baja intensidad para una advertencia: alert inline, callout. No cambia con el tema. Lleva `text/warning` encima. |
| `background/negative` | `#D40707` | igual | Fondo saturado de un error o una acción destructiva: banner de fallo, botón de borrar. Sus estados son `background/negativeHover` y `background/negativePressed`. Si el mensaje solo advierte, usa `background/warning`. |
| `background/negativeHover` | `#AC0505` | igual | Estado hover de una superficie `background/negative`. |
| `background/negativePressed` | `#9B0505` | igual | Estado presionado de una superficie `background/negative`, mientras el clic está sostenido. |
| `background/positive` | `#2A8A53` | igual | Fondo saturado de una confirmación: banner de éxito, badge de estado correcto. Lleva texto claro encima. No lo uses para acciones — el color de éxito confirma, no invita a pulsar. |
| `background/inverseStatic` | `#202020` | igual | Fondo oscuro que **no** cambia con el tema. Úsalo en superficies que deben verse igual en claro y oscuro: overlays sobre imagen, banners de campaña, tarjetas de marca. Si el fondo sí debe invertir con el tema, usa `background/inverse`. |

---

## `icon/` — 10 tokens

| Token | Light | Dark | Descripción |
| --- | --- | --- | --- |
| `icon/primary` | `#000000` | `#FFFFFF` | Color por defecto de un icono sobre las superficies del tema. Es el que usas si el icono no comunica estado ni jerarquía. Sobre superficies invertidas usa `icon/inverse`; sobre superficies que no invierten, `icon/inverseStatic`. |
| `icon/inverse` | `#FFFFFF` | `#000000` | Icono sobre superficies que llevan el color opuesto al tema: tooltip, snackbar, botón `background/mono`. Invierte con el tema. Si la superficie no invierte, usa `icon/inverseStatic`. |
| `icon/selected` | `#1C64EB` | igual | Icono de un elemento en estado seleccionado: pestaña activa, ítem de navegación actual. Va con `text/selected` y `border/selected`. Comparte valor con `icon/info`, que no implica selección. |
| `icon/disabled` | `#A6A6A6` | `#606060` | Icono de un control que existe pero no se puede usar. Comunica *no disponible*, no *decorativo*. Si el icono es puramente ornamental y el control sí funciona, usa `icon/primary`. |
| `icon/brand` | `#041B3D` | `#FFFFFF` | Icono que forma parte de la identidad: isotipo, marca de dominio 100L, sello institucional. No lo uses para iconos de interfaz aunque el azul te guste — para eso está `icon/primary`. |
| `icon/info` | `#1C64EB` | igual | Icono de un mensaje informativo: la "i" de un callout, el icono de un alert neutro. Comparte valor con `icon/selected`, que en cambio marca estado. |
| `icon/warning` | `#E59206` | igual | Icono de advertencia: triángulo de atención, indicador de riesgo. Si algo sí falló, usa `icon/negative`. |
| `icon/negative` | `#D40707` | igual | Icono de error o de acción destructiva: cruz de fallo, bote de basura en un flujo de borrado. Si solo advierte, usa `icon/warning`. |
| `icon/positive` | `#2A8A53` | igual | Icono de confirmación: palomita de éxito, indicador de estado correcto. No lo uses en iconos de acción — el verde confirma un resultado, no invita a pulsar. |
| `icon/inverseStatic` | `#F9F9F9` | igual | Icono claro que **no** cambia con el tema. Úsalo sobre superficies que se ven igual en claro y oscuro: overlays sobre imagen, `background/inverseStatic`, banners de campaña. Si la superficie sí invierte, usa `icon/inverse`. |

---

## `border/` — 7 tokens

| Token | Light | Dark | Descripción |
| --- | --- | --- | --- |
| `border/primary` | `#DADADA` | `#404040` | Borde por defecto de contenedores y controles: card, input en reposo, divisor. Es el que usas si el borde no comunica estado. Para un borde apenas perceptible usa `border/subtle`. |
| `border/focus` | `#1C64EB` | igual | Anillo de foco de teclado. **No es opcional ni decorativo: es requisito WCAG** y debe verse en todo control interactivo. No lo confundas con `border/selected`, que comparte el valor pero marca elección persistente, no posición del teclado. |
| `border/selected` | `#1C64EB` | igual | Borde de un elemento en estado seleccionado: card elegida, pestaña activa, opción marcada. Va con `background/selected` y `text/selected`. Comparte valor con `border/focus` — si ambos aplican, el foco debe seguir siendo visible. |
| `border/disabled` | `#B2B2B2` | `#606060` | Borde de un control que existe pero no se puede usar. Va con `background/disabled` y `text/disabled`. |
| `border/info` | `#1C64EB` | igual | Borde de un contenedor informativo: alert inline, callout neutro. Va con `background/infoSubtle`. Comparte valor con `border/focus` y `border/selected` — no lo uses en controles interactivos o el usuario leerá foco donde no lo hay. |
| `border/warning` | `#E59206` | igual | Borde de un contenedor de advertencia, o de un input que requiere atención sin haber fallado. Si el campo sí es inválido, usa `border/negative`. |
| `border/negative` | `#D40707` | igual | Borde de un campo inválido o de un contenedor de error. **El color no puede ser la única señal**: acompáñalo siempre de `text/negative` con el mensaje. Si solo advierte, usa `border/warning`. |

---

## `overlay/` — 6 tokens

> **Los seis con sufijo `Static` NO se documentan: son duplicados exactos y se borran.** Ver más abajo.

| Token | Valor | Descripción |
| --- | --- | --- |
| `overlay/10` | `#FFFFFF / 10%` | Velo blanco muy tenue sobre contenido oscuro: hover sobre una superficie `background/mono` o `inverseStatic`, o un realce apenas perceptible sobre imagen. Sobre contenido claro no se ve — ahí usa `overlay/inverse10`. Es un valor crudo a propósito: Figma no permite aliasar color con opacidad modificada. |
| `overlay/30` | `#FFFFFF / 30%` | Velo blanco medio sobre contenido oscuro: estado presionado sobre superficies invertidas, o atenuación de una imagen para que el texto encima se lea. Sobre contenido claro usa `overlay/inverse30`. |
| `overlay/70` | `#FFFFFF / 70%` | Velo blanco fuerte sobre contenido oscuro: el contenido de abajo queda apenas visible. Para el scrim de un modal sobre la app en Light usa `overlay/inverse70`, que oscurece en vez de aclarar. |
| `overlay/inverse10` | `#000000 / 10%` | Velo negro muy tenue sobre contenido claro: hover sobre una card, realce sutil sobre una superficie del tema. Sobre contenido oscuro no se ve — ahí usa `overlay/10`. Valor crudo a propósito. |
| `overlay/inverse30` | `#000000 / 30%` | Velo negro medio sobre contenido claro: estado presionado, o atenuación de una imagen para que el texto encima se lea. |
| `overlay/inverse70` | `#000000 / 70%` | Velo negro fuerte: es el scrim de un modal o un drawer, el que apaga la app detrás. Para aclarar en vez de oscurecer usa `overlay/70`. |

---

# Los 39 que NO se documentan, y por qué

**Documentar un token cuyo nombre o valor va a cambiar no solo tira el trabajo: la descripción viaja a Supernova y de ahí a código, y explicar un defecto lo convierte en doctrina.**

## A · Nombre condenado a renombre

| Token | Por qué esperar |
| --- | --- |
| `background/brandRed` | **Pasa a `background/accent`** — decidido por el Lead. El color va en el nombre (1.5) |
| `icon/subtle` | **Pasa a `icon/accent`.** Es el rojo de marca a plena saturación cuando `subtle` significa baja intensidad en todo el resto del sistema |
| `text/offer` · `background/offer` · `icon/offer` | **Pasan a la familia `accent`.** `offer` es vocabulario de negocio para algo que se usa como color |
| `text/secundaryInverseStatic` | Typo vivo (1.4). **Y su valor contradice al hermano:** `primaryInverseStatic` es claro (`#F9F9F9`), este es negro. No son dos niveles de la misma familia — son dos direcciones opuestas con el mismo apellido |

## B · Valor condenado a cambiar (1.8, escalas incoherentes)

| Token | El defecto |
| --- | --- |
| `background/positiveSubtle` · `text/positiveSubtle` · `icon/positiveSubtle` · `border/positiveSubtle` | `subtle` apunta a `green/400`, **más saturado** que su base `green/600` |
| `text/warningSubtle` | `subtle` es `orange/500`, **más saturado** que su base `orange/900`. Mismo defecto, no registrado hasta el 14 ago |
| `text/linkPressed` | **Aclara** al presionar mientras `linkHover` **oscurece**. Dirección de estado invertida sin regla declarada |

## C · Los seis `overlay/*Static` — se borran

`overlay/10Static` · `overlay/30Static` · `overlay/70Static` · `overlay/inverse10Static` · `overlay/inverse30Static` · `overlay/inverse70Static`

**Son duplicados exactos de sus hermanos sin sufijo, en ambos temas.** Ningún `overlay/*` puede cambiar con el tema —color + alpha es literal en Figma—, así que **el sufijo `Static` no distingue nada** y enseña mal la convención justo donde más confunde. Entran en la pasada de borrado de 1.10/1.11.

## D · No invierten con el tema y no lo declaran

Estos no cambian entre `Light` y `Dark` aunque su nombre no dice `Static`. **O es defecto o falta declarar la regla** — en ambos casos la descripción sería mentira hoy.

| Token | El problema |
| --- | --- |
| `background/subtle` | Gris claro en modo oscuro, contra `background/infoSubtle` que sí invierte |
| `border/secondary` | Borde blanco puro en Dark |
| `border/subtle` | No invierte, y en Light **es idéntico a `border/primary`** |
| `border/inverse` | Un token llamado `inverse` que **no invierte**, con el mismo valor que `border/subtle` |
| `border/brand` | Azul marino sobre fondo negro en Dark. `text/brand` e `icon/brand` **sí** invierten: la familia `brand` es inconsistente entre capas |
| `background/pressed` | Aqua en Light, gris neutro en Dark. No es el mismo concepto en los dos temas |
| `background/hover` | En Light **es idéntico a `background/primary`**: el hover es invisible sobre el lienzo |

## E · Inversiones que parecen error de cableado

| Token | El problema |
| --- | --- |
| `text/secondary` | Azul marino en Light → **rojo de marca** en Dark. Un nivel de jerarquía que se convierte en acento |
| `text/negative` | En Dark sale de **`Orange acento`**, no de la escala `red`. Y en Light **es idéntico a `text/negativeHover`** |
| `text/placeholder` · `icon/placeholder` | **Blanco puro en Dark** — el placeholder queda con más contraste que el texto real |
| `background/neutralPressed` | Mismo hex en ambos temas pero **apuntando a primitivos distintos** |

## F · Propósito no deducible del nombre

**El hallazgo es del nombre, no de quien lo leyó.**

| Token | Qué no se deduce |
| --- | --- |
| `background/systemStatic` | ¿"System" de qué? Único con ese prefijo, sin familia |
| `background/tabBackground` | **Token de componente en la capa semántica**, y repite "background" dentro del grupo `background/` |
| `background/mono` · `monoHover` · `monoPressed` | Presumiblemente *monocromático* —botón negro fijo tipo "Sign in with…"— pero el nombre no lo dice |

## G · Decisión del Lead pendiente

| Token | Estado |
| --- | --- |
| `background/brandMain` | En Dark se vuelve **blanco puro**. El Lead confirma: *"fue de emergencia sin probar bien"*. **Es deuda, no intención** — se define bien antes de documentarlo |
