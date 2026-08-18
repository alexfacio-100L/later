# Consulta a la comunidad de Supernova — el `hasError` del import de variables

> Reescrito el 14 ago 2026. **Sustituye al borrador anterior**, que se apoyaba en un diagnóstico falso —creíamos que el import no procesaba nada— y quedó descartado.
>
> **Destino: canal de comunidad en Slack.** Copiar el bloque en inglés. Es corto a propósito: en Slack un muro de texto no se lee.

## El estado real, en una línea

El import **funciona** —procesa contenido y retipa tokens correctamente— pero `hasError` viene `true` en **todas** las corridas, con `lastImportResult: null` y sin mensaje en ningún lado.

## Lo que ya está descartado, y cómo

| Hipótesis | Cómo se descartó |
| --- | --- |
| Red o firewall | `lastImportedAt` avanza en las seis corridas |
| Librería sin publicar | Se publicó; y la FAQ dice que ni siquiera es necesario |
| El import no procesa nada | **Falso.** Un canario creado en Figma entró; el push del 14 ago retipó `lineHeight/h-5xl` → `LineHeight` y `size/h-2xl` → `FontSize` |
| Las cuatro causas de la FAQ | Todas descartadas — ver abajo |

**Las cuatro causas documentadas, una por una:** *out of range* es imposible sin tipos especializados y la doc no declara rangos · *unidades incompatibles* requiere un token de opacidad y hay cero · *booleanas* no existen en el archivo · *referencias no resueltas* se falsó comparando `origin.sourceFile` entre crudos y aliasados: todos apuntan al mismo archivo, y `origin` no correlaciona con crudo/alias en ninguna dirección.

**Y `sn_get_token_detail` no expone estado por token:** devuelve `id`, `tokenType`, `path`, `value`, `description`, `origin` y `properties`. No hay `error`, `warning` ni `isValid`. `missingTokenIds` viene vacío.

## La pregunta que hay que hacer

No *"por qué falla"* —puede que no falle nada— sino **cómo saber qué token no validó**. Es una carencia de observabilidad, no un problema de configuración.

---

## Post para Slack (inglés)

> **`hasError: true` on every variables import, but the import actually works — how do I see which token failed?**
>
> Every push from the Figma Variables Sync plugin comes back with `hasError: true` and `lastImportResult: null`, on six consecutive runs. No message in the plugin UI, nothing exposed through the API.
>
> But the import **is** working. I created a canary variable in Figma and it came through. And after enabling scope-based token typing today, the same "failing" push correctly retyped `lineHeight/h-5xl` → `LineHeight` and `size/h-2xl` → `FontSize`. So content is being processed while the flag says error.
>
> I went through the four causes listed in the FAQ and ruled them all out:
> • **Out of range** — impossible here, all tokens landed as generic types, and *Types of tokens* doesn't declare ranges for any type.
> • **Incompatible units** — needs an opacity or specialized token. I have zero.
> • **Boolean variables** — none in the file.
> • **Unresolved references** — I compared `origin.sourceFile` between raw-valued tokens and aliased controls. All point to the same file, and `origin` doesn't correlate with raw/alias in either direction.
>
> Also ruled out: network (timestamp advances every run) and unpublished library (published, and the FAQ says it isn't required anyway).
>
> `sn_get_token_detail` returns `id`, `tokenType`, `path`, `value`, `description`, `origin`, `properties` — no `error`, `warning` or `isValid` field, and `missingTokenIds` is empty.
>
> **So: is there any way to see which specific token failed validation on an import?** Or is a persistent `hasError` with `lastImportResult: null` a known thing on the beta plugin?
>
> Design System `825551` · source `a1e2b80d-5292-4ffc-8aa2-093179dc486a` (`FigmaVariablesPlugin`), if anyone from the team wants to look.

## Si te preguntan por el segundo tema

**No lo mezcles en el mismo post.** La no-propagación de borrados **ya está documentada** como comportamiento intencional y tiene procedimiento de tres pasos — preguntarlo te haría parecer que no leíste la FAQ y resta credibilidad a la pregunta que sí importa.

Si sale la conversación, lo que sí vale preguntar aparte: **por qué el plugin no permite eliminar colecciones ya empujadas**, y si está previsto. Eso sí es una limitación declarada sin solución.

## Otro dato por si sirve

`figmaFileUrl` viene `null` incluso cuando `sourceFile` sí existe. La documentación de la herramienta dice que ese campo se puebla *"when their linked source file is available"*. Puede ser síntoma de lo mismo, o ruido. **Mencionarlo solo si preguntan** — meterlo de entrada dispersa el hilo.
