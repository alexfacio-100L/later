# Contexto para la extracción del Button

**Qué es y cómo se usa el *Optional context* que dicta la extracción del `Button`.** El texto que se pega vive en `_contexto-para-pegar.txt`.

*Recoge todo lo que ha cambiado en el componente —19 y 20 de agosto, la escala del 27, `isLoading` el 31, y la verificación de geometría del 3 de septiembre— para que la especificación no repita lo ya corregido ni describa lo que ya no existe.*

---

> 🔴 **El texto ya no vive aquí. Vive en [`_contexto-para-pegar.txt`](./_contexto-para-pegar.txt), y ése es el único que se pega.**
>
> **Por qué se vació este bloque, el 3 de septiembre de 2026:** este archivo guardaba una **copia** del contexto, y esa copia se quedó en el estado del **20 de agosto** — seguía dictando la escala vieja `37 · 45 · 53`, seguía diciendo que `size` no escala la tipografía, y seguía dando los paddings anteriores. **La versión buena se actualizó tres veces sin que ésta se enterara.**
>
> ⚠️ **Y es el fallo más caro que puede tener este archivo**, porque *el insumo que dicta pesa más que el documento que muestra*: un contexto caduco no produce un error visible, produce **una extracción entera construida sobre una premisa falsa**, que se propaga al `.md`, a la página y a lo que lea ingeniería. Ya envenenó el brief tres veces.
>
> **La regla, y es mecánica para que no dependa de que alguien se acuerde: una sola copia.** *Este documento explica **qué es** el contexto y **cómo** se usa; el `.txt` **es** el contexto.*

## Cómo se usa

1. Abre `_contexto-para-pegar.txt` y cópialo entero.
2. Pégalo en el campo **Optional context** del plugin *uSpec Extract*, al generar el `_base.json` del component set `Button`.
3. Si algo del componente cambió desde la última extracción, **actualiza el `.txt` ANTES de extraer** — y quita lo que dejó de ser cierto, no solo añadas lo nuevo. Un contexto que acumula capas es exactamente cómo se envenenó las tres veces anteriores.

---

## Por qué cada bloque

**Los nombres de propiedad** evitan que la especificación nueva vuelva a decir `Type`, que es el error que arrastra el `.md` actual.

**El espaciado** impide que se documente como defecto algo ya corregido — sin esto, el generador vería la progresión nueva y podría reportarla como inconsistencia.

**El defecto conocido** se declara explícitamente para que **no se documente como decisión de diseño**. *Es la diferencia entre "los tres tamaños comparten fuente" y "los tres tamaños comparten fuente, y eso es un hueco abierto".*

**El color** da el porqué de los alias por mode, que sin contexto parecen arbitrarios.

**El idioma** replica la nota que ya lleva el `.md`, para que la convención sobreviva a la regeneración.
