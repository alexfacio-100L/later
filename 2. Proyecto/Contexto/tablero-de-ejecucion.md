# Renovare · Later: Brand System — Plan de ejecución

> **Este es el tablero de trabajo del proyecto.** Ábrelo para saber qué sigue; márcalo conforme avanzas.
> El diagnóstico está **cerrado**: no queda nada por auditar en foundations. Lo que hay aquí es ejecución y tres decisiones.
>
> Última actualización: **19 ago 2026**
>
> **Cerrado el 14 ago:** bloque 0 completo · 1.1 · 1.3 · 1.7 · 2.4 · 2.5 · piloto mínimo · convención de nombres.
> **Cerrado el 17 ago:** 1.2 · 1.4 · 1.5 · 1.6 · 1.13 · **1.14 completa (17/17)** · descripciones de `semanticColors` · **la reconstrucción del Button (175 → 60) y el nacimiento del `Link` (15)** · **el color de sombra tokenizado** (`shadowTint/*` + `shadow/*`, 24 sombras ligadas) · **3.6: el Button documentado end-to-end**, con las seis anotaciones en Figma.
>
> **Cerrado el 18 ago:** 1.16 · **1.18** (el `lineHeight` fuera de escala) · **3.7** (uSpec fuera del repo del área, modelo IPO) · **3.8** (especificación y seis anotaciones en español) · **3.10** (las siete plantillas personalizadas, verificadas en contraste y ocultas de la librería) · la mitad ruidosa de **2.6**.
> **Abierto el 18 ago:** **1.17** (la familia `link` rota) · **1.19** (vertical trim, bloqueada por Engineering).
>
> **Cerrado el 19 ago — el día de la nomenclatura:** **2.2** (Poppins es comercial, Nunito Sans es plataforma: no eran duplicados) · **3.9** (el modo oscuro no se documenta en Figma, Supernova ya lo resuelve) · **4.5** + **4.6** (el Button y el Link en `camelCase`, 75 variantes y 225 capas) · **4.1** (`Button Menu`, `Chip` y `Button Card`, con sus espacios y su `On-focus`) · **una sola escala de tamaños** en todo el sistema (30 tokens y 981 variantes de icono).
> **Y toda la gestión del proyecto:** roadmap al 30 de octubre, las tres ceremonias en Calendar, y el reporte de estado publicado para stakeholders.
> **Y la tarde del 19 ago, el cambio de librería de iconos:** **1.15** · **1.17** completa (los seis tokens de contraste, verificados en Supernova) · **4.8** (el swap de Heroicons a Phosphor, 591 instancias en once páginas).
> **Abierto el 19 ago:** **4.7** (`PhoneSolid`, que puede haber quedado sin objeto al cambiar de librería) · **4.9** (el volumen del catálogo de iconos).
>
> 🔴 **Corrección grande del 19 ago:** el tablero afirmaba que *"el pipeline de tokens ya corre en `Later2.0`"*. **Es falso.** `later-tokens` tiene cuatro commits de setup y **ninguno de Supernova**; lo que corre es Style Dictionary en local sobre un export manual de abril. **El puente a código no ha arrancado**, y esa es la mitad que falta del entregable 1.

> 🟢 **Heroicons pasa a Phosphor.** La causa era de **cobertura, no de estilo**: faltaban iconos y se pedían bajo demanda. **Y resolvió solo el defecto estructural de 4.2** — antes había 327 sets con eje `size` y 309 componentes sueltos sin él; los 1512 de Phosphor tienen firma idéntica. *El deber ser del mantenimiento, para retomar con la PD Jr, está en `../Diagnóstico/mantenimiento-de-iconos.md`.*
>
> 🟢 **Hallazgo del 19 ago que toca 1.9, 1.10 y 1.11:** **crear tokens nuevos SÍ propaga a Supernova.** Los dos `negativeHighlight` llegaron completos con su descripción. Con esto el mapa de R-12 queda cerrado: **crear ✅ · modificar ✅ · renombrar ✅ · borrar ❌.** *Las tres tareas de borrado siguen siendo las únicas que exigen el procedimiento manual de tres pasos.*
>
> **▶ Por dónde seguir:** foundations queda casi limpio. Lo que resta depende de otros: **1.12** espera el puente técnico para su capa `shadow`, y **0.6** y **1.11** esperan a que se limpien los 26 tokens de sombra del source de estilos. Las que sí se pueden trabajar sin dependencias son **1.9** y **1.10** —los borrados, **re-verificando consumo antes**, porque *"cero referencias" caduca*— y **4.10** cuando retomes documentación. *`4.7` puede haber quedado sin objeto: `PhoneSolid` era un Heroicon.*
>
> ⚠️ **Antes de publicar la librería:** el Brand Book conserva 68 Heroicons y **los sostiene huérfanos**. Se migra a Supernova a mano, y hasta entonces no se pueden borrar del archivo.

> Estado del contexto y el porqué de cada cosa: `estado-del-proyecto.md` · Decisiones y su razón: `DECISIONS.md` (repo de Product Design)
> **Fechas, sprints y entregables comprometidos: `roadmap-fase2.md`** — el proyecto cierra el **30 de octubre de 2026**. Este tablero dice *qué* falta; el roadmap dice *cuándo*.

## Cómo se usa

- Se trabaja **de una en una**, en orden de bloque. Los bloques 1 y 3 corren en paralelo entre sí.
- Cada tarea marca `[x]` cuando su **criterio de done** se cumple — no cuando "se hizo".
- Casi todo es **trabajo manual del Lead en Figma**: el MCP de Supernova es de solo lectura. Los agentes diagnostican y verifican; no aplican.
- Cuando una tarea revele algo que cambie el rumbo, va a `DECISIONS.md` (repo de Product Design), no aquí.

**Leyenda:** 🔴 bloquea otras cosas · 🟡 decisión pendiente del Lead · ⚪ ejecución mecánica

---

## BLOQUE 0 — Desbloquear 🔴

**Resuelto el 13 ago. El import de variables SÍ funciona.** ✅ **El bloque 0 deja de bloquear.**

> **El canario entró.** Lo que no funciona es el **borrado**: al eliminarlo en Figma, el token no se borró de Supernova — perdió su colección y cayó a **"No collections"**.
>
> **"No collections" es el cementerio de lo borrado en Figma**, no una zona del sistema. Explica las subcategorías con actividad reciente. **Excluirlo del universo vivo en cualquier auditoría futura**; su contenido es deuda a limpiar a mano.
>
> ✅ **La auditoría se hizo sobre tokens vivos** — verificado ante la duda razonable del Lead. Las ocho colecciones vivas son `primitiveColor`, `semanticColors`, `primitiveType`, `semanticType`, `spacing`, `unit`, `border` y `layout`. Los tokens auditados pertenecen a `semanticType`, `primitiveType` y `unit`. Ninguno huérfano. **Las conclusiones sobre tipografía siguen en pie.**
>
> ⚠️ **`hasError: true` miente.** Marca error de forma persistente en imports que sí procesan contenido. No usarlo como señal.
>
> **Consecuencia para verificar el bloque 1:** las correcciones **sí se van a poder comprobar** en Supernova tras el push. Lo que no se comprueba solo es lo eliminado — ahí hay que mirar a mano si quedó residuo en "No collections".

- [x] **0.1 · Diagnosticar el import de variables.** ✅ **El import funciona.** El canario —colección nueva en Figma con un color aliasado a `secondaryColors`, publicada— **entró** en el push de las 23:16:12Z. Al borrarlo en Figma y volver a empujar, **no se eliminó de Supernova**: cayó a "No collections".
  **Veredicto: el contenido se procesa; las eliminaciones no se propagan.** R-12 confirmado en variables con evidencia limpia, ya no solo por el mode `App`.

  > ⚠️ **Corrección de método, tercera vez en este proyecto.** Se afirmó primero que el canario no había llegado, tras buscar un **grupo** llamado `canario` en el árbol. El token se llamaba `canario` a secas, sin barra, y **un token sin ruta no genera grupo**: vive suelto en la raíz. Se miró donde no podía aparecer.
  > Antes había pasado con `search_design_system` (12 ago) y con verificar el pipeline usando un token que aún no se había corregido (13 ago). **El patrón es siempre el mismo: tratar "no lo encontré donde miré" como "no existe".**
  > **Regla adoptada: antes de afirmar una ausencia, verificar que la herramienta sería capaz de mostrar la presencia.** Un canario solo sirve si primero compruebas que se le puede oír.

- [x] **0.7 · Localizar el token que dispara `hasError`.** ✅ **Cerrado el 14 ago como "no encontrado con este método".** Barrido **completo**: 813 tokens, cursores agotados, filtrando vivos por la propiedad `Collection` — **678 vivos, 135 desconectados**.
  **Veredicto: no hay culpable único identificable desde Supernova.**
  - **Causas 1 y 2 descartadas por estructura.** No existe ningún token de tipo especializado —todo es `Dimension`/`String`/`Color` genérico—, así que **no hay rango que violar**; y la doc de *Types of tokens* no declara rangos. La causa 2 exige un token de opacidad: **hay cero**. Los `lineHeight` con decimales sucios quedan **descartados** como sospechosos (siguen siendo defecto de escala, ver 1.1).
  - **`overlay/*` se cae como hipótesis principal.** Son crudos, pero **una variable de Figma no puede aliasar con opacidad modificada**: color + alpha tiene que ser literal. **Nacieron crudos, no llegaron rotos.**
  - **Causa 3 descartada con evidencia.** Por valor, una referencia rota y un crudo legítimo son indistinguibles — pero **`sn_get_token_detail` expone `origin.sourceFile.fileName`**, y ahí sí se distingue. Comprobado sobre los sospechosos y un control aliasado: **todos los que tienen origen apuntan al mismo archivo, y `origin` no correlaciona con crudo/alias.** También cae la sospecha del archivo copiado `[Auditoria] - Later: Brand System`.
  - **Dejan de ser sospechosos del `hasError`:** `overlay/*`, `graphs/visualMapping/*`, `illustration/OrangeAcent/Acent 2-3`, `radius/Circle`, `radius/Pill`. Siguen siendo **deuda de aliasado** (1.9, 1.10), que es otro asunto.
  - **Las cuatro causas documentadas quedan descartadas.** Lo que no se puede saber es **cuál token falló**: `sn_get_token_detail` no expone `error`, `warning` ni `isValid`, y `missingTokenIds` viene vacío. **Ninguna superficie del producto lo dice.**
  - **Eje sin explorar:** hay **tokens vivos con `origin: null`** —con colección pero sin metadato de import—, cortado por grupo (`graphs/`, `illustration/OrangeAcent/`, `shadows/` sin origen; `overlay/`, `radius/`, `heading/` con él). Anotado, no diagnosticado.

  **El `hasError` deja de bloquear:** está documentado que no detiene el import. Detalle y corrección de método en `DECISIONS.md` (repo de Product Design), 14 ago (dos entradas).

- [ ] **0.5 · Publicar en la comunidad de Slack de Supernova.** 🔴 **Cambia de vía: el Lead decidió el 14 ago llevarlo a Slack en vez de a soporte** — responde gente que ya lo vivió, no solo el equipo.
  *Post listo, en inglés y corto a propósito:* `Later2.0/Later: Brand System/2. Proyecto/Soporte/soporte-supernova-import-variables.md`
  *La pregunta no es "por qué falla"* —puede que no falle nada— **sino cómo saber qué token no validó.** Es una carencia de observabilidad.
  *Argumento fuerte que se suma hoy:* el push que retipó `lineHeight/h-5xl` → `LineHeight` y `size/h-2xl` → `FontSize` **también marcó `hasError: true`**. Un indicador que reporta error mientras hace su trabajo bien es reportable por sí solo.
  *No mezclar la no-propagación de borrados:* está documentada y resta credibilidad preguntarla.
  *Done:* publicado, con el enlace del hilo anotado aquí.

- [x] **0.8 · Barrer los tokens con `origin: null`.** ✅ **Cerrado el 14 ago. Son 57 de 672 vivos (8.5%)**, cobertura completa sin huecos.
  **El corte es perfectamente limpio por grupo:** `shadows/` (26), `illustration/` (16) y `graphs/` (15) **al 100% sin origen**; los otros 26 prefijos, al 100% con él. Cero grupos mezclados.
  *Los tres son, en Figma, **efectos y gradientes** — las tres cosas que no nacieron como variables normales.*
  **Hipótesis, sin comprobar:** esos 57 **no están ligados al source del plugin**, así que los pushes desde Figma no los tocan. Un corte limpio por grupo entero es firma de un **evento de import distinto**, no de un fallo token a token.
  🔴 **Consecuencia si la hipótesis es cierta:** renombrar uno de esos 57 **no propagaría** — dejaría el viejo y crearía uno nuevo. **Toca 1.9, 1.10 y 1.11.**
  💡 **Experimento gratis, ya agendado:** `illustration/OrangeAcent` **es uno de los 57 y está en el lote de renombres de 1.4**. Tratarlo como **canario** y verificarlo aparte tras el push. Si propaga, esto es ruido de metadatos y se cierra; si no, hay 57 tokens fuera del alcance del pipeline.
  ⚠️ *Discrepancia sin reconciliar:* el barrido de 0.7 contó 813/678; este cuenta 807/672. Seis vivos menos, con un push entre medias.

- [ ] **0.6 · Limpiar "No collections".** Es el residuo acumulado de todo lo borrado en Figma que sobrevivió en Supernova. Deuda a eliminar a mano.
  > 🔴 **Bloqueada por 1.12.** De los 135 desconectados, **135 son Typography, Shadow y Blur** — y los 26 `Shadow` contienen **la única copia de la geometría de las sombras**. Borrarlos ahora la destruye. **Resolver 1.12 antes de tocar nada aquí.**

  *Done:* vacío, y con el paso de verificación de 0.3 en marcha para que no vuelva a crecer.

- [x] **0.2 · Los 30 componentes huérfanos.** ✅ **Resuelto el 13 ago.** `stats.components` bajó de **2788 a 2758** y ahora coincide con `componentsUpdated`. Eran los `Quaternary` eliminados.
  **El matiz que importa:** el import reporta `componentsDeleted: 0` aunque el total bajó 30. **El estado sí se corrige; el reporte no lo declara,** y tarda un ciclo. Distinto de las variables, donde el mode `App` sí quedó pegado hasta borrarlo a mano.
  *Consecuencia:* R-12 se comporta distinto en componentes que en variables. Registrar en `DECISIONS.md` (repo de Product Design).

- [x] **0.4 · Registrar la limitación del MCP de Supernova.** ✅ **Escrito el 14 ago** en `estado-del-proyecto.md`, con la tabla de qué herramienta responde cada pregunta y la trampa del token suelto. `sn_get_token_list` y `sn_get_token_group_list` **ignoran búsqueda y filtro por tipo**; `sn_search` solo indexa documentación.

- [x] **0.3 · Procedimiento de borrado en la definition of done del pipeline.** ✅ **Escrito el 14 ago** en `estado-del-proyecto.md`, sección *"Definition of done del pipeline"*. Son **tres pasos, no uno** — borrar en Figma → push → borrar el token ya nativo desde Supernova. Está documentado por Supernova, no es un workaround inventado.
  *Lo que falta y es del Lead:* que el equipo lo adopte como checklist operativo. Escrito no es adoptado.

---

## BLOQUE 1 — Correcciones de foundations ⚪

Todas diagnosticadas, ninguna requiere decidir nada. Manual en Figma.

### Tipografía

- [x] **1.1 · Reapuntar 36 variables de `lineHeight`.** ✅ **APLICADO el 14 ago 2026 por el asistente vía `use_figma`**, no a mano. 36 variables × 2 modes = **72 ediciones**, en tres lotes verificados.
  **Cierre verificado en Desktop: los doce primitivos con exactamente un consumidor y cero huérfanos** — la correspondencia 1:1 que el diagnóstico decía que la escala tenía por diseño. Antes: 3 huérfanos y 3 compartidos.
  **Dos excepciones en Mobile, ambas correctas:** `t-l` lo comparten `heading/s` y `text/l` porque en móvil ambos miden 16px — convergencia real, no defecto; y `h-5xl` queda huérfano porque `heading/5xl` baja a 56px y usa `h-4xl`. **El eje responsive quedó intacto.**
  *`lineHeight/none` queda sin consumidor en ambos modes: es un valor de utilidad (0px), no un escalón.*
  ✅ **Push del Lead hecho y verificado en Supernova el 14 ago.** Los seis tamaños llegan con su valor y su tipo: `heading/3xl` 57.98 · `heading/xl` 42.37 · `heading/l` 37.07 · `heading/s` 26.48 · `text/l` 23.52 · `text/m` 21, todos como `LineHeight`. **Cadena completa Figma → push → Supernova.**
  💡 *Hallazgo lateral:* `lineHeight/none`, `t-n` y `t-s` **son alias a otras variables**; de `t-m` en adelante son valores crudos. La capa primitiva de `lineHeight` es **mixta** — a tener en cuenta al redondear los decimales (tarea 2.1): tres de los doce heredan su valor de otro lado.

- [x] **1.2 · `size/h5xl` → `size/h-5xl`.** ✅ **Ya estaba hecho por el Lead** — verificado el 14 ago: los doce `fontSize/*` llevan guion. Único de la escala sin guion; sus once hermanos son `h-4xl`, `h-3xl`, `t-l`…

- [x] **1.3 · `unit/26` vale `24px`.** ✅ **Corregido y publicado por el Lead el 14 ago** — ahora vale `26px`. Verificado por MCP.

### Documentación de tokens

- [x] **1.14 · Documentar `semanticColors`.** ✅ **Aplicado el 14 ago vía `use_figma`: 56 de 95 tokens documentados**, en tres pasadas por familia (`text/` 13 · `background/` 20 · `icon/` 10 · `border/` 7 · `overlay/` 6). Verificado: 56 con descripción, 39 sin ella.
  *Propuestas y razones en:* `Later2.0/Later: Brand System/2. Proyecto/Correcciones/descripciones-semanticColors.md`
  **El criterio:** la descripción **no dice qué es el token, dice cuándo usarlo** — el valor ya está a la vista. Formato: cuándo usarlo · cuándo no · con qué se confunde.
  **Los 39 restantes NO se documentan a propósito:** su nombre o su valor van a cambiar, y **la descripción viaja a Supernova y de ahí a código** — explicar un defecto lo convierte en doctrina. Se documentan cuando se corrijan.
  ✅ **Push hecho y verificado en Supernova el 14 ago.** Comprobado uno de cada familia: `text/brand`, `background/neutral`, `icon/selected` y `overlay/10` llegan con su descripción; **`background/systemStatic` llega vacía**, que es la comprobación que importa — **el corte se respetó y no se coló ningún excluido.**

  > 💡 **Documentar resultó ser una forma de auditar.** Redactar "cuándo usar este token" obliga a mirar su valor en `Light` y `Dark` a la vez, y ahí aparecieron **trece defectos que no se ven trabajando en Figma**. Es el argumento de por qué documentar en la misma ronda de construcción no es burocracia.

### Color

> ✅ **PREMISA CAÍDA, verificado el 17 ago.** Los 25 renombres **no dejaron un solo huérfano**: `neutral/900` conserva su ID y su descripción vieja, es el mismo token renombrado en sitio. **Lo que deja huérfanos es borrar un grupo, no renombrar dentro de uno que sigue existiendo.** Renombrar es barato y no hay que acumularlo en lotes. *La razón para agrupar sigue siendo válida solo por avisar a Engineering una vez.*
>
> *Premisa original, ya refutada:*
> 🔴 **Agrupar TODOS los renombres en una sola pasada — 1.2, 1.4, 1.5 y 1.13.**
> Cada renombre en Figma **deja un huérfano en "No collections"**, y hay ya 135 que se borran uno por uno. Hacerlos juntos genera el residuo **una vez** y se limpia **una vez**, en lugar de cuatro rondas de basura. Además **1.2 se disuelve solo** dentro de 1.13.
> ⚠️ Estos nombres los **lee Engineering**: avisar antes, no sorprender.

- [x] **1.13 · Renombrar `size` → `fontSize`.** ✅ **Cerrada el 14 ago — ya estaba hecho por el Lead** — `primitiveType` tiene `fontSize/*`. *Nota: no era una colección, era un grupo dentro de `primitiveType`.* Sus tokens (`size/t-l`, `size/h-2xl`…) **son tamaños de fuente**, y Supernova ya los reconoce como `FontSize`. El nombre en Figma iría detrás de lo que el sistema ya dedujo.
  *Y libera el prefijo `size/`* para los tamaños de elemento de la fase de componentes (ver bloque 4), evitando que dos conceptos distintos compartan nombre.
  *Incluye 1.2:* al renombrar, `h5xl` → `h-5xl` se corrige en el mismo movimiento.

- [x] **1.4 · Corregir los typos publicados.** ✅ **Cerrada el 14 ago.** Dos ya estaban corregidos (`warningSubtle`, `tertiaryInverse`); `text/secondaryInverseStatic` se corrigió en el lote. **`illustration/OrangeAcent` sale: no es una variable de Figma** — ver 0.8. `text/warninSubtle` · `text/tertaryInverse` · `text/secundaryInverseStatic` · `illustration/OrangeAcent`.
  *Ojo:* son nombres que Engineering ya lee. Renombrar deja residuo en Supernova (ver 0.3).

- [x] **1.5 · Renombrar los semánticos que llevan el color en el nombre.** ✅ **Cerrada el 14 ago.** `background/brandRed` → **`background/accent`**. *`brandDarkBlue` no existía; el token es `background/brandMain`.* `background/brandRed`, `background/brandDarkBlue` y equivalentes → nombre por función.
  *Por qué:* aunque el alias sea correcto, el nombre miente cuando la marca cambie de color. Decisión 4 del 13 ago.

- [x] **1.6 · Renombrar las dos escalas de grises.** ✅ **Aplicado el 14 ago:** `neutral/*` (9) y `neutralSoft/*` (9). ✅ **Analizado y decidido el 14 ago.** `neutralsChromatic` → **`neutral`** · `neutralsGray` → **`neutralSoft`**.
  *`neutralsChromatic` es falso —sus valores son acromáticos— y `neutralsGray` no distingue nada porque las dos son grises. `Soft` comunica "más suave, menos contraste", que es su rol real.*
  **Entra en el lote único de renombres.**

- [x] **1.7 · Resolver primitivos duplicados en valor.** ✅ **Cerrada sin trabajo el 14 ago: no eran duplicados.**
  **Son dos escalas con rango y progresión distintos:** `neutral` recorre `#FFFFFF`→`#000000` **lineal con paso 32**; `neutralSoft` cubre solo los claros (`#F9F9F9`→`#8F8F8F`) con **progresión geométrica**. **El `#BFBFBF` compartido es el punto donde una recta y una curva se cruzan**, no un token duplicado.
  **Por qué existen las dos:** entre `neutral/100` y `neutral/200` hay un salto de 32, demasiado grosero para distinguir un fondo de un borde. `neutralSoft` mete `249, 233, 218, 204` en ese hueco. **Es la resolución fina que a la escala completa le falta.**
  *Medido: 47 referencias a `neutral` (extremos y oscuros) · 23 a `neutralSoft` (74% en los claros). Fusionar serían 70 referencias reapuntadas para perder resolución.*

- [x] **1.7b · Eliminar escalones muertos.** ✅ **CERRADA el 18 ago — dos de tres.**
  **Borrados:** `neutralSoft/800` (`#9A9A9A`) y `neutralSoft/900` (`#8F8F8F`), cero alias y cero nodos, verificado en todas las páginas.
  🔴 **`neutral/200` NO se borró: dejó de estar muerto el 17 ago.** Es el valor que recibió **`background/brandPressed` en Dark** al cerrar 1.16. Borrarlo habría roto el botón primario en modo oscuro.
  ⚠️ **La lección, que aplica a 1.9, 1.10 y 1.11:** *"cero referencias"* es un dato **con fecha de caducidad**. Las tres tareas de borrado se diagnosticaron el 12–13 ago y desde entonces se han corregido tokens que consumen primitivos. **Re-verificar el consumo justo antes de borrar, nunca fiarse del diagnóstico guardado.**
- [x] **1.8 · Arreglar escalas semánticas incoherentes.** ✅ **CERRADA el 19 ago.** ⚠️ **Actualizada el 17 ago: la mitad cambió de naturaleza.**
  ✅ **La rama `positiveSubtle` está resuelta, pero no como decía esta tarea.** No era una escala incoherente: **`Subtle` en `text/`, `icon/` y `border/` no significaba "menos intenso" sino *highlight* — verde de DATO frente a verde de ALERTA.** Renombrados a `*/positiveHighlight` y `text/warningHighlight`, con alias por mode. *Sigue anotado que **`background/positiveSubtle` (`#34A865`) es el único `*Subtle` de fondo con valor saturado** —sus tres hermanos son claros— y que **`background/positiveHighlight` ya existe** (`green/25`, `#D7F5E6`), así que conviene decidir si aquél se aclara o se renombra.*
  ✅ **La rama de enlaces se resolvió el 19 ago dentro de 1.17.** El defecto era que **`text/linkPressed` aclaraba mientras `linkHover` oscurecía**; al dar alias por mode a los tres estados, cada mode quedó con **progresión monótona** —Light oscurece `500→700→900`, Dark aclara `300→200→100`—. *Lo que quedaba de 1.8 es solo `background/positiveSubtle`.*

- [ ] **1.9 · `graphs/visualMapping/hot|warm|cold` son los tres `#FFFFFF` sin alias.**

- [ ] **1.10 · ~~`overlay/*` son los únicos tokens con valores crudos~~ — ya no es cierto, y el criterio cambió el 17 ago.**
  **Ahora también `shadowTint/6…48` llevan valor crudo, y a propósito:** Figma **no permite aliasar un color con la opacidad modificada**, así que un color con alfa solo puede vivir como valor literal. **Eso convierte el "crudo" de `overlay/*` en una decisión correcta, no en deuda.**
  *Lo que queda de esta tarea:* decidir si los `overlay/*` sin consumo se borran (ver 1.11) — **no "aliasarlos", que es técnicamente imposible.**

- [ ] **1.11 · Borrar sombras y overlays sin consumo.** Se reconstruyen cuando exista el componente que los pida. Decisión 5 del 13 ago.
  > ⚠️ **Leer 1.12 antes de ejecutar esto.** La geometría de las sombras solo existe en tokens desconectados.

### Integridad del sistema

- [ ] **1.12 · Las sombras llegan a código como color plano — pero NO hay que reconstruirlas.** 🟢 **RE-DIAGNOSTICADA el 17 ago, y sale mucho más barata.**
  ✅ **Los 26 tokens `Shadow` de Supernova tienen la geometría COMPLETA y correcta** — `Shadows/Single/Small/sm-2` = `0 2px 4px 0 #0E1F35 / 12%`. **Nada está muerto; las sombras que se diseñaron están bien.**
  🔴 **Los 26 `shadows/*` de tipo Color son tokens FALSOS:** apuntan a `#0F2C57`, que **no es el color de ninguna sombra** (el real es `#0E1F35`). No eran "la mitad viva" de nada.
  🔴 **La causa real está en el exporter:** la entrada del pipeline es solo `color`, `typography`, `spacing`, `unit` y `border` — **no hay archivo de shadow**. Los `Shadow` nunca entraron; los falsos sí, porque viven en `color.json`. *Evidencia: `--color-shadows-single-small-sm1: #0f2c57`, y todas idénticas.*
  *Las tres tareas:* **(1)** añadir la capa `shadow` al pipeline · **(2)** borrar los 26 color styles falsos · **(3)** ~~tokenizar el color de sombra~~ ✅ **hecho el 17 ago**.
  ✅ **Color de sombra tokenizado con ancla propia.** Nacen `shadowTint/8·12·16` (primitivos, `#0E1F35`, con el alfa dentro como los `overlay/*`) y `shadow/subtle·default·strong` (semánticos con los dos modes). **Los cinco effect styles del Button quedaron ligados, sin cambiar de aspecto.** *Se descartó anclarlo a la escala de grises: acoplaría la elevación a la identidad de marca.*
  🔴 **Dato que lo decidió: en Dark las sombras son invisibles** — `#0E1F35` al 12% da **1.02** de contraste sobre `#000000` y **1.00** sobre `#202020`. Un `effectStyle` no tiene modes, pero **ligado a una variable sí hereda Light y Dark**: tokenizar es lo que hace posible arreglarlo. **Decisión de dark pendiente**, con la infraestructura ya puesta.
  ✅ **Las 24 sombras de `#0E1F35` ligadas el 17 ago, con snapshot previo** (`Later2.0/…/snapshot-effect-styles-17ago.md`, las 27 capas con su geometría exacta y cómo revertir). **Cero desviaciones de alfa: ninguna cambió de aspecto.** La escala se completó a **13 niveles** —`shadowTint/6…48` y `shadow/6…48`— y los tres nombres por intensidad pasaron a numéricos: *no hay forma honesta de llamar `strong` al 0.24 frente al 0.28*. **El número dice la verdad: la elevación todavía no tiene semántica.**
  ✅ **CERRADO el 19 ago lo que quedaba en Figma.** Los dos `Modern/Soft` —los únicos con el segundo azul, `#051D3D`— **se ligaron a `shadow/6` y `shadow/12`**, emparejados por opacidad. *Su geometría no se tocó: offsets `0,72` y `0,90`, radios `132` y `200`, que es lo que los hace "Modern/Soft".* **A 6% y 12% la diferencia entre los dos azules es imperceptible, así que unificar no cambia el aspecto y elimina un segundo color sin razón declarada.**
  ✅ **Cero sombras sin ligar: las 26 apuntan a `shadow/*`.** *`Blur/10` queda fuera de la cuenta — es un `LAYER_BLUR` y **no tiene color que ligar**. El Lead lo declara experimento sin criterio de tokens: no es prioritario y se decide después si se borra o se conserva como marcador.*
  ✅ **Los 26 color styles falsos ya NO existen en Figma** — verificado, cero. *Los borró el Lead.*
  🔴 **PERO siguen vivos en Supernova**, y **no están en "No collections": tienen colección asignada igual que los tokens vivos.** Lo que sí tienen es **`origin: null`** — son de los 57 que vienen del source tipo `Figma`, no del plugin de variables. **Hipótesis, sin confirmar: ese source no se ha re-importado desde el borrado**, y un push de variables no lo limpia. *Se confirma re-importando el source de Figma y volviendo a mirar.*
  ⚠️ **No es cosmético:** mientras esos 26 estén vivos, **son lo que un exporter encontraría al buscar "shadow"** — color plano `#0F2C57`, que no es el color de ninguna sombra real.
  🟡 *Anotado y sin resolver:* **13 opacidades para 27 sombras**, lo que indica que la escala de elevación todavía no tiene sistema.
  **El `Button` depende de esto:** 90 de sus 175 variantes llevan sombra, más `Button Card` (24) y `Button Menu` (6), y usan **5 estilos de los 27**. Pero **ya no bloquea nada de Figma** — el Button puede ir end-to-end; lo que no llegará correcto es su sombra.
  🔴 **VERIFICADO el 19 ago con `git fetch`: el pipeline a código NUNCA ha corrido.** El repo `later-tokens` —que consumen `later-web-next`, `later-web-astro` y `later-mobile-expo`— tiene **cuatro commits, todos de setup inicial**, una sola rama y local idéntico a remoto. **Ninguno viene de Supernova**, y los tokens son del **28 de abril**. Lo que corre es Style Dictionary en local sobre un export manual de abril.
  💡 **Dato que abarata la tarea:** la config usa el glob `tokens/global/**/*.json`, así que **Style Dictionary recogerá un `shadow.json` en cuanto exista** — añadir la capa no requiere tocar código, requiere que **Supernova la exporte**.
  **Consecuencia:** la parte de Figma (borrar los 26 color styles falsos) es del Lead y se puede cerrar ya; **"llegar a código" no puede cerrar antes del puente técnico del S4.**
  ⚠️ *Corregido: el tablero y `CLAUDE.md` decían que "el pipeline ya corre en Later2.0". Es engañoso.*
  *Diagnóstico anterior, ya refutado:*
  - [ ] **1.12 (original) · Las sombras llegan a código como color plano, y la tipografía compuesta está muerta.** 🔴 **Toca el Hito 1.** Descubierto el 14 ago en el barrido de 0.7.
  🔴 **Se encarece con el hallazgo de 0.8: las dos mitades de las sombras están rotas, cada una a su manera.** Los 26 `shadows/*` **vivos** corresponden **1:1 por nombre** con los 26 `Shadows/*` de tipo `Shadow` **desconectados** — `shadows/single/small/sm1` ↔ `Shadows/Single/Small/sm-1`, los 26 pares. **La mitad muerta perdió la colección; la mitad viva perdió el origen.**
  **Ninguna de las dos es base sobre la que construir.** Refuerza **reconstruir las sombras como variables** en vez de intentar reconectar el import de estilos — pero es decisión del Lead.
  **El dato:** los **135 tokens desconectados** son **108 Typography + 26 Shadow + 1 Blur** — el **100%** de esas tres capas. Ninguno vivo.
  **Lo que significa:** hay un sistema duplicado, media vivo y medio muerto, con nombres casi idénticos. `shadows/single/small/sm1` (vivo) es un token **Color** aliasado a `neutralDarkBlue/800`; `Shadows/Single/Small/sm-1` (muerto) es un token **Shadow** con offset, blur y spread reales. **La capa viva solo transporta el color.** Si el pipeline consume solo lo vivo, **las sombras salen a código como un color plano.** Igual con tipografía: lo vivo son las partes sueltas (`heading/5xl/regular/size`…), lo compuesto (`Heading/5XL/Regular`) está muerto.
  ✅ **RESPONDIDA el 17 ago, era exactamente eso.** `illustration/`, `shadows/` y `graphs/` **no existen en ninguna colección de variables de Figma** — son estilos, y los trae el source tipo `Figma`, no el plugin. Por eso los 57 sin origen son justo esos tres grupos. **Las sombras están partidas porque una mitad son color styles y la otra effect styles: son dos objetos distintos de Figma, no un fallo del import.** Esto **refuerza reconstruirlas como variables**; reconectar el import de estilos no une lo que nunca fue un solo objeto.
  *Hipótesis original, ya confirmada:* ¿están desconectadas porque Typography, Shadow y Blur vienen de **estilos de Figma**, no de variables, y por tanto los trae el source tipo `Figma` y no el `FigmaVariablesPlugin`? Ese source reporta hoy `scope.tokens: true` pero `stats.tokens: 0`, lo que encajaría. **Sin comprobar.**
  *Por qué importa el orden:* la respuesta decide si la solución es **reconectar el import de estilos** o **reconstruir las sombras como variables**. Son trabajos distintos.
  *Done:* respondida la pregunta del origen, y decidido cuál de los dos caminos se toma. **Bloquea 0.6 y condiciona 1.11.**

- [x] **1.20 · Los colores de estado no cambian con el mode, y por eso casi ninguno pasa AA en los dos.** 🔴 **Nace de una duda del Lead el 17 ago** y la auditoría la confirmó más grande de lo planteado.
  **El dato:** **28 de 30 tokens de estado tienen el mismo hex en Light y Dark.** Un semántico que no cambia con el mode no es semántico — es un primitivo con nombre bonito. Cada color se eligió mirando un solo fondo. **Solo 4 de 17 tokens de texto/icono/borde pasan AA en los dos modes.**
  **Fallan en dark** (tonos oscuros): `text/negativePressed` **1.65**, `text/negativeHover` **2.52**, `icon/negative` y `border/negative` **2.97**, `text/positive` **3.16**, `text/warning` **3.05**. *No es el rojo: el verde y el naranja fallan igual.*
  **Fallan en light** (tonos claros): `text/warningSubtle` **2.31**, `text/positiveSubtle` **2.82**, `text/offer` **3.23**, `icon/warning` y `border/warning` **2.31**.
  ✅ **`background/positive` CORREGIDO el 17 ago:** reapuntado a **`green/700`** (5.16:1 con texto blanco). **No se oscureció el primitivo** — `green/600` lo comparten también `icon/positive` y `border/positive`, y oscurecerlo los habría roto en dark (2.69 y 2.32 en `green/800`/`900`). *Regla que deja: un primitivo compartido entre un fondo y un icono no puede optimizarse para los dos — el fondo quiere contraste contra su texto, el icono contra la superficie. **Cuando chocan se separa el alias, no se mueve el primitivo.***
  🟡 **`background/offer` — decisión pendiente del Lead, y no es de color.** Oscurecer el rojo lo acercaría a `negative`, justo lo que ese token existe para evitar. **El fondo se queda; lo que cambia es el texto encima.** Como el fondo no cambia por mode, el texto tampoco puede: solo **`text/secondaryInverseStatic`** pasa en los dos (**6.05:1**); `text/primary` falla en dark (3.47) y `text/primaryInverse` en light (3.30). *Lo robusto es un token de componente `tag/offerText`, para que no dependa de que alguien elija bien.*
  ✅ **Los tres defectos de `text/` CORREGIDOS el 17 ago.** `text/placeholder` fallaba en **los dos modes** —en Dark apuntaba a `neutral/100`, el mismo alias que `text/primary`; en Light a `neutral/500`, que daba 3.68— y ahora es `neutral/600` / `neutral/400`. `text/secondary` en Dark era el rojo de marca y fallaba sobre `background/secondary` (4.29): ahora `neutralSoft/200`, que **restaura la simetría con `text/secondaryInverse`**. Y nace **`text/onOffer`** (6.05:1) como par de `background/offer`.
  ⚠️ **El `offer` no pudo ser token de componente: esa capa no existe en el sistema.** Las ocho colecciones son primitivas y semánticas. **Abrir la capa 3 es decisión aparte**, no algo que se cuela en un fix de contraste.
  *Defecto original, ya cerrado:* **`text/secondary` en Dark es `#f82f56`**, el rojo de marca Web — un "texto secundario" rojo brillante que **falla sobre `background/secondary` (4.29)**; parece asignación equivocada. Y **`text/placeholder` en Dark es `#ffffff` puro, idéntico a `text/primary`** — el placeholder queda tan prominente como el texto real y **borra la señal de si el campo está lleno**. No es contraste, es usabilidad.
  🔴 **Lo que fallaba SIEMPRE, en los dos modes:** **`background/positive` `#2a8a53` no admite texto legible** (blanco 4.32, oscuro 3.77: ninguno llega a 4.5), y **`background/offer` con texto blanco da 3.47** — justo el tag de "últimos ladrillos"; pide texto oscuro.
  🟢 **La solución ya existe, ejecutada una vez por accidente.** `text/negative` es **el único token de estado que cambia entre modes** (`#bf0606` / `#ff7b71`) **y el único de su familia que pasa en los dos**. El Lead lo describió como "de emergencia sin probar bien" — resultó ser el patrón correcto. Su defecto es el alias: `secondaryColors/orangeAccent` **ni es naranja ni es un acento**.
  ✅ **Seis tokens aliasados por mode el 17 ago** — `text/positive`, `text/warning`, `icon/warning`, `border/warning`, `icon/negative`, `border/negative`. *Criterio repetible: en cada mode, el peldaño más cercano al del otro mode que aún pase el umbral con margen, para que el color siga siendo reconocible como el mismo.*
  🔴 **BLOQUEO 1 — la escala roja no da para dark.** Necesita tres tonos de texto (default, hover, pressed) y **solo sirve `red/100`**, que además ya usa `offer`. **`#FF7B71` no era un parche: es el peldaño que le falta a la escala**, hoy fuera de sitio como `secondaryColors/orangeAccent`. Extenderla es **decisión de color de marca del Lead** — candidatos calculados en `DECISIONS.md` (repo de Product Design). Bloquea `text/negativeHover` (2.52) y `text/negativePressed` (1.65).
  ✅ **BLOQUEO 2 RESUELTO el 17 ago con contexto del Lead: no eran sutiles, eran *highlights*.** El verde `positive` se reservó para alertas, y el `Subtle` se creó como **verde de DATO** —un saldo positivo en una tabla de valores— porque el oscuro no funcionaba ahí. **No es intensidad menor: es otro rol**, y el nombre mentía al revés (`#34A865` es *más* vivo que `#2A8A53`). Renombrados a **`text/positiveHighlight`, `text/warningHighlight`, `icon/positiveHighlight`, `border/positiveHighlight`**, aliasados por mode.
  ⚠️ **Con un límite declarado dentro del token:** un verde vivo y legible sobre blanco **no existe** —en Light la escala solo pasa 4.5:1 en los peldaños oscuros que no servían—, así que se asignaron al **umbral de texto grande (3:1, WCAG 1.4.3)**, que es lo que suele ser un saldo en tabla. La restricción está escrita en la descripción: *si el dato va en tamaño normal, usa `text/positive`*.
  ✅ **`background/positiveSubtle` resuelto el 19 ago, y el defecto era peor de lo anotado.** No era solo que el nombre no encajara: **se usaba en los siete tags `type=highlight, helper=agree` con `text/primaryInverse` encima, dando 2.88:1** — fallo de contraste en producción.
  **El nudo:** el token estaba **atrapado entre sus dos vecinos** — `background/positive` es `green/700` (oscuro, admite texto claro) y `background/positiveHighlight` es `green/25` (muy claro, admite texto oscuro). Su valor intermedio **no admitía ninguno con holgura y tampoco era "sutil"**.
  **Decisión del Lead: los tags pasan a `background/positive`**, el token que ya existe para eso. *Se eliminó un token atrapado en vez de parchearlo.* **7 nodos religados, cero usos restantes.**
  🔴 **Y el cambio destapó un defecto nuevo: 4.07 en Dark.** `background/positive` **no invierte** con el tema, pero `text/primaryInverse` **sí** —`#F9F9F9` en Light, `#000000` en Dark—. **Corregido con `text/primaryInverseStatic`**, que es la pieza que el sistema ya tenía para eso: **4.90 en ambos modes.** *Octava aparición de la regla del token emparejado con otro que no cambia.*
  *Diagnóstico original, ya resuelto:*
  🔴 **BLOQUEO 2 — los `Subtle` no funcionan en ninguna combinación.** `text/warningSubtle` sobre su propio fondo da **1.53**; `text/positiveSubtle` sobre el suyo da **1.00** —*es el mismo color exacto*—; y `text/warning` sobre `background/warningSubtle` da **3.28**. **Las descripciones además se contradicen** sobre cuál va encima de cuál. *Hay que decidir qué significa el sufijo `Subtle`: **(a)** el par del fondo —entonces la salida es el patrón `on*`— o **(b)** jerarquía de baja intensidad. Son trabajos distintos.*
  *Ruta original:* corregir primero los dos que fallan siempre; luego dar a cada escala de estado **dos anclas** (tono claro y tono oscuro) y que los semánticos **aliasen distinto por mode** — la misma regla de los dos rojos de marca; y mover `#ff7b71` a la escala `red`.
  ✅ **Verificado en Supernova el 17 ago, en los dos themes:** cada token entrega un primitivo distinto según el theme y **los renombres conservaron su ID**. El patrón funciona de punta a punta.
  *Done:* los 17 pasan AA en los dos modes, y la regla queda escrita en la convención. ✅ **17 de 17, cerrada el 17 ago.** *(Numerada 1.14 hasta el 19 ago, cuando se detectó que colisionaba con la tarea de documentar `semanticColors`.)* El Lead decidió extender la escala roja: **`red/50` = `#FCA4A4`** y **`red/75` = `#FF7B71`**, que entran por debajo de 100. `secondaryColors/orangeAccent` **se mudó, no se duplicó**. De paso se corrigió que `text/negativeHover` valía lo mismo que `text/negative` en Light — **el hover no se notaba**.
  **Auditoría completa con todos los ratios y sus límites:** `Later2.0/Later: Brand System/2. Proyecto/Diagnóstico/auditoria-contraste-estado.md`
  ⚠️ **Medido contra `background/primary` y `secondary` solamente.** `background/inverseStatic` vale `#202020` en los dos modes y no está medido.

---

- [x] **1.16 · El botón primario es ILEGIBLE al pasar el ratón en modo oscuro.** ✅ **CERRADA el 18 ago.** `brandHover` → `neutral/300` (**11.42**) y `brandPressed` → `neutral/200` (**15.76**) en Dark; Light sin tocar. **Los seis estados pasan AA.** *Los valores son el espejo medido del salto que ya existía en Light (1.91 y 1.50 → 1.90 y 1.33), incluida la particularidad de que el pressed queda más cerca del default que el hover.* 🔴 **Encontrado el 17 ago al añadir el hex de Dark a la documentación** — no había forma de verlo antes, porque la especificación solo publicaba Light.
  **`background/brandMain` invierte con el tema** (`#041B3D` → `#FFFFFF`) **pero `brandHover` y `brandPressed` NO** (`#1C488A` y `#133970` en ambos modos). En Dark el botón parte de blanco con texto negro y **al hacer hover el fondo salta a azul oscuro con el texto todavía negro**.

  | | Light | Dark |
  | --- | --- | --- |
  | default | 16.23 ✅ | 21.00 ✅ |
  | hover | 8.51 ✅ | **2.34** 🔴 |
  | pressed | 10.80 ✅ | **1.85** 🔴 |

  **No es un caso de borde: es el estado más frecuente del botón principal de la interfaz.**
  *Es la quinta aparición de la misma regla en el día —un token que cambia con el mode emparejado con otro que no—, ahora en la familia `brand`, que no entró en 1.14.*
  *Done:* `brandHover` y `brandPressed` con alias por modo, igual que `brandMain`, y los seis ratios ≥4.5. **Se corrige en la capa de tokens, no en el componente.** ⚠️ *Cambia el aspecto del producto en Dark.*

- [x] **1.15 · Los componentes ya revelaron tres malos usos y un token que faltaba.** ✅ **CERRADA el 19 ago.** Encontrado el 17 ago al revisar `Alerts` y `Tags` **a propuesta del Lead** — que fue el punto 2 del protocolo de cierre, no una distracción.
  ✅ **CORREGIDO el 17 ago:** los doce nodos de texto de las seis variantes `Error` pasaron de `text/offer` (3.47) a **`text/negative`** (6.47 Light / 6.46 Dark).
  🔴 **Corrección: dos de los tres hallazgos reportados NO existían.** *"Success usa `icon/positiveHighlight`"* y *"Normal pinta un nodo no-texto con `text/secondary`"* eran **error de método**, no defectos: el primer perfil clasificaba "si no es TEXT es fondo", incluía la variante raíz y leía una sola variante por tipo. El volcado nodo por nodo y el mapa de uso global —dos vías independientes— dicen que `icon/positiveHighlight` vive en `Tags` y `Thumbnails`, **no en `Alerts`**, y que `text/secondary` está en nodos TEXT, que es uso correcto. **Un agregado no es evidencia; el volcado sí.**
  *Hallazgo original, ya corregido:*
  🔴 **`Alerts` tipo `Error`: el icono usa `icon/negative` pero el texto usa `text/offer`** → **3.47:1, no cumple AA**, y es el token que existe para NO comunicar peligro. `text/negative` daría 6.02.
  🟡 **`Alerts` tipo `Success`:** su icono usa `icon/positiveHighlight` —el verde de **dato**— cuando un alert es feedback del sistema y le toca `icon/positive`.
  🟡 **`Alerts` tipo `Normal`:** pinta un nodo que no es texto con `text/secondary`.
  ✅ **CERRADA el 19 ago, y el defecto era otro del que decía la tarea.** Los crudos `#FFEDED` y `#D7F5E6` **ya no existen**: las variantes `financial` se rediseñaron sin fondo, así que no había nada que religar. *Verificado con control: 262 nodos con relleno en `Tags`, **los 262 ligados a variable, cero crudos, cero estilos**.*
  🔴 **Lo que sí estaba roto era una asimetría:** `countUp` usaba `icon/positiveHighlight` + `text/positiveHighlight`, pero **`countDown` usaba `icon/offer` + `text/offer`** — el token de *oferta comercial* para un *dato a la baja*. Es el mismo error que el Alert de Error corregido el 17 ago.
  **La causa: el par simétrico no existía.** Había `background/negativeHighlight` pero **ni `text/` ni `icon/negativeHighlight`**. Creados con alias por mode —`red/500` en Light (5.10), `red/100` en Dark (4.69), **ambos pasan 4.5:1**, a diferencia de su hermano verde— y aplicados a los **12 nodos** de las cuatro variantes `countDown`.
  💡 *La distancia a `negative` es de un peldaño (`red/500` frente a `red/600`), exactamente la misma que ya separa `positive` de `positiveHighlight` en verde. El sistema ya aceptaba esa cercanía.*
  *Done:* los tres malos usos corregidos en los componentes y los dos crudos reemplazados por el token. **Es trabajo de bloque 4** —toca el aspecto del producto—, pero se registra aquí porque el diagnóstico salió de foundations.

- [x] **1.17 · La familia `link` está rota entera, y cada estado falla en un mode distinto.** Encontrado el 18 ago **convirtiendo la convención en un detector**: la sección 9 de `13-convencion-naming.md` (repo de Product Design) dice que un token que no cambia entre modes lleva sufijo `Static`, así que **todo token sin `Static` que valga lo mismo en Light y Dark o miente en su nombre o le falta el alias**. Barrido de los 98 tokens de color: **42 sin `Static` no cambian; 0 con `Static` sí cambian.**
  ⚠️ **Los 42 no son 42 defectos.** Medir un `background/*` contra el lienzo no es la prueba correcta —un relleno se juzga por el texto que lleva encima—. Descartados los fondos y aplicando el mínimo por rol, quedan **seis**:

  | Token | Light | Dark | Mín | Falla en |
  | --- | --- | --- | --- | --- |
  | `text/linkPressed` `#8CB1F5` | **2.01** | 9.72 | 4.5 | **Light** |
  | `text/link` `#1C64EB` | 4.80 | **4.07** | 4.5 | **Dark** |
  | `text/linkHover` `#114FC4` | 6.65 | **2.94** | 4.5 | **Dark** |
  | `text/info` `#1C64EB` | 4.80 | **4.07** | 4.5 | **Dark** |
  | `text/offer` `#F94848` | **3.23** | 6.05 | 4.5 | **Light** |
  | `border/brand` `#041B3D` | 15.9 | **1.23** | 3 | **Dark** |

  **Los tres estados de `link` fallan en sitios distintos**, así que ninguna revisión hecha en un solo mode los habría encontrado todos. `border/brand` es el peor en magnitud: azul marino casi negro sobre negro.
  ✅ **CINCO DE SEIS APLICADOS el 19 ago.** `text/link`, `text/linkHover`, `text/linkPressed`, `text/info` y `border/brand` tienen alias por mode y **pasan su mínimo en ambos**, medidos contra el peor fondo de cada uno (`background/primary` en Light, `background/secondary` en Dark):

  | Token | Light | Dark |
  | --- | --- | --- |
  | `text/link` | `blue/500` **4.80** | `blue/300` **4.69** |
  | `text/linkHover` | `blue/700` **6.65** | `blue/200` **5.90** |
  | `text/linkPressed` | `blue/900` **8.70** | `blue/100` **7.54** |
  | `text/info` | `blue/500` **4.80** | `blue/300` **4.69** |
  | `border/brand` | marca **15.90** | `neutralDarkBlue/300` **5.40** |

  🟢 **La escala azul sí daba**, a diferencia de la roja en 1.20: hay exactamente **tres peldaños legibles a cada lado** —`500/700/900` en Light y `300/200/100` en Dark—, ni uno de sobra. *`blue/300` pasa Dark con 4.69 sobre un mínimo de 4.5: es el margen más justo del sistema y conviene no tocarlo sin volver a medir.*
  🟢 **De paso cierra la rama de enlaces de 1.8:** ahora cada mode tiene **progresión monótona** —Light oscurece, Dark aclara—, así que el pressed ya no es más claro que el default en Light.
  ✅ **CERRADA COMPLETA el 19 ago, los seis más `icon/offer`.**
  🔴 **Corrección: `text/offer` NO estaba bloqueado por ninguna decisión.** El texto anterior de esta tarea decía que su arreglo iba *"junto al renombre a `accent`"*, y **esa premisa se había invalidado el 14 de agosto**: `DECISIONS.md` registra que **`offer` NO entra en `accent`** —existe precisamente para no usar el rojo de error, un tag de *"últimos ladrillos"* con rojo de alarma comunica lo contrario de una oportunidad— y que **`icon/subtle` ya se renombró a `icon/accent`** en ese mismo lote.
  **Lo que sí queda por resolver es de contraste, no de nombre:** `text/offer` da **3.23** en Light. *Medido: `red/500` daría 5.10, pero es el mismo peldaño que `background/negative`, así que oscurecerlo lo acerca justo al rojo del que `offer` existe para diferenciarse.* **Se midió el uso antes de elegir, y refutó la hipótesis de trabajo:** `text/offer` se usa **10 veces y siempre sobre las superficies del tema** —`background/primary` y `background/secondary`—, **nunca sobre `background/offer`**. Así que `text/onOffer` no aplicaba y sí necesitaba corrección.
  ✅ **Resuelto con `red/300` en Light (3.87) y `red/100` en Dark (4.69)**, y `icon/offer` con el mismo par. **Decisión del Lead: umbral de texto grande (3:1), declarado en la descripción** — el mismo criterio que ya rige `positiveHighlight` y `warningHighlight`.
  💡 **El porqué, y es de significado, no de accesibilidad:** ningún rojo vivo alcanza 4.5:1 en Light. Los que sí pasan son los oscuros — y ahí **el token deja de significar oportunidad y empieza a parecer alerta**, que es exactamente de lo que `offer` existe para diferenciarse. *La salida para texto pequeño está escrita en la descripción: fondo `background/offer` con `text/onOffer` (6.05:1).*
  *Done:* los seis con alias por mode y ≥ su mínimo en ambos. *Séptima aparición de la regla del token emparejado con otro que no cambia.*
  ✅ **VERIFICADO EN SUPERNOVA tras el push del 19 ago.** Con el theme `dark` aplicado, cada token entrega **un primitivo distinto**: `text/link` y `text/info` pasan de `blue/500` a **`blue/300`**, `linkHover` de `blue/700` a **`blue/200`**, `linkPressed` de `blue/900` a **`blue/100`**. **La cadena Figma → push → Supernova funciona de punta a punta.**
  🔴 **Y la verificación destapó documentación caducada:** la descripción de `text/info` decía literalmente *"No cambia con el tema"* — cierto hasta esta misma tarea, falso después. **Reescritas las cinco descripciones**, incluidas las de `text/linkPressed` y `border/brand`, que estaban vacías. *Corregir un token sin corregir su descripción deja una mentira en la fuente de verdad que Engineering lee.*
  ✅ **Los siete verificados en Supernova tras el segundo push**, incluido `border/brand`, que entrega **`#6B96D6` (`neutralDarkBlue/300`)** bajo el theme `dark` frente al azul marino en base. *El límite declarado antes queda cerrado.*

---

- [x] **1.18 · Un `lineHeight` fuera de escala en los estilos de 12 px.** ✅ **CERRADA el 18 ago.** `Text/S - Nunito Sans/Semi Bold Italic` tenía **23.52** —el valor de los estilos de 16 px— frente a los **18** de sus catorce hermanos. Copiado accidental. **Los 15 estilos de 12 px comparten ahora ratio 1.5.**

---

- [ ] **1.19 · Vertical trim y `paragraphSpacing`: decidir con Engineering, no en Figma.** Los 108 estilos tienen `verticalTrim: NONE`. Las plantillas de documentación sirvieron de caso de estudio y el dato decisivo es que **sus 109 etiquetas son de una sola línea**: `Text/L` (16 px, `lineHeight` 23.52) produce cajas de **24 px**. **En texto de una línea el interlineado no separa nada** — solo añade half-leading que el auto-layout mide como contenido: **8 px sin tinta por etiqueta, 11 en los títulos.**
  **El criterio resuelve los dos temas a la vez:** la pregunta no es tipográfica sino *¿este texto es interfaz o es contenido?* En interfaz el espaciado lo pone el contenedor —trim activo, `paragraphSpacing` inerte—; en contenido, ambos son parte del texto.
  🔴 **Bloqueada por paridad.** Activar el trim en Figma sin que web (`text-box-trim`) y Android (`includeFontPadding`) lo repliquen hace que **el diseño mida una cosa y el código otra**. *Done:* respuesta de Engineering y, si es viable, los 108 estilos con `verticalTrim` y una regla en la convención.

---

## BLOQUE 2 — Decisiones del Lead 🟡

**No son correcciones.** Cambian el aspecto del producto o la forma del sistema, así que no entran al bloque 1. No bloquean nada, pero conviene cerrarlas antes de documentar en Supernova.

- [x] **2.1 · Los tres defectos de escala que se ven.** ✅ **CERRADA el 19 ago.**
  ✅ **El defecto del tracking no era de diseño, era de asignación.** Los cuatro valores correctos **ya estaban ahí** —`0.4 · 0.3 · 0.2 · 0.1`— **solo que permutados por pares**: `t-n`↔`t-s` y `t-m`↔`t-l`. *A menor tamaño, más tracking: la escala tenía la regla y la aplicaba al revés.*
  ✅ **Los dos pares indistinguibles separados**, continuando la progresión: `h-xl` de `-0.6` a **`-0.7`** y `h-5xl` de `-1.4` a **`-1.6`**.
  ✅ **`lineHeight/t-n` de `unit/12` a `unit/14`** — factor de 1.200 a **1.400**. *Nota: sigue siendo el más bajo de los cuatro textos, porque `t-s` y `t-m` están en 1.500. Con `unit/16` se invertiría del todo, a costa de cajas más altas — se prefirió el equilibrio.*
  🟢 **Resultado: tracking estrictamente monótono y cero valores duplicados** en los doce escalones.
  ⚠️ **Trampa verificada:** cambiar una variable de tipografía exige **cargar antes las fuentes de todos los text styles que la consumen**, o falla con *"unloaded font"*. Son 15 en este sistema. *El script es atómico, así que el primer intento no dejó nada a medias.*

- [x] **2.2 · Familia tipográfica: verificar y decidir.** ✅ **CERRADA el 19 ago con contexto del Lead: no eran duplicados, son dos roles.**
  **`Poppins` es comercial** —tiene personalidad, y esa personalidad es el punto—: landings, campañas, banners y modales comerciales, en Regular y Semi Bold. **`Nunito Sans` es plataforma**: claridad de lectura y eficiencia, sin propósito comercial — cuerpos de texto, alerts, producto.
  **Es el caso (4) del criterio del 14 ago:** *si ambos se usan, son dos roles distintos sin nombre.* Ya tienen nombre.
  🟢 **Y valida el eje `Surface = Product/Marketing` del Button:** es el mismo corte, expresado en otra capa. No son dos decisiones, es una.
  *Done:* la regla escrita en `13-convencion-naming.md` (repo de Product Design). **La familia NO se tokeniza** — exigiría un mode que se multiplica contra `Desktop`/`Mobile` y `Light`/`Dark`.

- [x] **2.5 · ¿Renombrar `Space` → `Gap`?** ❌ **No. Decidido el 14 ago.** *Gap* es el nombre del **scope de Figma**, no del token. El token es una **unidad de separación** que alimenta gap, padding y margin: nombrarlo por una sola de las tres propiedades lo ata a su implementación. Es el mismo defecto que `background/brandRed` —el nombre describiendo el destino en vez de la función— y `Space`/`spacing` es además lo estándar.
  ⚠️ *Sin verificar:* si el scope *Gap* de Figma cubre también el padding o son alcances separados. **Al aplicarlo, comprobar si la variable se ofrece al poner padding.** Si no aparece, revisar el criterio.

- [x] **2.4 · Asignar scopes a la capa semántica.** ✅ **CERRADA el 14 ago.** El Lead activó la asignación de tipos por scope en el plugin y aplicó scopes a todo el sistema. **Verificado por MCP, token por token:**

  | Capa | Antes | Ahora |
  | --- | --- | --- |
  | `lineHeight/*` | Dimension | ✅ **LineHeight** |
  | `size/*` | Dimension | ✅ **FontSize** |
  | `radius/*` | Dimension | ✅ **BorderRadius** |
  | `width/*` | Dimension | ✅ **BorderWidth** |
  | `Space/*` | Dimension | ✅ **Space** |

  **El sistema ya no llega genérico.** Los exporters pueden distinguir un interlineado de un radio, que era el bloqueo real para el Hito 1.

  > 💡 **Lo que enseñó el proceso, y vale para el bloque 1.** Al aliasar `Space/*` a `unit/*` a mano, `Space/L` quedó apuntando a `unit/14` en vez de `unit/16` — dos entradas contiguas en la lista. **Rompía el ritmo de la escala (`12 · 14 · 24`) y no era visible en Figma.** Lo detectó la verificación por MCP tras el push, y el Lead lo corrigió.
  > **Aliasar a mano es propenso a este error exacto.** Las 36 ediciones de `lineHeight` de la tarea 1.1 son el mismo tipo de trabajo: **verificar por MCP después del push no es burocracia, es lo que atrapa el escalón equivocado.**


- [ ] **2.6 · ¿Publicar los templates de uSpec, o mantener el fallback local?** 🟡 **Decisión del Lead, nace el 17 ago.**
  **`figma.importComponentByKeyAsync` NO funciona** con los siete templates: son locales y sin publicar, y falla con *"Component with key not found"*. **Las seis anotaciones salieron gracias a un fallback** —localizar el componente por su `key` en `_Local Componentes`, instanciar y desacoplar— **que la skill original no contempla y hay que instruir en cada invocación.**
  **Las dos salidas:** **(a)** publicar el archivo, y entonces la vía nativa funciona a cambio de que **el equipo vea siete componentes que no son de producto**; **(b)** quedarse en local e instruir el fallback siempre. *Efecto colateral ya verificado: como la vía por key está muerta, **ponerles el punto para ocultarlos es seguro** — no rompe nada que no estuviera roto.*
  *Pesa más de lo que parece:* con diez componentes por lote, son diez instrucciones extra por lote.
  ✅ **La mitad ruidosa se resolvió el 18 ago: las siete llevan punto** —`.Anatomy`, `.API`, `.Property`, `.Structure`, `.Color Annotation`, `.Screen reader`, `.Motion`— **y ya no aparecen en la librería.** *Verificado antes de aplicarlo, no supuesto:* se renombró `Motion` a `.Motion` y **su `key` no cambió** (`60bf0b6a…400f`), y se siguió localizando con el valor del config. **El pipeline busca por `key`, nunca por nombre.**
  **Lo que queda de la decisión:** si algún día se publican para usar la vía nativa, **hay que quitar el punto primero** — un componente privado no se importa por key desde otro archivo. Hoy la opción (b) es la vigente y ya no tiene el coste de ensuciar la librería.

- [x] **2.3 · Auditoría del Button.** ✅ **CERRADA el 17 ago: auditada, decidida Y EJECUTADA.** Entró por la skill `design-systems`; ya no son "cinco principios de memoria" sino una auditoría con veredicto por eje.
  **Lo ejecutado:** `Tertiary` salió a un componente **`Link`** propio · `Size` de 5 a 3 · `Loading` fuera como variante · **API consolidada de 16 propiedades a 9**, idéntica a la del `Link`. **Button 175 → 60 variantes (−66%) · Link 15.**
  🟡 **Lo que sobrevive como decisión suelta y se sigue en otras tareas:** el **spinner real** (hoy `Arrow PathSolid`, deuda conocida documentada) · el **layout shift** al aparecer el spinner · el **`iconRight` de enlace externo del `Link`** · el **botón icon-only**, que no existe.

  **Decidido:**
  - ✅ **`Purpose` se queda y se renombra a `Surface = Product / Marketing`.** No es redundante con `Type`: `Type` es jerarquía en la pantalla, `Surface` es en qué superficie vive. `CTA` = landings, campañas y banners; `Regular` = producto, login, modales. El nombre viejo era el defecto, no el eje.
  - ⏭️ **El `Primary` en rojo de marca queda diferido.** Colisiona con el rojo de `danger` — el usuario aprende que rojo es "cuidado" y luego se lo pone la acción principal.

  - ✅ **`Size` baja de cinco a tres: `S`, `M`, `L`.** El Lead reconoce que `XL` y `XXL` se crearon por dispositivo anticipado (kioscos táctiles) y **hoy no se usan**; el default es `L`. Cada tamaño cuesta **36 variantes**, así que los dos sin uso son **72 variantes por un caso que no existe**. La intención del kiosco se **documenta en la descripción del componente**, no se mantiene en variantes.
    ⚠️ *Antes de borrar:* buscar instancias de `XL`/`XXL` en los archivos de producto. Si aparecen, no se borran — ver dónde y por qué.

  **Verificado y cerrado (técnico):**
  - ✅ **El peso tipográfico SÍ se puede bindear** — el binding se llama `fontStyle`, no `fontWeight`, y los 108 text styles ya lo usan. **Pero no resuelve el Button:** el peso viene de una variable distinta por cada text style, y **un text style es fijo por nodo**. Ninguna propiedad de componente puede elegir entre dos. **Las 90 variantes no son descuido: son la única salida dentro de ese modelo.**
  - ⏭️ **Ruta alternativa identificada y NO adoptada:** una colección con modes `Product`/`Marketing` permitiría un solo text style, decidiendo el peso al aplicar el mode al frame. Más limpio conceptualmente —se marca la landing entera, no botón por botón— pero el componente pierde la propiedad `Surface`, consume presupuesto de modes, choca con el plan free de Supernova y falta ver cómo viaja a código. **Se evalúa con Engineering, no hoy.**

  **Recomendación fuerte, pendiente de decisión:**
  - 🔴 **`Tertiary` es un link y probablemente debe salir del Button.** El Lead: *"el terciario es considerado link"*, y por eso su construcción es única en vez de variante del `Primary`. Un link navega, un botón ejecuta; en código son `<a>` y `<button>`; el lector de pantalla los anuncia distinto. **Si vive dentro del set, el generador produce un `<button>` donde va un `<a>` — defecto que llega a producción y que ninguna revisión visual detecta. Toca el Hito 1.**

  **Falta del Lead, y decide dos ejes:**
  - **Nombrar dónde vive cada uno de los cinco `Size`.** El que no tenga respuesta, sobra.
  - **Conseguir el detach rate** del Button (Figma Library Analytics). Si hay muchas instancias desprendidas, la API no sirve — y eso decide mejor que cualquier opinión.
  - ⚠️ **Targets táctiles:** el mínimo de plataforma es **44×44 iOS / 48×48 Android** con espacio entre ellos, no solo los 24×24 de WCAG 2.2. **Es probable que los dos tamaños menores no cumplan**, lo que zanjaría `Size` sin debate.

  - ✅ **`State` baja de 6 a 5** — `Default`, `Hover`, `Pressed`, `Focus`, `Disabled`. **El equipo prototipa**, así que los estados interactivos se quedan: quitarlos rompería los prototipos. `Focus` no es negociable (WCAG).
  - ✅ **`Loading` sale como variante** (observación del Lead): había **dos mecanismos para lo mismo** —el estado y el slot `iconLoading`— y al entrar en `Loading` **solo aparece el spinner**. Es composición, no estado.
  - ✅ **Los slots de icono bajan de 3 a 2:** `iconLeft` y `iconRight`. `iconLoading` desaparece.
    🔴 **Pero `loading` sigue siendo propiedad en código** — bloquea el clic, anuncia `aria-busy`, no roba el foco. **Va a la documentación como regla explícita**, o Engineering lo implementa a ojo.
    ⚠️ **Riesgo de layout shift:** si el spinner se añade junto al label en un botón sin icono previo, el botón salta al pulsarlo. Decidir antes de documentar: reservar el espacio, o sustituir el label por el spinner.

  - ✅ **`Marketing` conserva `Disabled`.** El Lead confirma el caso: un CTA deshabilitado mientras se validan requisitos, o un botón de campaña apagado al terminar. No bajan las nueve variantes.

  **Matriz:** 205 → 108 (`Size`) → **90** (sin `Loading`) → **60** si sale `Tertiary`. **Reducción del 56% al 70%.**

  - ✅ **`Tertiary` SALE del Button — nace el componente `Link`.** Decidido el 14 ago. El Button queda con `Primary` y `Secondary`. Un link navega, un botón ejecuta: en código son `<a href>` y `<button>`, y con `Tertiary` dentro **el generador produce un `<button>` que navega**, defecto que llega a producción sin que ninguna revisión visual lo detecte.
    *Los iconos refuerzan la separación:* en un link, la flecha significa navegación y el icono de enlace externo (↗) es **requisito de accesibilidad** —WCAG pide advertir cuando se saca al usuario de contexto—. El link necesita documentar qué significa cada icono; el botón no.
    ⚠️ *Declarado antes de decidir:* **separarlo no reduce variantes** —el `Link` se lleva sus 30, el Button queda en 60— **lo que se gana es corrección semántica, no volumen.**

  **Matriz final:** Button **60** · Link **30**.

  ✅ **FASE A EJECUTADA el 17 ago: nace el `Link`.** Button **175 → 120** (`Type: Primary, Secondary`) · `Link` con las 55 `Tertiary`, **conservando las 55 `key`**, así que las instancias siguen ligadas. Snapshot previo en `Later2.0/…/snapshot-button-17ago.md`.
  ✅ **El Lead depuró el `Link` a mano:** borró las **30 de Marketing** —que incluían los 5 `Loading`— y dejó **25**, solo `Product`. *Un link no carga, y si vive en una sola superficie no hay dos que distinguir.* **Nueva matriz del Link: 15** (3 Size × 5 State), no 30.
  🔴 **CORRECCIÓN el 17 ago: `marginLeft`/`marginRight` NO eran márgenes, eran los toggles de icono.** Se borraron por error —el nombre mentía y el ejemplo del análisis, `Academic CapSolid<INSTANCE>`, decía que era un icono—. **Restauradas como `showIconLeft`/`showIconRight`**, y **añadidos `iconLeft`/`iconRight` (INSTANCE_SWAP)**, que era lo que de verdad faltaba. **50/50 instancias conectadas.** El `Link` queda con **7 propiedades que hacen trabajo**.
  🟡 *Defecto anotado:* **cuatro variantes (`XL` y `L` en `Focus` y `Hover`) tienen los iconos DENTRO del frame `Label`**, las otras 21 los tienen fuera. Dos anatomías para el mismo componente. No se tocó —cambia el layout— pero produce auto-layouts distintos en casos que nadie prueba.
  ✅ **API del `Link` limpiada: de 15 propiedades a 3** — `Size`, `State`, `Label`. Se borraron los **9 slots de icono, que no referenciaba ningún nodo**, y `marginLeft`/`marginRight`, sin un solo nodo visible. Se eliminó el eje **`Surface`**, que había quedado con un único valor.
  🟡 *Pendiente de diseño:* **un `iconRight` real** — el icono de enlace externo es requisito de accesibilidad. Y el `Label` aún trae `"Button"` por defecto.
  ✅ **FASE B EJECUTADA el 17 ago, con el Lead dando por resuelto el prerrequisito de instancias.** **Button 120 → 60** · **Link 25 → 15**, ambos con matriz completa y sin huecos. Se fueron 48 de `XL`/`XXL` y 12 de `Loading` en el Button, y 10 de `XL`/`XXL` en el Link. **Recorrido total del Button: 175 → 60, un 66% menos.**
  ✅ **API del Button consolidada el 17 ago: de 16 propiedades a 9.** Cinco de los nueve slots estaban **muertos** —los tres `iconLoading*` murieron con la variante `Loading`, los dos `*Small` nunca controlaron nada—, y los cuatro vivos eran **dos roles partidos por tamaño**: micro en `M`/`S`, mini en `L`. **120 nodos reconectados, cero huérfanos.**
  🟢 **Button y Link quedan con API IDÉNTICA:** `Label` · `showIconLeft` · `showIconRight` · `iconLeft` · `iconRight`. *Quien aprende uno sabe usar el otro.* **Button 60 variantes · Link 15. El Button va de 175 a 60, un 66% menos.**
  *Corregido en el camino:* `iconLeftMini` tenía default `CubeSolid` y `iconRightMini` `Academic Cap` — dos defaults para el mismo rol.
  *Pendiente original, ya resuelto:*
  🔴 **Pendiente en el Button: las 12 propiedades que el `Link` ya no tiene.** Los 9 slots `icon*Micro/Mini/Small` —cuya excusa era tener cinco tamaños, y ahora hay tres— y `marginLeft`/`marginRight`, **que no son márgenes sino los toggles de icono**, igual que en el `Link`. *La vía es la que funcionó allí: crear `iconLeft`/`iconRight`, reconectar y borrar los nueve. Pero en el Button **sí están conectados a nodos**, así que merece su propio análisis, no una réplica a ciegas.*

  🔴 **Prerrequisito para reconstruir: falta el icono de spinner.** Verificado el 14 ago: la librería **sí tiene `Arrow PathOutline` y `Arrow PathSolid`**, pero **un arrow-path no es un spinner**. Las dos flechas en círculo comunican *"recargar / reintentar"* —un icono de **acción**, que invita a pulsarse— mientras el spinner es un **arco incompleto** que comunica *"en proceso"* y no se pulsa. Además, un arrow-path girando **se ve mal por ser simétrico**: el arco incompleto existe justamente para que la rotación sea perceptible.
  *No bloquea el piloto mínimo (solo renombres), sí la reconstrucción.*

  **Falta una sola decisión del Lead:** cómo evitar el salto del botón al aparecer el spinner — reservar el espacio del icono, o sustituir el label. **Decidir antes de documentar**, o cada desarrollador lo resuelve distinto.

  *Los otros puntos siguen en pie:* `marginLeft`/`marginRight` no pertenecen al componente —el espaciado es del contenedor— · falta el botón icon-only y declarar *si* hay icono.

  *Artefactos a producir cuando cierre:* informe de auditoría con hallazgos etiquetados 🔴/🟡/🟢, y la documentación del componente (propósito, anatomía, variantes, estados, do's y don'ts, accesibilidad, contenido) — que es lo que viaja a Supernova y sirve de plantilla para los siguientes lotes.

> ✅ **Alcance del piloto decidido el 14 ago: MÍNIMO.** Solo los renombres, para **probar que la cadena funciona antes de invertir en la reconstrucción**. La auditoría de 2.3 dejó el Button pendiente de reconstruir (de 205 a 60 variantes) y de crear el `Link`; meter eso en el piloto lo convertiría en el proyecto entero.
> **El piloto prueba el pipeline, no el componente.**

- [x] **3.1 · Aplicar los renombres.** ✅ **Aplicado el 14 ago vía `use_figma`** sobre las 175 variantes: `Purpose`→**`Surface`** con valores `Product`/`Marketing` · `On-focus`→**`Focus`** · `M. B. Izquierdo/Derecho`→**`marginLeft`/`marginRight`** · los nueve slots de icono con nombres únicos y coherentes.
  🔴 **La fusión de los nueve slots en tres NO fue posible.** El documento la daba por hecha y era su mayor promesa —bajar la API de 16 a 10—, pero **Figma no fusiona propiedades homónimas dentro de un mismo set**: la fusión ocurre al formar el set desde variantes distintas. **Exige reconstruir el componente.** La API sigue en **16 propiedades**.
  *Deuda declarada:* la escala de los slots (`Micro`/`Mini`/`Small`) sigue sin corresponder con el eje `Size` (`S`–`XXL`). **Se resuelve en la reconstrucción, no aquí.**
  💡 *Hallazgo lateral:* `Button Menu`, `Chip` y `Button Card` usan **`Estado` en español** y también tienen **`On-focus`**. El defecto es de la familia entera — candidatos al siguiente lote.

- [x] **3.6 · Documentar el Button end-to-end con uSpec.** ✅ **Completado el 17 ago.** `3. Entregables/Componentes/button.md` (679 líneas) + **las seis anotaciones en Figma**: `Anatomy` `12232:1737` · `API` `12235:1698` · `Properties` `12236:11098` · `Structure` `12242:1646` · `Color` `12249:1648` · `Screen reader` `12258:2172`. **El circuito quedó probado:** variable en Figma → token en Supernova → especificación en Markdown → anotación visual, con el mismo nombre en los cuatro sitios.

- [x] **3.7 · Mover uSpec fuera del repo del área.** ✅ **CERRADA el 17 ago.** Vive en `2. Proyecto/uSpec/`, y de paso nació el **modelo IPO** como convención del área (`14-organizacion-proyectos.md` (repo de Product Design)). 🟡 **Corrección del Lead el 17 ago.** `components/`, `references/` (644K), `uspecs.config.json` y `.uspec-cache/` viven hoy en el repo de Product Design, que es **el contexto operativo del ÁREA, no el taller de un proyecto**. Destino: dentro de `Later: Brand System`, en `Proyectos/`.

- [x] **3.8 · Traducir la especificación al español.** ✅ **CERRADA el 18 ago**, y no solo el `.md`: **las seis anotaciones se re-renderizaron en español**, con las plantillas ya brandeadas. Se conservan en inglés a propósito los encabezados de columna y los identificadores (`isDisabled`, `size`, `variant`) — la prosa es española, el vocabulario del sistema no se traduce. 🟡 **Corrección del Lead el 17 ago**, y es la **regla 5 de `CLAUDE.md`** que no se consultó. *"Esto no va a ser nada más para ingeniería, sino que también puede ser leído por otras personas de otras áreas."*
  *Criterio:* prosa en español; **en inglés solo lo que rompería la correspondencia con el código** — nombres de propiedad (`isDisabled`), de token (`background/brandMain`), de estado (`hover`, `focus`) y jerga estándar (`aria-busy`, `slot`, `variant`).
  ⚠️ **Verificado qué NO se puede traducir en las plantillas:** las **31 banderas `#`** (todas FRAME, ninguna es texto) y **los `{marcadores}`** —`{property}`, `{value}`, `{notes}`— que **parecen etiquetas y son huecos de sustitución**. Las seis etiquetas fijas (`Property`, `Required`, `Notes`…) sí son traducibles, pero **algunas skills escriben contenido en inglés** (`Yes`/`No`), así que traducir la plantilla no basta.
  *Recomendación: traducir solo el `.md` —riesgo cero, y de ahí sale la mayor parte de la prosa visible— y dejar la plantilla en inglés.*
  *El re-render posterior es la **segunda prueba**: valida que el flujo es reproducible desde otra ubicación y en otro idioma, antes del lote de diez.*

- [x] **3.9 · El pipeline de uSpec no documenta el modo oscuro.** ✅ **CERRADA el 19 ago por decisión del Lead: no se va a documentar.**
  **Supernova ya es la fuente de verdad y resuelve el alias por theme** —verificado el 17 ago—, así que documentar el modo oscuro también en Figma es **doble trabajo sobre un dato que la fuente de verdad ya entrega**.
  **Lo único que se representa en oscuro son los ejemplos visuales**, y para eso no hace falta pipeline: la **propiedad de apariencia** de Figma fija el mode de un lienzo. El Lead ya duplicó las plantillas de la página `Button` con esa propiedad activada.
  💡 **La regla que deja:** *si la fuente de verdad ya entrega el dato, la documentación visual no lo repite — lo ilustra.* Un valor duplicado en dos sitios se desincroniza.
  *El arreglo manual de las 72 celdas del 17 ago queda como excepción, no como flujo.*

- [x] **3.10 · Las siete plantillas de uSpec, listas y fuera de la librería.** ✅ **CERRADA el 18 ago.**
  **Personalizadas** con el brand system (158 valores ligados) y **verificadas: cero textos por debajo de 3:1.** Colores crudos restantes, todos justificados — la simbología de easing (`#0A5DB3` bezier, `#10723A` linear, `#6852CB` hold) y los dos rojos del **logotipo** que añadió el Lead, que es una instancia del componente de marca y no se liga a tokens.
  🔴 **Tres fallos el mismo día, todos de la misma causa:** personalizar mirando el **nombre** de la capa en vez de lo que hay debajo. `#header-row` recibió la regla de `#header` por parecido de prefijo · el banner de `Motion` **no se llama `#header` sino `Title`** y quedó negro · seis textos en `Static` sobre fondo blanco, invisibles. *Las banderas `#` de uSpec son direcciones, no una taxonomía.*
  **Ocultas de la librería con prefijo `.`**, verificado antes de aplicarlo: **el punto no cambia la `key`** y el pipeline busca por key, nunca por nombre.
  *Trampas y verificación reutilizable:* `2. Proyecto/uSpec/ENCARGOS-DE-RENDER.md`
- [ ] **3.2 · Republicar la librería en Figma.**
- [ ] **3.3 · Re-importar en Supernova** (`autoImportMode: Never` — no se sincroniza solo).
- [x] **3.4 · Verificar el resultado.** ✅ **Verificado por MCP el 17 ago, varias veces a lo largo del día.** ⚠️ *El criterio original de esta tarea quedó obsoleto: decía "la propiedad aparece como `Purpose` y los slots de icono son tres". Hoy la propiedad es **`Surface`** —`Purpose` era el nombre viejo— y **los slots son dos**, `iconLeft` e `iconRight`, tras consolidar los nueve.*
  **Lo verificado de verdad:** los 25 renombres · las descripciones · los alias por mode (Supernova **sí resuelve el alias por theme**) · las tintas de sombra · y que **renombrar NO deja huérfanos** — el token conserva su ID.
- [ ] **3.5 · Si sale limpio, arrancar lotes de diez componentes** — construir, documentar, sincronizar.

---

## BLOQUE 4 — El resto de los componentes ⚪

- [x] **4.1 · Alinear `Button Menu`, `Chip` y `Button Card` a la convención.** ✅ **CERRADA el 19 ago.** Los tres arrastraban más deuda que el `Estado` en español: **nombres de propiedad con espacios** —`Change Icon`, `Icon left`, `Label Industria`— y **`On-focus` con guion**, ambos prohibidos por la sección 2 de la convención.
  **Nueve propiedades y 45 variantes reescritas:** `Estado`→`state` (los tres) · `Shape`→`shape` · `Change Icon`→`icon` · `Label`→`label` · `Icon left`→`showIconLeft` · `Icon`→`iconLeft` · `Label Industria`→`label`. Valores a minúsculas y **`On-focus`→`focus`**.
  🟢 **`Chip` queda alineado con `Button` y `Link`:** `showIconLeft` + `iconLeft` es el mismo par que ya usan los otros dos.
  ⚠️ **Límite declarado sobre la verificación:** en este archivo **no hay una sola instancia** de los tres. No es que el renombre no las tocara — **es que no existen aquí**: las páginas de Organisms (`Navigation`, `Filter`, `Widgets`) están **vacías**, verificado cargándolas. La única página con contenido tiene 530 instancias y ninguna es de estos tres. **Si se usan, es en los archivos de producto, que no son este.**
  *La colisión `Alerta`/`Alerts` que daba nombre a esta tarea no apareció en el inventario de la página: los cinco sets son `Button Menu`, `Chip`, `Button Card`, `Button` y `Link`.*

- [x] **4.8 · Terminar el swap de Heroicons a Phosphor.** ✅ **CERRADA el 19 ago: 591 instancias migradas en once páginas, y el resto del archivo verificado.**

  | Página | Instancias | Página | Instancias |
  | --- | --- | --- | --- |
  | `Tag` | 174 | `Alerts` | 30 |
  | `Button` | 115 | `Select` | 26 |
  | `Table` | 83 | `Tabs` | 10 |
  | `Steps` | 69 | `Cards (WIP)` | 8 |
  | `Input Field` | 48 | | |
  | `Thumbnails` | 28 | | |

  **Verificadas sin Heroicons restantes:** las once anteriores más `Accordion`, `Avatar`, `Banners`, `Checkbox`, `Datepicker`, `Dialog Box`, `Empty state`, `File upload`, `Login & SL`, `Notification`, `Playground`, `Progress & Slides`, `Toggle`, `Tooltips`, `Widgets` y `_Local Componentes`.
  ✅ **Barrido completo.** Se revisaron también `Radio Button`, `Divider`, `Skeleton`, `App Icon`, `Biometrics`, `Data Visualization`, `Color`, `Ilustraciones` y `Logos`: **ninguna sostiene un solo Heroicon.**
  🟢 **Y el criterio de completitud lo afinó el Lead:** no es *"nombre que acaba en Solid"* sino **"componente huérfano"** — más fiable, porque un icono renombrado se escaparía del filtro por nombre y un activo propio se marcaría por error. *Re-verificadas con ese criterio, `Button` y `Tag` salen limpias de Heroicons.*
  ⏭️ **El Brand Book queda FUERA DE ALCANCE por decisión del Lead.** Conserva **68 iconos** — es el muestrario de la librería anterior— pero **todo su contenido se migra a Supernova manualmente**, así que no tiene sentido migrarlo aquí.
  ⚠️ **Consecuencia: los Heroicons huérfanos no se pueden borrar del archivo todavía**, porque el muestrario del Brand Book los sostiene. *Deja de ser un bloqueo en cuanto esa migración ocurra.*
  🟡 **Dos activos propios siguen huérfanos a propósito:** `logo-hundred-bricksSolid` (7) e `Industrias illustration` (10). **No son de la librería de terceros** — viven en el laboratorio de iconos y se reincorporan aparte.

  **El diccionario de equivalencias quedó levantado** —unos 50 iconos, con alias `Chevron`→`Caret`, `X Mark`→`X`, `Ellipsis`→`DotsThree`, `Banknotes`→`Money`, `Adjustaments Vertical`→`Faders`— y el script de swap **reporta lo que no reconoce en vez de saltárselo en silencio**. *Así apareció `Chart BarSolid`, que no estaba en el mapa inicial.*

  > ⚠️ **El procedimiento tiene dos trampas, ambas verificadas con un canario:**
  > **1. `swapComponent` NO conserva el tamaño.** La instancia adopta el del componente nuevo, y Phosphor viene a **32×32** — un icono de 20 px salta a 32. *El canario lo detectó antes de tocar 486 instancias.*
  > **2. El cambio se propaga en cascada.** Al cambiar una instancia dentro de un component set, las que la heredan se actualizan solas **y pierden su tamaño antes de que el bucle llegue a ellas.**
  >
  > **El método que funciona: fotografiar TODAS las medidas antes del primer swap, cambiar, y restaurar desde esa foto.** Medir sobre la marcha llega tarde.

- [x] **4.9 · Decidir el volumen del catálogo de iconos.** ✅ **CERRADA el 19 ago, y sin necesidad de recortar nada.**
  ✅ **Supernova cuenta un component set como UN componente, no como sus variantes.** Verificado sobre los iconos **ya importados**: `Acorn`, `AddressBook`, `Airplane`… aparecen con `variantCount: 12, propertyCount: 2`. **Son 1512 componentes, no 18 100.**
  *La preocupación por el volumen aplicaba aritmética de Figma a un modelo que no funciona así — y el dato estaba disponible sin publicar nada, en lo ya importado.*
  ✅ **Verificado en la documentación:** el **bloque de documentación permite elegir qué variantes mostrar** (feature de marzo 2025); **la importación no tiene filtro por variante** —solo el scope de Componentes de un archivo entero— y **Supernova solo importa lo publicado en Figma**.
  ✅ **Comprobado por el Lead en la app:** la sección **Variants** de la plantilla de documentación **deja elegir qué variantes se muestran**. Se añadieron solo las de `Format=Outline` con sus weights. **El filtro funciona.**
  🟢 **El principio que lo cierra, del Lead:** ***Figma es el taller y Supernova es la vitrina.*** Que el archivo de diseño conserve herramientas que la documentación no muestra **no es duplicación: la documentación no es un espejo del archivo, es una selección.** *Es la misma razón por la que las plantillas de uSpec llevan punto.*
  ✅ **Nada se borra.** Los seis `Weight` se conservan hasta tener un caso real, y **`Format=Stroke` también**: es la fuente editable (`Raw`), el equipo no usa el plugin —así que es su única copia— y **ni el volumen ni la documentación son ya argumento para quitarla.**
  *El deber ser del mantenimiento, para retomar con la PD Jr: `../Diagnóstico/mantenimiento-de-iconos.md`*

- [ ] **4.10 · Documentar el modo oscuro con frames de Figma, no con PNG.** ⚪ **Nace el 19 ago, y es el cierre práctico de 3.9.**
  **El problema:** Supernova **resuelve tokens por theme pero no re-renderiza componentes** — el bloque muestra lo que hay en Figma. *Lo único oscurecible es el fondo del contenedor, que dejaría el render en Light sobre fondo oscuro: peor que no hacerlo.*
  **La salida, propuesta por el Lead:** después de documentar en Light, **duplicar las muestras en Figma y cambiarles el mode con la propiedad de apariencia**, y llevar esa área a Supernova.
  🟢 **Mejora verificada sobre la idea original:** en vez de pegar un **PNG** —que es estático y miente en silencio en cuanto el componente cambia— usar el **bloque de imagen de Figma pegando la URL del frame**. *"Cuando la fuente de Figma se actualiza en Supernova, tus imágenes se actualizan automáticamente."* **Mismo resultado visual, con vínculo vivo y coste cero por cambio.**
  💡 **Alcance sugerido: una sola muestra en oscuro por componente, no una por anotación.** `API`, `Structure` y `Screen reader` son tablas, y una tabla no cambia con el mode. *La tabla de `Color` ya trae los dos valores desde el 17 ago.*
  *Done:* el `Button` con su muestra en oscuro publicada desde un frame de Figma, y el paso incorporado al flujo de documentación.

- [ ] **4.7 · `PhoneSolid` en `size=l` mide 19×20, no 24×24.** ⚪ **Encontrado el 19 ago al unificar la escala de tamaños** — los otros 326 iconos son exactos en las tres tallas. **Es geometría, no nomenclatura:** cambiar el tamaño puede mover el layout donde el icono se use, así que quedó fuera del lote de renombres.
  *Done:* medido a 24×24 y revisadas sus instancias.

- [ ] **4.2 · Consolidar iconos:** fusionar Solid y Outline en un set con propiedad. Son 309 Outline y 327 Solid, el 78% de los componentes root.
  ✅ **Parcialmente avanzada el 19 ago: el eje quedó unificado.** Los 327 sets tienen hoy **firma idéntica — `size=l|m|s`** — con `s`=16px, `m`=20px y `l`=24px, en lugar de `Size=micro|mini|small`. *Lo que sigue abierto es el defecto estructural de abajo, que es lo caro.*
  🔴 **Auditado el 17 ago, y el defecto es estructural, no solo de organización:** los **327 `Solid` son COMPONENT_SET con eje `Size` = `micro | mini | small`** y **firma idéntica los 327**; los **309 `Outline` son componentes SUELTOS, sin eje de tamaño**. **El mismo icono se comporta distinto según su estilo**, y por eso **intercambiar un Solid por un Outline cambia la forma del componente**, no solo el dibujo. Hay además **18 iconos de diferencia** entre las dos familias.
  *Consecuencia para el swap:* cualquier componente con slot de icono —el Button y los que vengan— hereda esa inconsistencia.
  ⚠️ **Documentar los iconos con uSpec va DESPUÉS de esto, no antes:** documentar ahora sería fotografiar el defecto. Y no se documentan los 636 uno por uno — se documenta **el patrón**, con un icono representativo.
  *Nota de arquitectura:* uSpec clasificó el icono como **`referenced`**, no constitutivo, así que **la especificación del Button está completa sin él** — documenta qué le pasa al icono, no qué es. El hueco real es que `./academic-capsolid.md` no existe.

- [x] **4.6 · Alinear a `camelCase` los ejes y valores del Button y el Link.** ✅ **CERRADA el 19 ago.** Los cuatro ejes y sus valores, en los dos componentes: `Size`→`size` · `Surface`→`surface` · `Type`→`type` · `State`→`state` · `Label`→`label`, y los valores `Primary`→`primary`, `Marketing`→`marketing`, `Default`→`default`… **75 variantes reescritas.**
  🟢 **Verificado con un canario antes del lote:** se renombró **un solo eje** y se midieron las 136 instancias de la página antes y después. **Cero desprendidas, cero sin valor, cero que cambiaran de valor** — la clave pasa de `Size` a `size` en cada instancia y conserva su `S`/`M`/`L`. *Renombrar una propiedad de variante propaga limpio; el lote se aplicó solo después de comprobarlo.*
  ⚠️ **Divergencia que queda abierta:** la especificación (`button.md`) llama `variant` a lo que Figma ahora llama `type`, y descompone `state` en `isDisabled`/`isLoading`. **La convención pide una sola forma de escribir en Figma y en código.** Hay que decidir cuál gana — no se resuelve renombrando a ciegas.

- [x] **4.5 · Renombrar las capas internas del Button.** ✅ **CERRADA el 19 ago, en la misma pasada que 4.6.** **225 capas renombradas** —75 `label`, 75 `iconLeft`, 75 `iconRight`— **identificadas por su `componentPropertyReferences`, no por posición ni por nombre.** Es el método que no adivina: cada capa se reconoce por la propiedad a la que está ligada.
  🔴 **Y destapó un defecto de la misma familia:** el frame contenedor se llamaba **`Label`** y el texto dentro **`label`** — **dos capas que difieren solo en una mayúscula**, exactamente la ambigüedad que rompió las skills de voz y anatomía. Renombrados los frames estructurales: `Label`→`labelBox` (75) y `Content`→`content` (60).
  **Inventario final de capas en los 75 variantes: seis nombres, todos inequívocos** — `content`, `labelBox`, `label`, `iconLeft`, `iconRight` y `Vector` (interno de los iconos, no controlable desde aquí).
  💡 *Lección: el objetivo no era "poner nombres bonitos" sino que **ninguna herramienta que busque por nombre pueda equivocarse**. Un renombrado que deja `Label` y `label` conviviendo no cumple ese criterio.*

- [ ] **4.4 · Tokenizar los tamaños de elemento del sistema.** Pendiente de la **fase de construcción**, no de foundations.
  *El criterio:* **si el valor lo decide el layout, no se tokeniza; si lo decide el sistema, sí.** Un card no mide 240px porque 240 esté en una escala — mide lo que le toca en su columna. Pero un icono que mide 22 en una pantalla y 24 en otra es un defecto.
  *Qué sí entra:* iconos (16/20/24/32) · avatares (24/32/40/48) · altura de controles por `Size` · anchos fijos de sidebar o modal.
  *Aliasan a `unit`* — son puntos de escala compartida, así que no hace falta una escala nueva, solo una capa semántica sobre la que ya existe. Coherente con la regla de `estado-del-proyecto.md`.
  *Aquí es donde se usa el scope **Width and height*** → produce tokens de tipo `Size` en Supernova, hoy vacío.
  *Requiere 1.13 hecho* — el prefijo `size/` debe estar libre.
  *Nota del Lead (14 ago):* al asignar scopes aparecieron alcances de Figma sin variables asociadas. Se revisan aquí, no en foundations.

- [ ] **4.3 · Gobernar los 183 componentes no-icono**, por lotes de diez tras el piloto.

---

## BLOQUE 5 — Hitos 2 y 3

- [ ] **5.1 · Documentar la fuente de verdad en Supernova** con profundidad, no solo poblarla.
  *Restricción:* el MCP de Supernova es de **solo lectura** — poblar es trabajo manual.
- [ ] **5.2 · Capacitar a los tres equipos que operan el sistema:** diseño de Marketing, Product Design e Engineering.
  *No es adorno:* la Fase 1 terminó con activos sin ruta de adopción, y ese es el riesgo declarado del proyecto (R-6).

---

## Fuera de este plan

- **Voz y tono:** las cuatro decisiones abiertas son de **Brand, no de Product Design**. Ver `estado-del-proyecto.md`.
- **Distribución a entornos de consumo** (WebApp, Admin, Hubspot, Webflow) y gestión de versiones: fase posterior, fecha TBD.
- **La capa de consumo en código:** la auditoría entrega el requisito para desarrollo, no la implementación. Decisión 8 del 13 ago.
