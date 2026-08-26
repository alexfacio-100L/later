# La plantilla de página de componente

**Genera las tres pestañas de un componente para Supernova, desde el `.md` que produce uSpec.**

```bash
node plantilla-componente/generar.mjs button            # escribe los .mdx, no toca Supernova
node plantilla-componente/generar.mjs button --validar  # además los valida contra la plataforma
node plantilla-componente/generar.mjs button --publicar # los escribe en la página real
```

## Por qué la plantilla vive aquí y no en Supernova

**La alternativa era duplicar la página en la interfaz.** Se descartó con una razón medible: **todos los bloques que dan valor apuntan a una entidad concreta** —`figma-frames`, `propstable`, la rejilla de contraste, los tokens, el playground, los enlaces—. *Duplicar deja el esqueleto y cero contenido: copia lo barato y obliga a rehacer lo caro, siete bloques por componente y cuarenta componentes por delante.*

## El reparto, y su porqué

De las **323 líneas publicables** del `button.md`, la narrativa que necesita un diseñador —qué es, cuándo, cuál elijo— es una fracción pequeña, enterrada bajo la especificación.

🔴 **Y Supernova no tiene acordeón, ni bloque plegable, ni «leer más».** *La pestaña de página es su único mecanismo de plegado.* Por eso «de menos a más» se consigue **repartiendo**, no ocultando.

| Pestaña | Responde |
| --- | --- |
| **Uso** | ¿cuál elijo? |
| **Especificación** | ¿cuánto mide? |
| **Código** | ¿cómo lo implemento? |

**La regla de cuántas pestañas se cuenta, no se juzga** —una regla que exige criterio no se ejecuta—: **menos de 120 líneas publicables → una sola página; 120 o más → las tres. Nunca dos.**

## Qué añadir para un componente nuevo

Un `config/<slug>.json`. Nada más. El reparto, la conversión y la validación ya están.

⚠️ **El id de `componenteFigma` NO es el del componente canónico.** *El validador comprueba la forma del valor, no que la entidad exista: confundirlos valida igual y publica una tabla equivocada.*

## Lo que este generador NO hace, a propósito

**No convierte Markdown a MDX-lite.** Eso lo resuelve `experimento-canario/conversor.mjs`, cuyas reglas salieron de `validateMarkdown` y no de suposiciones. *Este generador solo decide qué va en cada pestaña.*

## ⚠️ Validar no es lo mismo que verse bien

`validateMarkdown` acepta o rechaza la **sintaxis**. **No dice nada sobre si la página se ve bien** — eso solo se comprueba publicando y mirando. *Detalle en `experimento-canario/SINTAXIS-MDX-LITE.md`.*
