# Button — anotaciones en Figma

**Entregable alojado en otra plataforma.** Las anotaciones visuales del componente viven en Figma, no en esta carpeta. Este documento existe para que el proyecto quede completo y para que se puedan encontrar sin preguntar.

**Archivo:** `[Auditoria] - Later: Brand System` · **Página:** `↳ Button`
**Especificación de la que salen:** [`button.md`](./button.md) — la fuente de verdad, en esta misma carpeta.

---

## Las seis anotaciones

| Anotación | Qué documenta | Enlace |
| --- | --- | --- |
| **Anatomy** | Las partes del componente, numeradas sobre una instancia real | [`12701:2299`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12701-2299) |
| **API** | Las 10 propiedades, con tipo, valores, defaults y 4 ejemplos de configuración | [`12705:1716`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12705-1716) |
| **Properties** | Cada valor de cada eje, con previsualización en vivo | [`12709:2296`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12709-2296) |
| **Structure** | Medidas y espaciados por eje — 4 secciones, 42 filas | [`12716:1664`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12716-1664) |
| **Color** | Los tokens por variant y modo — 4 secciones, 180 celdas | [`12728:2634`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12728-2634) |
| **Screen reader** | VoiceOver, TalkBack y ARIA, estado por estado — 6 tablas, 46 filas | [`12744:2637`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12744-2637) |

**El componente documentado:** [`Button`, 60 variantes](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=3566-3197) · su hermano [`Link`, 15 variantes](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=80-19)

---

## Cómo leerlas

**La fuente de verdad es el `.md`, no los frames.** Las anotaciones se **generan** a partir de él: si algo se corrige en Figma a mano, el siguiente render lo pisa. Toda corrección empieza en `button.md`.

**No hay vínculo vivo.** Cambiar la especificación no actualiza los frames — hay que volver a correr las skills `create-*`. Por eso conviene mirar la fecha de generación que lleva el propio `.md` antes de fiarse de un frame.

## Estado

✅ **Re-renderizadas el 28 ago 2026**, en español y con las plantillas del brand system, desde la especificación regenerada el 27 ago. **Los IDs de arriba son los únicos vigentes.** Los seis frames del ciclo del 18 ago ya no existen, y este documento apuntó a nodos muertos hasta hoy.

⚠️ **En el canvas siguen seis frames `— solo-preview`** (`12507:2610`, `12518:2226`, `12528:2288`, `12533:2549`, `12539:2707`, `12691:2632`), a la izquierda y por encima de la fila de anotaciones. **Son del ciclo anterior y no son documentación vigente.** Se dejaron a propósito, pendientes de que el Lead decida si se borran.

**Lo que se conserva en inglés a propósito:** los encabezados de columna, los identificadores (`isDisabled`, `size`, `variant`) y los nombres de las propias anotaciones (*Screen reader*, *Notes*). La prosa es española; el vocabulario del sistema no se traduce.

🟢 **`Color` SÍ cubre el modo oscuro desde el 28 ago.** Es el cambio de más alcance de esta entrega. La sección `## Color` del `.md` se reorganizó el 27 ago: ya no son cuatro secciones `surface × variant` con celdas de dos valores `token (#Light · #Dark)`, sino **cuatro secciones `variant × modo`** —`primary / Light`, `primary / Dark`, `secondary / Light`, `secondary / Dark`— con un solo hex por celda. En Figma, cada sección fija el modo de la colección `semanticColors` de forma explícita (Light `3203:0`, Dark `3223:1`), así que **las previsualizaciones de las secciones Dark se ven en oscuro de verdad.**

⚠️ **Las otras cinco anotaciones siguen fijadas en Light.** `Anatomy`, `API`, `Properties`, `Structure` y `Screen reader` solo muestran el modo claro. Para el comportamiento en oscuro de cualquier cosa que no sea color, la fuente es el `.md`.

🟢 **El defecto de contraste de la plantilla `Screen reader` está CORREGIDO.** *Verificado contra Figma el 26 ago 2026 en el nodo `12214:6577`:* `#header-row` tiene fondo **`background/subtle` (#e9e9e9)** y texto **`text/secondaryInverseStatic` (negro)**. En el render del 28 ago sus `#header-row` miden **10,37:1**.

**La causa del defecto original, que sigue siendo doctrina útil:** se aplicó a `#header-row` la regla de `#header` **por parecido de nombre**. No son padre e hijo: `#header-row` no tiene fondo oscuro debajo, hereda el de `#state-table`. *Antes de aplicar una regla de color a una capa, hay que mirar qué hay debajo del nodo, no cómo se llama.*

**Contraste verificado en el render del 28 ago:** `Color` — 340 nodos TEXT, mínimo 4,50:1. `Screen reader` — 165 nodos TEXT, mínimo 4,09:1. **Cero por debajo de 3:1 en las dos.**

### Tres desviaciones deliberadas del boilerplate de las skills

Las tomó el render por coherencia entre las seis anotaciones. **Se registran aquí para que el Lead pueda revocarlas**, no porque estén cerradas.

| Dónde | Qué se hizo | Por qué |
| --- | --- | --- |
| `Color` | El título de tabla dice **«Tokens por estado»** en vez de repetir el nombre de la sección | La skill duplicaba el título de sección dentro de la tabla |
| `Screen reader` | `#compName` dice **`Button`**, sin el sufijo `Screen reader` que concatena la skill | Las otras cinco anotaciones dicen solo `Button` |
| `Screen reader` | En `isDisabled === true`, la columna `Focus order` dice **`—`** en vez de `1` | El `.md` documenta `focus stops: 0`: ese estado no es una parada de foco |

⚠️ **Una cuarta, de naturaleza distinta — y es deuda, no preferencia.** Los contenedores de preview de `Color` llevan el fondo ligado a `background/primary` **y además el color ya resuelto escrito como literal del paint**, porque Figma no renderizaba el paint por su binding y las secciones Dark salían con botones blancos sobre blanco. *El literal es un duplicado del token: si `background/primary` cambia, el fondo de esos previews no lo sigue y nadie se entera.* Queda anotado para revisar.

*Las anotaciones anteriores a esta entrega no existen: es la primera documentación completa del componente.*
