Esta lista reúne todos los componentes del sistema Later con el estado en que se encuentra cada uno. Es el punto de entrada: desde aquí se llega a la documentación de un componente, a su archivo en Figma y, cuando exista, a su implementación en código.

**La lista no es el catálogo de lo que está listo para usar.** Es el catálogo completo, con la verdad de cada pieza puesta al lado. La columna de estado dice cuál es cuál, para que la decisión de usarlo o no se tome con el dato delante y no por el hecho de que aparezca en una tabla.

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

## En qué orden llegan los que faltan

**Esta tabla es la cola de producción.** Conforme un componente se documenta, **sale de aquí y aparece arriba en la lista**, con su estado. *La tabla se vacía hacia la lista.*

**El orden es por esfuerzo, de menor a mayor** — lo barato primero, para que el sistema empiece a servir antes.

| # | Componente | En Figma | Por qué está ahí | Qué resolver antes |
|---|---|---|---|---|
| **1** | **Link** | `Link` | Recién separado del Button: hereda tipografía y color, y su razón de existir ya está escrita | — |
| **2** | **Divider** | `Divider` | Geometría trivial: un token de color y uno de grosor | Su página se declaró vacía el 19 ago y no se ha reverificado |
| **3** | **Avatar** | `Avatar` | Matriz limpia y cerrada: 6 tallas × 2 tipos, sin defectos | — |
| **4** | **Tag** | `Tag` | Ya migrado a Phosphor, con **174 instancias** en uso | Sus variantes no están medidas |
| **5** | **Switch** | ⚠️ **`Toggle`** | Matriz completa y coherente — 20 variantes | Depende del token `size/indicator`, que no existe |
| **6** | **Check** y **Radio** | ⚠️ **`Checkbox`** y **`RadioButton`** | Van juntos: comparten indicador y el patrón «con Label» | El mismo token `size/indicator`. Quien los reconstruya lo crea |
| **7** | **Banner** · **System banner** · **Snackbar** · **Toast** | ⚠️ **`Alerts`** — una sola pieza de 30 variantes | El sidebar los separa en cuatro; en Figma son uno | **Decidir si son cuatro componentes o uno.** Arrastra el residuo `Alerta` |
| **8** | **Text field** | ⚠️ **`inputText`** | No es documentar, es **reconstruir**: caja de 40 px fuera de la escala | Cuatro defectos simultáneos |
| **9** | El resto del catálogo — **44 componentes** | varios | Piezas no medidas todavía: `Accordion`, `Card`, `Modal`, `Tooltip`, `Pagination`, las de navegación y las de datos | **No hay medición de esfuerzo.** Entran por lotes tras los ocho de arriba |

🔴 **Los nombres del sidebar y los de Figma no siempre coinciden**, y la columna «En Figma» lo declara con ⚠️. *Un componente que en la documentación se llama `Text field` y en la librería `inputText` es el mismo, pero nadie lo sabe sin este mapa.* **Unificarlos es trabajo aparte, y conviene hacerlo antes de documentar cada pieza.**

⚠️ **El segundo criterio acordado, «mayor a menor uso», no está aplicado, y conviene decirlo:** hoy **no existe instrumento para medir cuánto se usa cada componente** en producto. Donde hay indicio real —como las 174 instancias de `Tag`— va anotado. *El día que haya medición, este orden se revisa.*

## Si el componente que buscas no está, o su estado no te sirve

| Situación | Qué hacer |
|---|---|
| **No está, o está sin estado** | Úsalo desde Figma sabiendo que su comportamiento no está garantizado por escrito — y **avísanos: lo que se pide se adelanta** |
| **Está en Known issues y el defecto te bloquea** | Dilo antes de resolverlo por tu cuenta. Un arreglo local se vuelve una diferencia permanente; el mismo arreglo en el componente lo hereda todo el producto |
| **Necesitas uno que no existe** | Pregunta antes de crearlo. La mayoría de las piezas nuevas resultan ser una variante de algo que ya está aquí — y una variante cuesta una fracción de lo que cuesta un componente nuevo, que hay que mantener para siempre |

Para cualquiera de los tres, escríbenos en Slack a **#frontend-and-design**.
