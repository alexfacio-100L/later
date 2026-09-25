# La plantilla de página de componente

> 🔴 **`generar.mjs` se RETIRÓ el 25 sep 2026.** Está en `_superado/`, con su porqué. *Producía una estructura de tres pestañas contra la de **cuatro** que está viva, y con ids que no existen en el árbol.* **Su criterio de reparto se trasladó antes** al `README.md` del repo (paso 2.7) y a la skill `design-systems`.

## Qué guion se usa para qué

| Necesitas | Guion |
| --- | --- |
| **Colgarle pestañas a una hoja que ya existe** — `Link`, `Tag`, y las 65 hojas de `Componentes` | **`npm run docs:pestanas`** (`experimento-canario/crear-pestanas.mjs`) |
| **Escribir el contenido** del Button en sus cuatro pestañas | `npm run button:escribir` (`button.mjs`) |
| **Actualizar el molde** oculto de documentación | `npm run molde:actualizar` (`maestra.mjs`) |

> 🔴 **Estructura y contenido son dos pasos, no uno.** *Estaban mezclados en el mismo guion, y por eso el hueco de la estructura no se veía: el Button creó su página al vuelo y nadie notó que ningún guion sabía hacerlo sobre una hoja existente.*

## Por qué la plantilla vive aquí y no en Supernova

**La alternativa era duplicar la página en la interfaz.** Se descartó con una razón medible: **todos los bloques que dan valor apuntan a una entidad concreta** —`figma-frames`, `propstable`, la rejilla de contraste, los tokens, el playground, los enlaces—. *Duplicar deja el esqueleto y cero contenido: copia lo barato y obliga a rehacer lo caro, siete bloques por componente y cuarenta componentes por delante.*

## El reparto

**Se movió al `README.md` del repo, paso 2.7 del flujo de documentación**, cuando se retiró el guion que lo contenía. *Aquí solo quedaría una copia que envejece por su cuenta.*

## Qué hace falta para un componente nuevo

🔴 **Ya NO basta con un `config/<slug>.json`** — eso era cierto de `generar.mjs`, que está retirado. Hoy son dos pasos distintos:

1. **La estructura** — `npm run docs:pestanas -- --buscar="<componente>"` convierte su hoja del índice en grupo de cuatro pestañas.
2. **El contenido** — hoy solo existe para el Button, escrito a mano en `button.mjs`. **Generalizarlo está pendiente.**

⚠️ **El id de `componenteFigma` NO es el del componente canónico.** *El validador comprueba la forma del valor, no que la entidad exista: confundirlos valida igual y publica una tabla equivocada.*

## La conversión a MDX-lite no se reimplementa

La resuelve `experimento-canario/conversor.mjs`, cuyas reglas salieron de `validateMarkdown` y no de suposiciones.

## ⚠️ Validar no es lo mismo que verse bien

`validateMarkdown` acepta o rechaza la **sintaxis**. **No dice nada sobre si la página se ve bien** — eso solo se comprueba publicando y mirando. *Detalle en `experimento-canario/SINTAXIS-MDX-LITE.md`.*
