Esta lista reúne todos los componentes del sistema Later con el estado en que se encuentra cada uno. Es el punto de entrada: desde aquí se llega a la documentación de un componente, a su archivo en Figma y, cuando exista, a su implementación en código.

**La lista no es el catálogo de lo que está listo para usar.** Es el catálogo completo, con la verdad de cada pieza puesta al lado. Un componente puede estar construido en Figma y todavía no tener documentación; puede tener documentación y defectos conocidos. La columna de estado dice cuál es cuál, para que la decisión de usarlo o no se tome con el dato delante y no por el hecho de que aparezca en una tabla.

## Qué dice cada estado

**Healthy.** El componente pasó la revisión completa: su color y sus medidas están enlazados al sistema de tokens, el contraste de sus combinaciones reales se verificó en modo claro y oscuro, sus estados y su comportamiento están decididos y escritos, y se validó viéndolo en uso, no solo medido en aislamiento. Se puede construir sobre él.

**Known issues.** El componente es usable, pero se conocen defectos y están anotados en su documentación. Léela antes de usarlo: la diferencia entre un defecto conocido y uno oculto es que del primero se sabe cómo esquivarlo.

**Deprecated.** No usar en trabajo nuevo. Su documentación indica qué lo sustituye. Sigue publicado porque hay producto que lo usa, no porque siga siendo la respuesta.

**Sin estado.** El componente existe en la librería de Figma, pero todavía no ha pasado la revisión. No es un componente descartado ni abandonado: es uno al que aún no le ha llegado su turno. Se puede mirar; no se puede dar por garantizado.

## Qué se garantiza cuando un componente está listo

Un componente no se documenta hasta que está cerrado. Antes de que se escriba la primera línea de su página tiene que cumplir esto:

- **No hay valores sueltos.** Todo color, medida y espaciado del componente está enlazado a un token del sistema, y ese token es sano. Si el sistema cambia, el componente hereda el cambio.
- **El contraste está verificado sobre las combinaciones reales**, no sobre pares teóricos, y en los dos modos.
- **El componente tiene su propia capa de tokens.** Corregir este componente no mueve a los demás; corregir el sistema sí llega hasta aquí.
- **Los estados que Figma no puede dibujar están escritos.** Carga, foco, deshabilitado, comportamiento al pulsar: lo que no se ve en el archivo se lee en la documentación.
- **La accesibilidad está resuelta más allá del color:** foco visible, orden de tabulación y nombre accesible.
- **Se validó en uso**, montado junto a otros componentes y en los dos modos, no solo medido pieza por pieza.

Un componente marcado **Healthy** cumple las seis. Es lo que se puede dar por cierto sin preguntar.

## Si el componente que buscas no está, o su estado no te sirve

**No está en la lista, o está sin estado.** Existe en Figma y todavía no tiene página. Úsalo desde el archivo de Figma sabiendo que su comportamiento no está garantizado por escrito, y avísanos: **lo que se pide se adelanta.** El orden de trabajo no es alfabético ni caprichoso —se ordena por lo que cuesta documentar cada componente y, dentro de eso, por lo que más se usa en producto—, y una necesidad real de un equipo pesa en ese orden.

**Está en Known issues y el defecto te bloquea.** Dilo antes de resolverlo por tu cuenta. Un arreglo local se convierte en una diferencia permanente entre tu pantalla y el sistema; el mismo arreglo hecho en el componente lo hereda todo el producto.

**Necesitas un componente que no existe.** Antes de crearlo, pregunta. La mayoría de las piezas nuevas resultan ser una variante de algo que ya está aquí, y una variante cuesta una fracción de lo que cuesta un componente nuevo — que, una vez dentro, hay que mantener para siempre.

Para cualquiera de los tres, escríbenos en Slack a **#frontend-and-design**.
