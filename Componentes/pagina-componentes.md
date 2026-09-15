Later tiene estos componentes, cada uno con su estado. Desde cada fila llegas a su documentación, a su archivo de Figma y, cuando exista, a su código.

La lista incluye todo, no solo lo que está listo. Mira la columna **Estado** antes de usar un componente. Aparecer en la lista no garantiza nada.

Un **componente** es una pieza con contrato, no un dibujo reutilizable. Tiene comportamiento decidido, estados pensados, un nombre igual en diseño y en código, y un dueño que responde cuando falla. Sin eso es solo una forma.

<SNCallout type="Info">
Busca en la lista antes de crear una pieza nueva. La mayoría de las necesidades resultan ser una variante de algo que ya existe. Una variante cuesta mucho menos que un **componente**, que hay que mantener para siempre.
</SNCallout>

## Qué dice cada estado

| Estado | Qué significa | Qué puedes hacer |
|---|---|---|
| **Healthy** | Pasó la revisión completa | Construir sobre él sin preguntar |
| **Known issues** | Usable, con defectos conocidos y anotados | Léelos antes de usarlo |
| **Deprecated** | No usar en trabajo nuevo | Su página indica qué lo sustituye |
| **Sin estado** | Existe en Figma, no ha pasado la revisión | Mirarlo, no darlo por garantizado |

**Sin estado** no significa descartado. Significa que aún no le ha llegado su turno. Consulta «En qué orden llegan».

**Deprecated** sigue publicado porque hay producto que lo usa. No porque siga siendo la respuesta.

## Qué se garantiza cuando un componente está listo

No documentamos un componente antes de cerrarlo. **Healthy** significa que cumple las siete.

| | Garantía |
|---|---|
| **1** | **No hay valores sueltos.** Todo color, medida y espaciado está enlazado a un token sano. Si el sistema cambia, el componente hereda el cambio |
| **2** | **El contraste está verificado sobre las combinaciones reales**, no sobre pares teóricos, y en los dos modos |
| **3** | **Tiene su propia capa de tokens.** Corregirlo no mueve a los demás; corregir el sistema sí llega hasta él |
| **4** | **Lo que Figma no puede dibujar está escrito.** Carga, foco, deshabilitado, comportamiento al pulsar |
| **5** | **La accesibilidad está resuelta más allá del color:** foco visible, orden de tabulación y nombre accesible |
| **6** | **Se validó en uso**, montado junto a otros componentes, no solo medido pieza por pieza |
| **7** | **La documentación está fresca y completa.** Ninguna imagen publicada corresponde a una versión vieja del componente, ningún par de color incumple, y ningún bloque quedó colocado sin configurar |

Las seis primeras certifican el **componente**. La séptima certifica su documentación. Una página puede estar publicada y servir imágenes de una versión anterior. No da error y se ve bien.

### Healthy no significa que exista en código

Lo produce **Ingeniería** en Bricks UI. Hasta entonces la documentación describe una intención, no algo que puedas instalar.

Consulta la tabla **Dónde está disponible** de cada componente. Son seis plataformas fijas con su estado real. Un componente no está disponible en una plataforma hasta que está producido ahí. Si dice «Pendiente de verificar», nadie lo ha comprobado todavía.

## Qué hay construido y qué no

La lista mezcla tres cosas. **Léelas por separado:**

| | Cuántos | Qué significa |
|---|---|---|
| **Construidos en Figma** | **16** | Existen como pieza. Lo que falta es revisarlos y documentarlos |
| **Sin construir** | **41** | No existen todavía. Documentarlos no es documentar: es construirlos primero |
| **Documentados** | **1** | Han pasado la revisión completa y se pueden dar por ciertos |

Un componente sin estado y sin pieza en Figma es una **intención**, no un activo. Está en la lista porque el sistema lo necesita, no porque exista.

## En qué orden llegan

Primero van los que **ya existen**. Revisar cuesta menos que construir. El sistema empieza a servir antes.

| # | Componente | En Figma | Por qué está ahí | Qué resolver antes |
|---|---|---|---|---|
| **1** | **Link** | `Link` | Recién separado del Button: hereda tipografía y color | — |
| **2** | **Tag** | `Tag` | Migrado a Phosphor, con **174 instancias** en uso | Sus variantes no están medidas |
| **3** | **Switch** | ⚠️ `Toggle` | Matriz completa y coherente: 20 variantes | Depende del token `size/indicator`, que no existe |
| **4** | **Check** y **Radio** | ⚠️ `Checkbox` · `RadioButton` | Comparten indicador y el patrón «con Label» | El mismo token `size/indicator` |
| **5** | **Select** · **Tabs** · **Card** · **Tooltip** · **Segment control** | varios | Construidos y sin medir | **Sin auditar.** Entran tras una revisión de su matriz |
| **6** | **Side navigation** · **Top navigation** | varios | Construidos; son compuestos, no átomos | Dependen de que los átomos estén cerrados |
| **7** | **Banner** · **Toast** | ⚠️ `Alerts`, **una pieza de 30 variantes** | El sidebar los separa; Figma los tiene juntos | 🔴 **Decidir si son piezas distintas o una sola** |
| **8** | **Text field** | ⚠️ `inputText` | No es documentar, es **reconstruir**: caja de 40 px fuera de la escala | Cuatro defectos simultáneos |
| **9** | Los **41 sin construir** | — | Desde `Divider` y `Avatar` hasta `Data table` y `Charts` | **Construirlos.** El orden se define cuando se audite lo de arriba |

Hay una tercera categoría: piezas que hay que **cuestionar** antes de tocarlas. En `Text field` reconstruir sale más barato que corregir. En `Banner` y `Toast` la decisión es de arquitectura, no de dibujo. Documentar una pieza mal construida la convierte en norma.

El criterio de «mayor a menor uso» sigue **sin aplicarse**. No existe instrumento para medir el uso real en producto. Donde hay indicio, como las 174 instancias de `Tag`, va anotado. El orden se revisa cuando haya medición.

## Si el componente que buscas no está, o su estado no te sirve

| Situación | Qué hacer |
|---|---|
| **No está, o está sin estado** | Úsalo desde Figma. Su comportamiento no está garantizado por escrito. **Avísanos:** lo que se pide se adelanta |
| **Está en Known issues y el defecto te bloquea** | Dilo antes de resolverlo por tu cuenta. Un arreglo local se vuelve una diferencia permanente. El mismo arreglo en el componente lo hereda todo el producto |
| **Necesitas uno que no existe** | Pregunta antes de crearlo. La mayoría resultan ser una variante de algo que ya existe. Una variante cuesta mucho menos que un componente nuevo |

Para cualquiera de los tres, escríbenos en Slack a **#frontend-and-design**.
