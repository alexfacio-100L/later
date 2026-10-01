# Resumen general

La separación entre cajas y la rejilla que las alinea son dos sistemas distintos. Comparten unidad base y resuelven problemas diferentes.

## Qué es y qué resuelve

La escala de separación decide cuánto aire va entre dos elementos. Alimenta gap, padding y margin, y no se ata a una sola de las tres.

La rejilla de layout decide dónde empieza y termina el contenido en la pantalla. Fija columnas, canales y márgenes por tamaño de ventana.

La frontera entre las dos es la pregunta que llega sola. Solo los contenedores de primer nivel se alinean a la rejilla. Todo lo que vive dentro de un contenedor se separa con tokens de la escala.

<SNCallout type="Info">
**El canal sale de la escala.** Los diez estilos de rejilla bindean su canal a un token `space`. El margen no siempre: cinco lo escriben en crudo, y la lista está en `Estatus y cambios`.
</SNCallout>

## Cómo se eligió la escala

La unidad base es 4, no 8. La escala sube de 2 en 2 hasta 4, de 4 en 4 hasta 16, y de 8 en 8 a partir de ahí.

El consumo real lo confirma. El 36,9 por ciento de las separaciones medidas no es múltiplo de 8. Los dos peldaños por debajo de 8 suman más de cinco mil usos.

Diecisiete de los dieciocho peldaños son alias de la rejilla `unit`. Ninguno es valor directo, porque la rejilla los contiene a todos.

La progresión no es geométrica, aunque el nombre lo sugiera. De `2xl` en adelante cada peldaño suma 8. La razón cae de 2,0 a 1,08.

## Los tres modelos de rejilla

Later tiene tres rejillas, no una rejilla con varios tamaños. **El modelo lo decide el chrome**: qué navegación rodea al contenido.

| Modelo | Chrome | Comportamiento |
| --- | --- | --- |
| `Website` | Navegación arriba y pie abajo | El ancho máximo se mantiene y la rejilla se centra en la ventana |
| `Web App` | Barra lateral y barra superior | La rejilla vive dentro del `Content`, ya descontada la barra lateral |
| `Web App Single` | Solo barra superior, con volver y ayuda | Una tarea enfocada con URL propia. Usa la rejilla de `Website` |

El margen significa cosas distintas en cada modelo. En `Website` es el aire entre el contenido y el borde de la ventana. En `Web App` es el aire dentro de un área que ya viene recortada por la navegación.

## Los dos tipos de rejilla

Dentro de `Web App` conviven dos tipos, y la elección depende del contenido, no de la pantalla.

| Tipo | Cuándo | Cómo se comporta |
| --- | --- | --- |
| **Fluida** | Dashboards, tablas, cualquier vista que reparte datos | Ocupa todo el `Content`, con 24 px de margen |
| **Contenida** | Lectura, formularios, contenido corto | Fija el contenido en 1.078 px y lo centra |

La contenida existe para que la vista no obligue a recorrer la pantalla entera con los ojos. **Es legibilidad**, no una medida sobrante.

<SNCallout type="Info">
**La contenida es un ancho máximo.** No es un margen. Medido el 1 oct 2026: deja el contenido en 1.078 px tanto en un contenedor de 1.410 px como en uno de 1.602 px. El margen cambia para que el ancho no cambie.
</SNCallout>

Esa es la misma distinción que Atlassian llama `fixed` y `fluid`, y que Carbon resuelve con sus modos de canal. **El tipo es otro eje.** Un modelo dice qué chrome rodea al contenido; un tipo dice cuánto se extiende dentro de él.

## Fundamentos relacionados

`Dimensiones` decide el tamaño del elemento que se separa. `Bordes` y `Curvas esquinadas` deciden la caja. `Color` decide el fondo sobre el que se lee la separación.

<SNCallout type="Warning">
**`Dimensiones` está vacía.** Por eso va nombrada y no enlazada. Un enlace a una página vacía cuesta más que un nombre en negrita.
</SNCallout>

# Usos

## Qué se alinea a la rejilla y qué se separa con tokens

Alinea a la rejilla los contenedores de primer nivel. Son las columnas de una vista, las zonas de una página y los bloques que ocupan ancho completo.

Separa con tokens todo lo demás. Un botón, un icono o una fila de tabla se resuelven con `space`. El interior de una tarjeta, también.

La prueba es sencilla. Si el elemento puede cambiar de ancho sin romper la página, va con tokens.

## Qué peldaño para qué caso

La escala tiene dieciocho peldaños y ocho sostienen el trabajo real.

| Token | Valor | Para qué | Uso medido |
| --- | --- | --- | --- |
| `space/zero` | 0 | Apagar un gap heredado | 244 usos, casi todos en `itemSpacing` |
| `space/2xs` | 2 px | Separar elementos pegados dentro de un control | 1.405 usos, sobre todo gap |
| `space/xs` | 4 px | Separación corta entre piezas de un mismo grupo | 3.582 usos, gap y padding a partes parecidas |
| `space/s` | 8 px | El relleno por defecto del sistema | 7.192 usos, el más usado con diferencia |
| `space/m` | 12 px | Relleno horizontal de controles medianos | 244 usos |
| `space/l` | 16 px | Relleno de contenedor, y canal de rejilla en móvil y tablet | 1.366 usos de separación, más 15 de rejilla |
| `space/xl` | 24 px | Canal y margen de la rejilla de escritorio | 74 usos de separación, más 15 de rejilla |
| `space/2xl` | 32 px | Margen de la rejilla de tablet | 60 usos de separación, más 1 de rejilla |
| `space/3xl` a `space/12xl` | 40 px a 120 px | Sin uso medido | Pendientes de retirada, ver `Estatus y cambios` |

**Dos peldaños hacen doble papel.** `space/l` y `space/xl` sirven de separación y de canal de rejilla. Son los únicos que cruzan los dos sistemas.

## Cómo se activa la rejilla al diseñar

La rejilla vive como Layout Grid Style en la librería de auditoría. Aplícala desde el panel de propiedades, en la sección de Layout grid.

Elige el estilo por modelo y por medida, no por parecido visual. El nombre del estilo dice el modelo primero y la medida después.

Pulsa `Control + G` para mostrar u ocultar la rejilla mientras diseñas.

<SNCallout type="Info">
**Aplicar el estilo arrastra el token.** El canal y el margen van bindeados dentro del propio estilo, en los diez. No hace falta bindear nada a mano en el nodo.
</SNCallout>

## Cuándo no usarla

**No escribas un valor intermedio.** Entre 8 px y 12 px no hay peldaño porque no hace falta ninguno. Un número suelto rompe el consumo del token en código.

**No alinees un componente.** La rejilla es para contenedores. Un botón alineado a columna se descoloca en cuanto cambia el ancho.

**No mezcles los modelos.** En una misma vista, el margen de `Website` y el de `Web App` responden a anclajes distintos. Mezclarlos produce contenido que no cuadra con nada.

**No elijas por la pantalla.** La fluida y la contenida se eligen por el contenido. Un dashboard contenido desperdicia la mitad del ancho.

**No uses un peldaño muerto.** Los diez de 40 px en adelante están pendientes de retirada. Elegir uno hoy crea trabajo de migración mañana.

**No uses `space/5xl` de altura.** Es un token de separación. Para la altura de un control va `size/control/m`.

# Especificaciones

## La escala de separación

<SNTokens coleccion="spacing" grupo="space" titulo="Los dieciocho peldaños de separación" />

## Los umbrales de ventana

<SNTokens coleccion="layout" grupo="breakpoint" titulo="Los umbrales de ventana" />

<SNCallout type="Warning">
**Un umbral nombra la frontera.** No conmuta el valor. Los tokens de tipografía conmutan por mode Desktop y Mobile. El semántico de puntos de ruptura aliasa el umbral de 640 px en móvil y el de 1440 px en escritorio.
</SNCallout>

## La rejilla por modelo y medida

| Modelo | Tipo | Medida | Columnas | Canal | Margen |
| --- | --- | --- | --- | --- | --- |
| `Mobile` | Fluida | 360 px | 4 | 16 px, `space/l` | 16 px, `space/l` |
| `Tablet` | Fluida | 1024 px | 8 | 16 px, `space/l` | 32 px, `space/2xl` |
| `Web App` | **Fluida** | Cualquiera | 12 | 24 px, `space/xl` | 24 px, `space/xl` |
| `Web App` | **Contenida** | 1728 px | 12 | 24 px, `space/xl` | 166 px, en crudo |
| `Web App` | **Contenida** | 1920 px | 12 | 24 px, `space/xl` | 262 px, en crudo |
| `Website` | Contenida | 1440 px | 12 | 24 px, `space/xl` | 150 px, en crudo |
| `Website` | Contenida | 1728 px | 12 | 24 px, `space/xl` | 294 px, en crudo |
| `Website` | Contenida | 1920 px | 12 | 24 px, `space/xl` | 240 px, en crudo |

Las dos filas contenidas de `Web App` dan el mismo ancho de contenido, 1.078 px. El margen difiere porque el contenedor difiere.

Esta tabla recoge el archivo de auditoría. Comprueba la rejilla de tu producto antes de darla por buena, porque puede diferir.

## La rejilla de línea base

Existe una rejilla de filas de 4 px, bindeada a `space/xs` y a `space/zero`. Es la unidad base hecha visible.

Úsala para comprobar que una vista cae en la rejilla vertical. No se aplica al entregar: es una ayuda de revisión.

<SNCallout type="Info">
**La rejilla mide 4 px.** Ese es el valor de la unidad base. Si cambiara la unidad, esta rejilla cambia con ella.
</SNCallout>

## Accesibilidad de la escala

El área táctil mínima la fija `size/control/s`, que vale 48 px. WCAG 2.2 pide 24 por 24 CSS px en el criterio 2.5.8, y el sistema va por encima.

La separación entre destinos táctiles se resuelve con `space/s` o mayor. Dos controles a 4 px incumplen el espíritu del criterio. Cada uno mide lo suyo, y aun así quedan pegados.

La escala no decide contraste. Esa decisión vive en `Color`.

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

## Cómo se añade una medida de rejilla

Una medida nueva necesita modelo declarado, no solo un ancho. Di si es `Website` o `Web App` antes de fijar el margen.

El canal sale de la escala de separación. Un canal que no sea un token `space` no entra.

El estilo lleva el binding dentro, nunca en el nodo. Un estilo con números sueltos deja sin token a todo lo que lo aplique después.

Y la medida necesita umbral. Si el ancho no existe en la escala de umbrales, entra ahí primero.

## Lo que se arregló

Dos defectos publicados como deuda ya no lo son. Se quedan a la vista porque alguien pudo construir encima mientras lo eran.

| Qué decía | Qué pasó |
| --- | --- |
| Faltaba el umbral de 1728 px | Entró en la escala el 1 oct 2026, y el de 1920 px pasó a `3xl` |
| Los márgenes de 166 px y 262 px eran un defecto | No lo eran. Son el tipo contenido, y fijan el contenido en 1.078 px |

El segundo no se arregló: se entendió. El valor no cambió y la lectura sí, que es la corrección más barata de las dos.

## Deuda viva

Medida el 1 oct 2026 sobre los 10 estilos publicados y las 41 rejillas aplicadas en `[Auditoria]`.

| Qué | Tamaño | Consecuencia |
| --- | --- | --- |
| Peldaños sin uso | 10 de 18, de 40 px a 120 px | Quien elige uno crea trabajo de migración |
| Salto roto en el tramo alto | De 104 px se pasa a 120 px | La serie promete 112 px y no existe |
| El margen escrito en crudo | 5 de 10 estilos | 150, 166, 240, 262 y 294 px. Ningún token vale eso |
| Columnas y ancho de columna sin token | 10 de 10 y 9 de 10 | No existe categoría de token que los cubra |
| Un estilo hace de fluida y de contenida | La familia `Web App`, 3 estilos para 2 tipos | El tipo se elige por parecido, no por nombre |
| Los estilos se nombran por medida y no por rol | 7 de 10 llevan medida en el nombre | El nombre dice un ancho y se aplica a otro |
| Rejillas sueltas | 5 de 41 | Sus valores no existen en la escala: canal de 20 px y de 30 px |

**Un peldaño muerto nació hoy.** `space/5xl` tenía un consumidor, la altura del `Top Bar`, y era un cruce de categoría. Al pasar esa altura a `size/control/m` quedó a cero, y la lista subió de nueve a diez.

**La contenida con `CENTER` retira dos márgenes crudos de los cinco.** El ancho de columna fijo no deja margen que escribir. `Web App` deja de llevar 166 px y 262 px. A cambio escribe 67,83 px de ancho de columna, que tampoco es token. Quedan los tres de `Website`.

<SNCallout type="Warning">
**Los previews no son fuente.** Muestran peldaños de 20 px, 28 px, 36 px y 128 px que no existen como token. Les faltan siete de los que sí existen.
</SNCallout>

## Lo que no gobernamos

Seis de las 41 rejillas aplicadas apuntan a estilos de otra librería. Cuatro viven en `Playground` y dos en el componente `Navbar`.

Su estilo no está en esta librería, así que renombrar o rebindear aquí no las alcanza. Se resuelven en el archivo de producción, no en el de auditoría.

## Changelog

| Fecha | Qué cambió | Por qué |
| --- | --- | --- |
| 1 oct 2026 | `space/5xl` deja de usarse como altura del `Top Bar`, que pasa a `size/control/m` | Era un cruce de categoría, y el valor no cambió |
| 1 oct 2026 | `space/5xl` queda a cero y los peldaños muertos pasan de nueve a diez | Ese uso era el único que tenía |
| 1 oct 2026 | Se declara la unidad base real, que es 4 con sub-peldaño de 2 | La medición contradijo la base de 8 que se suponía |
| 1 oct 2026 | Se separan `Website` y `Web App` como dos modelos | Sus márgenes responden a anclajes distintos |
| 1 oct 2026 | Entra el umbral de 360 px | La rejilla de móvil ya existía y su umbral no |
| 1 oct 2026 | Entra el umbral de 1728 px, y el de 1920 cambia de sufijo | El ancho ya tenía rejilla en los dos modelos, y el renombrado no tenía consumidores |
| 1 oct 2026 | La familia de umbrales pasa a minúscula, y el semántico pierde el espacio | La convención pide `camelCase` para toda variable, sin excepciones |
| 1 oct 2026 | `Web App Single` se declara tercer modelo y usa la rejilla de `Website` | Comparte chrome con ella, no con `Web App` |
| 1 oct 2026 | Los márgenes 166 px y 262 px dejan de ser deuda y pasan a ser el tipo contenido | Son deliberados: fijan el contenido en 1.078 px |
