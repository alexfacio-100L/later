# Resumen general

La separación entre elementos y la rejilla que los alinea son dos sistemas distintos. Comparten unidad base y resuelven problemas diferentes.

## Qué es y qué resuelve

La escala de separación decide cuánto aire va entre dos elementos. Sirve igual al relleno de una caja que al hueco entre dos piezas.

La rejilla decide dónde empieza y dónde termina el contenido dentro de un formato. Fija columnas, canales y márgenes.

La frontera entre las dos es la pregunta que llega sola. Solo los bloques de primer nivel se alinean a la rejilla. Lo que vive dentro de un bloque se separa con peldaños de la escala.

<SNCallout type="Info">
**El canal sale de la escala.** Una rejilla no inventa su propia medida de separación. Toma un peldaño, y así los dos sistemas no se contradicen.
</SNCallout>

## Cómo se eligió la escala

La unidad base es 4, no 8. La escala sube de 2 en 2 hasta 4, de 4 en 4 hasta 16, y de 8 en 8 a partir de ahí.

El consumo real lo confirma. El 36,9 por ciento de las separaciones medidas no es múltiplo de 8. Los dos peldaños por debajo de 8 suman más de cinco mil usos.

Diecisiete de los dieciocho peldaños son alias de la rejilla `unit`. Ninguno es valor directo, porque la rejilla los contiene a todos.

La progresión no es geométrica, aunque el nombre lo sugiera. De `2xl` en adelante cada peldaño suma 8. La razón cae de 2,0 a 1,08.

<SNCallout type="Warning">
**La evidencia cubre un destino.** Las cifras de consumo salen del archivo de producto digital. La escala rige los tres destinos, y su uso medido todavía no los cubre.
</SNCallout>

## Qué decide una rejilla

Una rejilla son tres decisiones, y ninguna de las tres depende del medio.

| Decisión | Qué fija |
| --- | --- |
| Columnas | En cuántas partes se reparte el ancho útil |
| Canal | Cuánto aire queda entre dos columnas |
| Margen | Cuánto queda fuera del contenido, contra el borde del formato |

El canal no es una decisión libre. Sale de la escala de separación, igual que cualquier otro hueco del sistema.

Lo que cambia de un medio a otro es quién fija el ancho total. Un formato impreso lo trae decidido antes de empezar. Una ventana lo cambia mientras alguien la arrastra.

Doce columnas se reparten en mitades, tercios, cuartos y sextos. Esa divisibilidad permite repetir la misma rejilla en composiciones muy distintas.

<SNCallout type="Info">
**Later publica el repertorio.** El canal y el margen salen de la escala, y cada destino arma su rejilla con esos peldaños. Solo producto digital tiene rejillas definidas como estilo. Lo decidió el Lead de Product Design el 1 oct 2026, y no es un límite de ninguna herramienta.
</SNCallout>

## Fundamentos relacionados

`Dimensiones` decide el tamaño del elemento que se separa. `Bordes` y `Curvas esquinadas` deciden la caja. `Color` decide el fondo sobre el que se lee la separación.

<SNCallout type="Warning">
**`Dimensiones` está vacía.** Por eso va nombrada y no enlazada. Un enlace a una página vacía cuesta más que un nombre en negrita.
</SNCallout>

## La rejilla en producto digital

Later tiene tres rejillas de producto, no una rejilla con varios tamaños. **El modelo lo decide el chrome**: qué navegación rodea al contenido.

| Modelo | Chrome | Comportamiento |
| --- | --- | --- |
| `Website` | Navegación arriba y pie abajo | El ancho máximo se mantiene y la rejilla se centra en la ventana |
| `Web App` | Barra lateral y barra superior | La rejilla vive dentro del `Content`, ya descontada la barra lateral |
| `Web App Single` | Solo barra superior, con volver y ayuda | Una tarea enfocada con URL propia. Usa la rejilla de `Website` |

El margen significa cosas distintas en cada modelo. En `Website` es el aire entre el contenido y el borde de la ventana. En `Web App` es el aire dentro de un área que ya viene recortada por la navegación.

Dentro de `Web App` conviven dos tipos, y la elección depende del contenido, no de la pantalla.

| Tipo | Cuándo | Cómo se comporta |
| --- | --- | --- |
| **Fluida** | Dashboards, tablas, cualquier vista que reparte datos | Ocupa todo el `Content`, con 24 px de margen |
| **Contenida** | Lectura, formularios, contenido corto | Fija el contenido en 1.078 px y lo centra |

La contenida existe para que la vista no obligue a recorrer la pantalla entera con los ojos. **Es legibilidad**, no una medida sobrante.

<SNCallout type="Info">
**La contenida es un ancho máximo.** No es un margen. Medido el 1 oct 2026: deja el contenido en 1.078 px tanto en un contenedor de 1.410 px como en uno de 1.602 px. `CENTER` calcula el margen para que el ancho no cambie.
</SNCallout>

Atlassian llama `fixed` y `fluid` a esa misma distinción, y Carbon la resuelve con sus modos de canal. **El tipo es otro eje.** Un modelo dice qué chrome rodea al contenido; un tipo dice cuánto se extiende dentro de él.

# Usos

## Qué se alinea a la rejilla y qué se separa con la escala

Alinea a la rejilla los bloques de primer nivel. Son las zonas de una composición y los contenidos que ocupan el ancho completo.

Separa con la escala todo lo demás. Una pieza pequeña, un icono o una fila de tabla se resuelven con `space`. El interior de una tarjeta, también.

La prueba es sencilla. Si el elemento puede cambiar de ancho sin romper la composición, va con la escala.

## Qué peldaño para qué caso

La escala tiene dieciocho peldaños y ocho sostienen el trabajo real.

| Token | Valor | Qué separa | Uso medido |
| --- | --- | --- | --- |
| `space/zero` | 0 | Apagar una separación heredada | 244 usos |
| `space/2xs` | 2 px | Dos partes pegadas de una misma pieza | 1.405 usos |
| `space/xs` | 4 px | Piezas de un mismo grupo | 3.582 usos |
| `space/s` | 8 px | El relleno por defecto del sistema | 7.192 usos, el más usado con diferencia |
| `space/m` | 12 px | Relleno lateral de una pieza mediana | 244 usos |
| `space/l` | 16 px | Relleno de bloque, y canal de una rejilla estrecha | 1.366 usos de separación, más 15 de rejilla |
| `space/xl` | 24 px | Canal y margen de una rejilla ancha | 74 usos de separación, más 15 de rejilla |
| `space/2xl` | 32 px | Margen de una rejilla intermedia | 60 usos de separación, más 1 de rejilla |
| `space/3xl` a `space/12xl` | 40 px a 120 px | Sin uso medido | Pendientes de retirada |

**Dos peldaños hacen doble papel.** `space/l` y `space/xl` sirven de separación y de canal de rejilla. Son los únicos que cruzan los dos sistemas.

## Cuándo no usar la escala

**No escribas un valor intermedio.** Entre 8 px y 12 px no hay peldaño porque no hace falta ninguno. Un número suelto rompe el consumo del token más adelante.

**No alinees una pieza suelta.** La rejilla es para bloques. Una pieza alineada a columna se descoloca en cuanto cambia el ancho.

**No uses un peldaño muerto.** Los diez de 40 px en adelante están pendientes de retirada. Elegir uno hoy crea trabajo de migración mañana.

**No uses `space/5xl` de altura.** Es un peldaño de separación. Para la altura de una pieza va `size/control/m`.

## Cómo se elige la rejilla en producto digital

**No mezcles los modelos.** En una misma vista, el margen de `Website` y el de `Web App` responden a anclajes distintos. Mezclarlos produce contenido que no cuadra con nada.

**No elijas por la pantalla.** La fluida y la contenida se eligen por el contenido. Un dashboard contenido desperdicia la mitad del ancho.

# Especificaciones

## La escala de separación

<SNTokens coleccion="spacing" grupo="space" titulo="Los dieciocho peldaños de separación" />

## La rejilla de línea base

Existe una rejilla de filas de 4 px, bindeada a `space/xs` y a `space/zero`. Es la unidad base hecha visible.

Úsala para comprobar que una composición cae en la retícula vertical. No se aplica al entregar: es una ayuda de revisión.

<SNCallout type="Info">
**La rejilla mide 4 px.** Ese es el valor de la unidad base. Si cambiara la unidad, esta rejilla cambia con ella.
</SNCallout>

## Accesibilidad de la escala

La separación es lo que permite distinguir dos cosas que no son la misma. Dos elementos a 4 px se leen como uno solo, aunque cada uno mida lo suyo.

La escala no decide contraste. Esa decisión vive en `Color`.

## Cómo se expresa la escala en cada herramienta

En un borde, lo que viaja de una herramienta a otra es un número que se teclea. En separación no existe ese número.

Fuera de una herramienta con auto-layout no hay campo de relleno ni de hueco. Nadie teclea 8 px: alguien coloca dos cosas a 8 px de distancia.

**Lo que viaja es el repertorio.** La instrucción es «separa con estos peldaños y no con otros». Se cumple a ojo contra una guía visible, no escribiendo en una casilla.

`Unidades y medios` guarda la regla general de conversión: la constante, por qué un redondeo no se traduce y qué pasa en impreso.

<SNCallout type="Warning">
**Hueco declarado.** Dónde se expresa la separación en Illustrator y en Google Slides no está medido. Hasta medirlo en cada herramienta no se escribe aquí.
</SNCallout>

La rejilla no tiene ese hueco. Marketing e impresos la arman con el repertorio de canal y margen, y no esperan a que exista un estilo.

### Cómo se aplica en Figma

La rejilla vive como Layout Grid Style en la librería de auditoría. Aplícala desde el panel de propiedades, en la sección de Layout grid.

Elige el estilo por modelo y por rol, no por parecido visual. El nombre del estilo dice el modelo primero y el rol después.

Pulsa `Control + G` para mostrar u ocultar la rejilla mientras diseñas.

<SNCallout type="Info">
**Aplicar el estilo arrastra el token.** El canal y el margen van bindeados dentro del propio estilo, en los diez. No hace falta bindear nada a mano en el nodo.
</SNCallout>

La separación sí tiene campo en Figma. Va en los controles de auto-layout, y el valor sale del token en lugar de escribirse a mano.

## Las medidas en producto digital

### Los umbrales de ventana

<SNTokens coleccion="layout" grupo="breakpoint" titulo="Los umbrales de ventana" />

<SNCallout type="Warning">
**Un umbral nombra la frontera.** No conmuta el valor. Los tokens de tipografía conmutan por mode Desktop y Mobile. El semántico de puntos de ruptura aliasa el umbral de 640 px en móvil y el de 1440 px en escritorio.
</SNCallout>

### La rejilla por modelo y medida

| Modelo | Tipo | Medida | Columnas | Canal | Margen |
| --- | --- | --- | --- | --- | --- |
| `Mobile` | Fluida | 360 px | 4 | 16 px, `space/l` | 16 px, `space/l` |
| `Tablet` | Fluida | 1024 px | 8 | 16 px, `space/l` | 32 px, `space/2xl` |
| `Web App` | **Fluida** | Cualquiera | 12 | 24 px, `space/xl` | 24 px, `space/xl` |
| `Web App` | **Contenida** | Cualquiera | 12 | 24 px, `space/xl` | Lo calcula `CENTER` |
| `Website` | Contenida | 1440 px | 12 | 24 px, `space/xl` | 150 px, en crudo |
| `Website` | Contenida | 1728 px | 12 | 24 px, `space/xl` | 294 px, en crudo |
| `Website` | Contenida | 1920 px | 12 | 24 px, `space/xl` | 240 px, en crudo |

La contenida de `Web App` ya no depende de la medida. Fija 12 columnas de 67,83 px y deja que `CENTER` reparta lo que sobre.

Esta tabla recoge el archivo de auditoría. Comprueba la rejilla de tu producto antes de darla por buena, porque puede diferir.

### El área táctil

El área táctil mínima la fija `size/control/s`, que vale 48 px. WCAG 2.2 pide 24 por 24 CSS px en el criterio 2.5.8, y el sistema va por encima.

La separación entre destinos táctiles se resuelve con `space/s` o mayor. Dos controles a 4 px incumplen el espíritu del criterio. Cada uno mide lo suyo, y aun así quedan pegados.

# Estatus y cambios

## Cómo se añade un peldaño

Tres condiciones para que entre un peldaño nuevo, y las tres ya son doctrina de la casa.

**Alias antes que valor.** El peldaño tiene que existir en la rejilla `unit`. Si no existe, entra primero en `unit` y después en `spacing`.

**Uso antes que nombre.** Un peldaño entra cuando hay al menos un consumidor real que lo pide. Diez de los dieciocho actuales están hoy a cero.

**Nombre por posición.** El sufijo sigue la serie que ya existe. Un valor entre dos peldaños obliga a renombrar la serie, así que se evita.

Esa regla tiene una excepción, y se declara en lugar de improvisarse. Un valor intermedio entra si el peldaño a renombrar **no tiene consumidores**.

<SNCallout type="Info">
**La excepción se usó una vez.** El umbral de 1728 entró entre 1440 y 1920, y obligó a cambiar el sufijo del umbral de 1920. Se midió antes: 0 bindings y 0 alias.
</SNCallout>

Aprueba el Lead de Product Design. Sin su visto bueno el peldaño no entra.

## Deuda viva de la escala

| Qué | Tamaño | Consecuencia |
| --- | --- | --- |
| Peldaños sin uso | 10 de 18, de 40 px a 120 px | Quien elige uno crea trabajo de migración |
| Salto roto en el tramo alto | De 104 px se pasa a 120 px | La serie promete 112 px y no existe |

**Un peldaño muerto más.** El 1 oct 2026 `space/5xl` perdió su único consumidor, que era la altura del `Top Bar`. Al pasar esa altura a `size/control/m` la lista subió de nueve a diez.

<SNCallout type="Warning">
**Los previews no son fuente.** Muestran peldaños de 20 px, 28 px, 36 px y 128 px que no existen como token. Les faltan siete de los que sí existen.
</SNCallout>

## La rejilla en producto digital

### Cómo se añade una medida

Una medida nueva necesita modelo declarado, no solo un ancho. Di si es `Website` o `Web App` antes de fijar el margen.

El canal sale de la escala de separación. Un canal que no sea un token `space` no entra.

El estilo lleva el binding dentro, nunca en el nodo. Un estilo con números sueltos deja sin token a todo lo que lo aplique después.

Y la medida necesita umbral. Si el ancho no existe en la escala de umbrales, entra ahí primero.

### Deuda viva de los estilos

Medida el 1 oct 2026 sobre los 10 estilos publicados y las 41 rejillas aplicadas en `[Auditoria]`.

| Qué | Tamaño | Consecuencia |
| --- | --- | --- |
| El margen escrito en crudo | 3 de 8 estilos vigentes | 150, 240 y 294 px, los tres de `Website`. Ningún token vale eso |
| Columnas y ancho de columna sin token | 10 de 10 y 9 de 10 | No existe categoría de token que los cubra |
| Dos estilos vivos solo como camino de vuelta | `Web App/legacy`, 2 | Se retiran cuando el render esté visto |
| Rejillas sueltas | 5 de 41 | Sus valores no existen en la escala: canal de 20 px y de 30 px |

**Dos márgenes crudos menos.** El ancho de columna fijo no deja margen que escribir. `Web App` dejó de llevar 166 px y 262 px. A cambio escribe 67,83 px de ancho de columna, que tampoco es token.

### Lo que se arregló

Dos defectos publicados como deuda ya no lo son. Se quedan a la vista porque alguien pudo construir encima mientras lo eran.

| Qué decía | Qué pasó |
| --- | --- |
| Faltaba el umbral de 1728 px | Entró en la escala el 1 oct 2026, y el de 1920 px pasó a `3xl` |
| Los márgenes de 166 px y 262 px eran un defecto | No lo eran. Son el tipo contenido, y fijan el contenido en 1.078 px |
| Los estilos se nombraban por medida | Seis pasaron a nombrarse por rol el 1 oct 2026 |
| `Web App` tenía 3 estilos para 2 tipos | Ahora tiene 2, `fluid` y `contained` |
| Un estilo llevaba una medida literal en el nombre | Se retiró. No tenía uso y duplicaba a otro con distintos valores |

El segundo no se arregló: se entendió. El valor no cambió y la lectura sí, que es la corrección más barata de las dos.

**El cambio es la corrección.** Las vistas de `Web App Single` usaban márgenes calculados para un contenedor ya recortado por la barra lateral. Single no tiene barra lateral, así que ese cálculo nunca le correspondió.

| Vista | Contenido antes | Contenido ahora |
| --- | --- | --- |
| `Web App Single` a 1728 px | 1.396 px | **1.140 px** |
| `Web App Single` a 1920 px | 1.396 px | **1.440 px** |

Las dos vistas de `Web App` con barra lateral no se movieron ni un píxel. Siguen en 1.078 px.

### Lo que no gobernamos

Seis de las 41 rejillas aplicadas apuntan a estilos de otra librería. Cuatro viven en `Playground` y dos en el componente `Navbar`.

Su estilo no está en esta librería, así que renombrar o rebindear aquí no las alcanza. Se resuelven en el archivo de producción, no en el de auditoría.

## Changelog

| Fecha | Qué cambió | Por qué |
| --- | --- | --- |
| 1 oct 2026 | Later publica el repertorio de canal y margen, y no define rejillas de marketing ni de impresos | Cada destino arma la suya con los mismos peldaños. Es una decisión, no un límite de herramienta |
| 1 oct 2026 | Lo que solo sirve a producto digital pasa a secciones que lo nombran en su título | El sistema alimenta producto, marketing e impresos, y dos de los tres no se veían reflejados |
| 1 oct 2026 | Se declara que en separación no hay número que teclear fuera de una herramienta con auto-layout | En grosor y radio se traduce un número. Aquí lo que se traduce es el repertorio de peldaños |
| 1 oct 2026 | `space/5xl` deja de usarse como altura del `Top Bar`, que pasa a `size/control/m` | Era un cruce de categoría, y el valor no cambió |
| 1 oct 2026 | `space/5xl` queda a cero y los peldaños muertos pasan de nueve a diez | Ese uso era el único que tenía |
| 1 oct 2026 | Se declara la unidad base real, que es 4 con sub-peldaño de 2 | La medición contradijo la base de 8 que se suponía |
| 1 oct 2026 | Se separan `Website` y `Web App` como dos modelos | Sus márgenes responden a anclajes distintos |
| 1 oct 2026 | Entra el umbral de 360 px | La rejilla de móvil ya existía y su umbral no |
| 1 oct 2026 | Entra el umbral de 1728 px, y el de 1920 cambia de sufijo | El ancho ya tenía rejilla en los dos modelos, y el renombrado no tenía consumidores |
| 1 oct 2026 | La familia de umbrales pasa a minúscula, y el semántico pierde el espacio | La convención pide `camelCase` para toda variable, sin excepciones |
| 1 oct 2026 | `Web App Single` se declara tercer modelo y usa la rejilla de `Website` | Comparte chrome con ella, no con `Web App` |
| 1 oct 2026 | Seis estilos de rejilla pasan a nombrarse por rol | Un nombre con medida se aplicó a otra medida |
| 1 oct 2026 | La contenida de `Web App` pasa a `CENTER` con ancho de columna fijo | El margen a mano era un valor crudo por cada medida |
| 1 oct 2026 | Las dos vistas de `Web App Single` pasan a la rejilla de `Website` | Su margen se calculaba para un contenedor con barra lateral que no tienen |
| 1 oct 2026 | Se retira el estilo `Tablet/8 Cols - 1024` | Sin uso, y duplicaba a `Tablet/8 Cols` con otro canal y otro margen |
| 1 oct 2026 | Los márgenes 166 px y 262 px dejan de ser deuda y pasan a ser el tipo contenido | Son deliberados: fijan el contenido en 1.078 px |
