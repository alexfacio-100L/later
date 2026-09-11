Esta lista reúne todos los componentes del sistema Later con el estado en que se encuentra cada uno. Es el punto de entrada: desde aquí se llega a la documentación de un componente, a su archivo en Figma y, cuando exista, a su implementación en código.

**La lista no es el catálogo de lo que está listo para usar.** Es el catálogo completo, con la verdad de cada pieza puesta al lado. La columna de estado dice cuál es cuál, para que la decisión de usarlo o no se tome con el dato delante y no por el hecho de que aparezca en una tabla.

**Un componente aquí es una pieza con contrato**, no un dibujo reutilizable: tiene un comportamiento decidido, unos estados que alguien pensó, un nombre que significa lo mismo en diseño y en código, y un dueño que responde cuando falla. *Mientras no tenga eso, es una forma que se parece a otras formas.*

<SNCallout type="Info">
**Antes de crear una pieza nueva, busca aquí.** La mayoría de las necesidades nuevas resultan ser una variante de algo que ya existe — y una variante cuesta una fracción de lo que cuesta un componente, que hay que mantener para siempre.
</SNCallout>

## Qué dice cada estado

| Estado | Qué significa | Qué puedes hacer |
|---|---|---|
| **Healthy** | Pasó la revisión completa | Construir sobre él sin preguntar |
| **Known issues** | Usable, con defectos conocidos y anotados | Léelos antes de usarlo |
| **Deprecated** | No usar en trabajo nuevo | Su página indica qué lo sustituye |
| **Sin estado** | Existe en Figma, no ha pasado la revisión | Mirarlo, no darlo por garantizado |

**Sin estado no es descartado ni abandonado:** es un componente al que aún no le ha llegado su turno. El orden en que llegan está más abajo.

**Deprecated sigue publicado** porque hay producto que lo usa, no porque siga siendo la respuesta.

## Qué se garantiza cuando un componente está listo

Un componente no se documenta hasta que está cerrado. **Healthy quiere decir que cumple las seis:**

| | Garantía |
|---|---|
| **1** | **No hay valores sueltos.** Todo color, medida y espaciado está enlazado a un token sano. Si el sistema cambia, el componente hereda el cambio |
| **2** | **El contraste está verificado sobre las combinaciones reales**, no sobre pares teóricos, y en los dos modos |
| **3** | **Tiene su propia capa de tokens.** Corregirlo no mueve a los demás; corregir el sistema sí llega hasta él |
| **4** | **Lo que Figma no puede dibujar está escrito.** Carga, foco, deshabilitado, comportamiento al pulsar |
| **5** | **La accesibilidad está resuelta más allá del color:** foco visible, orden de tabulación y nombre accesible |
| **6** | **Se validó en uso**, montado junto a otros componentes, no solo medido pieza por pieza |

## Qué hay construido y qué no

**La lista de arriba dice tres cosas a la vez**, y conviene leerlas por separado:

| | Cuántos | Qué significa |
|---|---|---|
| **Construidos en Figma** | **16** | Existen como pieza. Lo que falta es revisarlos y documentarlos |
| **Sin construir** | **41** | No existen todavía. Documentarlos no es documentar: es construirlos primero |
| **Documentados** | **1** | Han pasado la revisión completa y se pueden dar por ciertos |

**Un componente que aparece en la lista sin estado y sin pieza en Figma es una intención, no un activo.** *Está aquí porque el sistema lo necesita, no porque exista.*

## En qué orden llegan

**Primero los que ya existen**, porque revisar cuesta menos que construir y el sistema empieza a servir antes.

| # | Componente | En Figma | Por qué está ahí | Qué resolver antes |
|---|---|---|---|---|
| **1** | **Link** | `Link` | Recién separado del Button: hereda tipografía y color | — |
| **2** | **Tag** | `Tag` | Migrado a Phosphor, con **174 instancias** en uso | Sus variantes no están medidas |
| **3** | **Switch** | ⚠️ `Toggle` | Matriz completa y coherente — 20 variantes | Depende del token `size/indicator`, que no existe |
| **4** | **Check** y **Radio** | ⚠️ `Checkbox` · `RadioButton` | Comparten indicador y el patrón «con Label» | El mismo token `size/indicator` |
| **5** | **Select** · **Tabs** · **Card** · **Tooltip** · **Segment control** | varios | Construidos y sin medir | **Sin auditar.** Entran tras una revisión de su matriz |
| **6** | **Side navigation** · **Top navigation** | varios | Construidos; son compuestos, no átomos | Dependen de que los átomos estén cerrados |
| **7** | **Banner** · **Toast** | ⚠️ `Alerts` — **una pieza de 30 variantes** | El sidebar los separa; Figma los tiene juntos | 🔴 **Decidir si son piezas distintas o una sola** |
| **8** | **Text field** | ⚠️ `inputText` | No es documentar, es **reconstruir**: caja de 40 px fuera de la escala | Cuatro defectos simultáneos |
| **9** | Los **41 sin construir** | — | Desde `Divider` y `Avatar` hasta `Data table` y `Charts` | **Construirlos.** El orden se define cuando se audite lo de arriba |

⚠️ **Y hay una tercera categoría que no es ni «mejorar» ni «construir»: piezas cuya construcción hay que cuestionar antes de tocarlas.** *`Text field` es el caso claro —reconstruir sale más barato que corregir—, y `Banner`/`Toast` es una decisión de arquitectura, no de dibujo.* **Documentar una pieza mal construida la convierte en norma.**

⚠️ **El criterio acordado de «mayor a menor uso» sigue sin aplicarse:** hoy **no existe instrumento para medir cuánto se usa cada componente** en producto. Donde hay indicio real —las 174 instancias de `Tag`— va anotado. *El día que haya medición, este orden se revisa.*

## Si el componente que buscas no está, o su estado no te sirve

| Situación | Qué hacer |
|---|---|
| **No está, o está sin estado** | Úsalo desde Figma sabiendo que su comportamiento no está garantizado por escrito — y **avísanos: lo que se pide se adelanta** |
| **Está en Known issues y el defecto te bloquea** | Dilo antes de resolverlo por tu cuenta. Un arreglo local se vuelve una diferencia permanente; el mismo arreglo en el componente lo hereda todo el producto |
| **Necesitas uno que no existe** | Pregunta antes de crearlo. La mayoría de las piezas nuevas resultan ser una variante de algo que ya está aquí — y una variante cuesta una fracción de lo que cuesta un componente nuevo, que hay que mantener para siempre |

Para cualquiera de los tres, escríbenos en Slack a **#frontend-and-design**.
