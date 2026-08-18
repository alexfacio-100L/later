# Button — anotaciones en Figma

**Entregable alojado en otra plataforma.** Las anotaciones visuales del componente viven en Figma, no en esta carpeta. Este documento existe para que el proyecto quede completo y para que se puedan encontrar sin preguntar.

**Archivo:** `[Auditoria] - Later: Brand System` · **Página:** `↳ Button`
**Especificación de la que salen:** [`button.md`](./button.md) — la fuente de verdad, en esta misma carpeta.

---

## Las seis anotaciones

| Anotación | Qué documenta | Enlace |
| --- | --- | --- |
| **Anatomy** | Las partes del componente, numeradas sobre una instancia real | [`12232:1737`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12232-1737) |
| **API** | Las 10 propiedades, con tipo, valores, defaults y 3 ejemplos de configuración | [`12235:1698`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12235-1698) |
| **Properties** | Cada valor de cada eje, con previsualización en vivo — 28 instancias | [`12236:11098`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12236-11098) |
| **Structure** | Medidas, espaciados y su comportamiento por eje — 37 filas y 20 cotas dibujadas | [`12242:1646`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12242-1646) |
| **Color** | Los tokens por superficie, tipo y estado — 100 celdas | [`12249:1648`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12249-1648) |
| **Screen reader** | Comportamiento en VoiceOver, TalkBack y ARIA, estado por estado | [`12258:2172`](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=12258-2172) |

**El componente documentado:** [`Button`, 60 variantes](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=3566-3197) · su hermano [`Link`, 15 variantes](https://www.figma.com/design/UGwIBzERV4vB7mk0mejZ0y/?node-id=80-19)

---

## Cómo leerlas

**La fuente de verdad es el `.md`, no los frames.** Las anotaciones se **generan** a partir de él: si algo se corrige en Figma a mano, el siguiente render lo pisa. Toda corrección empieza en `button.md`.

**No hay vínculo vivo.** Cambiar la especificación no actualiza los frames — hay que volver a correr las skills `create-*`. Por eso conviene mirar la fecha de generación que lleva el propio `.md` antes de fiarse de un frame.

## Estado

⚠️ **Las anotaciones están en inglés; la especificación ya está en español.** Se renderizaron el 17 ago, antes de traducir el `.md`. **Hasta que se re-rendericen, los frames y el documento no dicen exactamente lo mismo** — el `.md` manda.

⚠️ **Ninguna anotación cubre el modo oscuro.** Las previsualizaciones están fijadas en Light por una limitación del pipeline. La especificación **sí** trae los dos valores de cada token (`#Light · #Dark`), así que **para color en oscuro hay que ir al `.md`, no a Figma.**

*Las anotaciones anteriores a esta entrega no existen: es la primera documentación completa del componente.*
