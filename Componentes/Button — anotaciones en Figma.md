# Button — anotaciones en Figma

**Entregable alojado en otra plataforma.** Las anotaciones visuales del componente viven en Figma, no en esta carpeta. Este documento existe para que el proyecto quede completo y para que se puedan encontrar sin preguntar.

**Archivo:** `[Auditoria] - Later: Brand System` · **Página:** `↳ Button`
**Especificación de la que salen:** [`button.md`](./button.md) — la fuente de verdad, en esta misma carpeta.

---

## Las seis anotaciones

| Anotación | Qué documenta | Enlace |
| --- | --- | --- |
| **Anatomy** | Las partes del componente, numeradas sobre una instancia real | [`12290:10522`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12290-10522) |
| **API** | Las 10 propiedades, con tipo, valores, defaults y 3 ejemplos de configuración | [`12292:10564`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12292-10564) |
| **Properties** | Cada valor de cada eje, con previsualización en vivo — 28 instancias | [`12301:2020`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12301-2020) |
| **Structure** | Medidas, espaciados y su comportamiento por eje — 37 filas y 20 cotas dibujadas | [`12304:2187`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12304-2187) |
| **Color** | Los tokens por superficie, tipo y estado — 100 celdas | [`12311:2189`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12311-2189) |
| **Screen reader** | Comportamiento en VoiceOver, TalkBack y ARIA, estado por estado — 12 tablas, 93 filas | [`12318:2192`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12318-2192) |

**El componente documentado:** [`Button`, 60 variantes](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=3566-3197) · su hermano [`Link`, 15 variantes](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=80-19)

---

## Cómo leerlas

**La fuente de verdad es el `.md`, no los frames.** Las anotaciones se **generan** a partir de él: si algo se corrige en Figma a mano, el siguiente render lo pisa. Toda corrección empieza en `button.md`.

**No hay vínculo vivo.** Cambiar la especificación no actualiza los frames — hay que volver a correr las skills `create-*`. Por eso conviene mirar la fecha de generación que lleva el propio `.md` antes de fiarse de un frame.

## Estado

✅ **Re-renderizadas el 18 ago 2026, en español y con las plantillas del brand system.** Las seis salieron de la especificación ya traducida, así que frames y `.md` dicen lo mismo. Los frames en inglés del 17 ago fueron borrados: los IDs de arriba son los únicos vigentes.

**Lo que se conserva en inglés a propósito:** los encabezados de columna, los identificadores (`isDisabled`, `size`, `variant`) y los nombres de las propias anotaciones (*Screen reader*, *Notes*). La prosa es española; el vocabulario del sistema no se traduce.

🟢 **El defecto de contraste de la plantilla `Screen reader` está CORREGIDO.** *Verificado contra Figma el 26 ago 2026 en el nodo `12214:6577`:* `#header-row` tiene fondo **`background/subtle` (#e9e9e9)** y texto **`text/secondaryInverseStatic` (negro)**. Se lee sin problema.

⚠️ **Este párrafo decía lo contrario hasta el 26 de agosto**, y contradecía a `ENCARGOS-DE-RENDER.md`, que registraba la corrección el 18 ago. *La contradicción llegó a costar trabajo: un dictamen la leyó, la dio por vigente, y estuvo a punto de hacer que se tocara el componente maestro de la librería para arreglar algo que ya estaba bien.*

**La causa del defecto original, que sigue siendo doctrina útil:** se aplicó a `#header-row` la regla de `#header` **por parecido de nombre**. No son padre e hijo: `#header-row` no tiene fondo oscuro debajo, hereda el de `#state-table`. *Antes de aplicar una regla de color a una capa, hay que mirar qué hay debajo del nodo, no cómo se llama.*

⚠️ **Ninguna anotación cubre el modo oscuro.** Las previsualizaciones están fijadas en Light por una limitación del pipeline. La especificación **sí** trae los dos valores de cada token (`#Light · #Dark`), así que **para color en oscuro hay que ir al `.md`, no a Figma.**

*Las anotaciones anteriores a esta entrega no existen: es la primera documentación completa del componente.*
