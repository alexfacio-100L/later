# Resumen general

Una curva esquinada suaviza el borde de una caja. Es una sola decisión: cuánto radio.

## Qué es y qué resuelve

El radio dice qué tan blanda se ve una caja. Y dice más: separa lo que contiene de lo que va contenido.

Un contenedor de primer nivel lleva más radio que un elemento anidado dentro de él. Ésa es la regla que convierte siete números en un criterio.

<SNCallout type="Info">
**No se deciden aquí.** Viven en `Bordes`. Esa página documenta los seis `width/*` de la misma colección `border` y los trece colores de borde. Radio y grosor comparten colección y no comparten ni un token: la intersección es de 0 sobre 13.
</SNCallout>

## Cómo se eligió la escala

La rejilla del sistema es la colección `unit`. **Seis de los siete son alias**: `zero`, `xs` sobre `unit/4`, `s` sobre `unit/8`, `m` sobre `unit/12`, `l` sobre `unit/16` y `xl` sobre `unit/24`.

El séptimo es `radius/full`, y vale 999. No es un peldaño de la escala: es un centinela.

**999 redondea del todo.** Siempre es mayor que la mitad del lado más corto. Produce una píldora en un rectángulo y un círculo en un cuadrado.

Un solo token para los dos casos, y eso está medido. Sobre 8 design systems, **8 de 8** usan un token único para píldora y círculo. Y **6 de 8** lo llaman `full`: Material 3, Polaris, Atlassian, Primer, Spectrum y Tailwind.

El 50% no era alternativa. DTCG admite en `dimension` solo px y rem, así que el centinela no es un apaño: es lo que permite el estándar.

## Fundamentos relacionados

`Bordes` decide el grosor y el color de la misma caja. `Dimensiones` decide el tamaño del elemento que la lleva. `Grillas y espacios` decide la separación entre cajas.

<SNCallout type="Warning">
**Las tres páginas están vacías.** Por eso van nombradas y no enlazadas. Un enlace a una página vacía cuesta más que un nombre en negrita.
</SNCallout>

# Usos

## Qué radio para qué tamaño

**El radio se elige por tamaño**, no por gusto. Lo pide el componente al que se aplica. Es la doctrina de Base, medida aquí sobre el sistema propio.

| Token | Valor | Para qué | Uso medido |
| --- | --- | --- | --- |
| `radius/zero` | 0 | Apagar un radio heredado en código | No es «sin radio»: es un apagado explícito |
| `radius/xs` | 4 px | Elemento pequeño | Tags, miniaturas de propiedad y pistas de slider, medido el 22 sep 2026 |
| `radius/s` | 8 px | Contenedor anidado y campo de formulario | `card-graph` dentro de una tarjeta, el Content de `inputText`, `inputNumber` e `inputDate`, Alerts y Button Card |
| `radius/m` | 12 px | Contenedor intermedio | El `labelBox` de Button y de Link |
| `radius/l` | 16 px | Contenedor de primer nivel sobre la superficie de pantalla | 15 de 15 tarjetas raíz del Playground y las 60 variantes del Button |
| `radius/xl` | 24 px | Contenedor grande | Los 5 componentes del Chip |
| `radius/full` | 999 px | Píldora y círculo | Avatares, badges de píldora y botones circulares |

**La regla más sólida de la escala es `radius/l`.** 15 de 15 tarjetas raíz del Playground lo usan, sin una excepción.

**Anidar baja un peldaño o dos.** Una tarjeta raíz lleva 16 px y lo que vive dentro de ella lleva 8 px.

<SNCallout type="Warning">
**No es la escala de Base.** Base pone 12 px en tarjetas y banners. Pone 8 px en elementos anidados como botones. Aquí la tarjeta raíz está medida en 16 px, y `radius/m` hace de intermedio. Se presta **el principio, no los valores**.
</SNCallout>

## Cuándo no usarla

**Un grosor no es un radio.** `width/l` vale 4 px igual que `radius/xs`, así que usarlo como radio no se ve. Ni en el render, ni en una revisión humana, ni en un chequeo de valores crudos. Pasó dentro del Button, y lo caza `npm run tokens:lint`.

**No escribas un radio intermedio.** Entre 12 px y 16 px no hay peldaño porque no hace falta ninguno. Un valor suelto rompe el consumo del token en código.

**No uses `radius/zero` para decir «sin radio».** Existe para apagar un radio heredado, y lo mismo vale para `width/zero`.

**Sin relleno no hay radio.** El `labelBox` del Button lleva `radius/m` y no tiene relleno, así que su radio no se ve. Es geometría sobrante, registrada como deuda.

**No inventes un token de círculo.** `radius/full` cubre píldora y círculo, y son el mismo mecanismo. Separarlos no tiene precedente en ninguno de los 8 sistemas medidos.

# Especificaciones

## Los siete radios

<SNTokens coleccion="border" grupo="radius" titulo="Radios de esquina" />

## Qué número teclear en cada herramienta

La escala vive en píxeles porque su fuente es Figma. Fuera de Figma el número cambia, y en una de las tres herramientas deja de ser una longitud.

`Unidades y medios` guarda la regla general: la constante de conversión, por qué un redondeo no se traduce y qué pasa en impreso. Se escribe una sola vez y sirve a los seis fundamentos.

**Hay una cuarta herramienta.** El equipo también produce diseño en código, con Claude. Ahí no hay número que teclear. El token se consume literal: se escribe `radius/m`, no `12`.

**Es el caso de referencia.** Figma, Illustrator y Slides no saben leer un token, y por eso obligan a resolverlo a un número. El código no lo resuelve nunca. Es el único sitio donde cambiar la escala llega solo.

**El código no va ahí.** Las tres pestañas responden «¿qué número tecleo?». Para el código la respuesta no es otro número. Es que la pregunta no aplica. Ponerlo junto a las otras tres lo volvería un cuarto destino de conversión.

#### Figma

Los siete valores tal cual, en píxeles. Es la fuente de verdad de la escala y no hay conversión que hacer.

| Token | Radio |
| --- | --- |
| `radius/zero` | 0 px |
| `radius/xs` | 4 px |
| `radius/s` | 8 px |
| `radius/m` | 12 px |
| `radius/l` | 16 px |
| `radius/xl` | 24 px |
| `radius/full` | 999 px |

#### Illustrator

Configura el documento en píxeles y teclea el mismo número.

Si el entregable exige puntos, la constante es multiplicar por 0,75. Sale del estándar y no de una costumbre: CSS Values 4 fija 1 in en 96 px, y 1 pt en un setentaidosavo de pulgada.

| Token | px | pt |
| --- | --- | --- |
| `radius/xs` | 4 | 3 |
| `radius/s` | 8 | 6 |
| `radius/m` | 12 | 9 |
| `radius/l` | 16 | 12 |
| `radius/xl` | 24 | 18 |

`radius/full` no se traduce. Es un centinela y no una medida: redondea del todo a cualquier tamaño. En Illustrator eso es la mitad del lado corto, calculada sobre la forma que tengas delante.

<SNCallout type="Warning">
**Hueco declarado.** Adobe no publica en qué unidad lee el campo Corner Radius. Las tres páginas de ayuda consultadas devolvieron 403 el 30 sep 2026. La conversión está verificada contra el W3C, la interfaz no. Comprueba la unidad del documento antes de teclear.
</SNCallout>

#### Google Slides

**No se puede automatizar.** Sí se puede aplicar a mano, y son dos cosas distintas. Decir solo la primera deja sin salida a quien arma la slide. No hay forma de pedirle el radio a la API. Sí hay una cuenta que da el número al que llegar.

El redondeo de una forma en Slides no es una longitud. Es una razón del lado corto. La misma tarjeta a dos tamaños sale con dos redondeces distintas, así que ninguna columna de puntos lo arregla. El problema no es de conversión sino de modelo.

**El número no es un radio.** Es un porcentaje, y depende de la forma que tengas delante.

`porcentaje = radio en px ÷ lado corto de la forma en px × 100`, con tope en 50.

El lado corto en píxeles sale de las pulgadas que da el panel *Tamaño y rotación*, por 96. Es la misma constante del W3C que usa la pestaña de Illustrator.

**Slides solo acepta porcentajes enteros.** No hay decimales. Medido en Slides el 30 sep 2026. Eso no impide usar la escala, pero decide el tamaño de la tarjeta antes que el radio.

**Elige el lado corto.** Es la salida buena, y convierte la limitación en una regla de composición. Pon la unidad de la presentación en píxeles y dimensiona la tarjeta con uno de estos lados. El radio sale exacto y no hay que redondear nada.

| Lado corto | `radius/xs` 4 px | `radius/s` 8 px | `radius/m` 12 px | `radius/l` 16 px | `radius/xl` 24 px |
| --- | --- | --- | --- | --- | --- |
| 400 px | 1 % | 2 % | 3 % | 4 % | 6 % |
| 200 px | 2 % | 4 % | 6 % | 8 % | 12 % |
| 100 px | 4 % | 8 % | 12 % | 16 % | 24 % |
| 80 px | 5 % | 10 % | 15 % | 20 % | 30 % |
| 50 px | 8 % | 16 % | 24 % | 32 % | 48 % |

**La regla general.** Si tu medida no está en la tabla, cualquier lado corto que divida a 400 da los cinco radios enteros. Los siguientes son 25 px, 20 px y 16 px. Por debajo de 50 px, `radius/xl` se pasa del tope del 50 % y deja de existir.

**Si la tarjeta ya existe.** El radio se desvía, y conviene saber cuánto. Un punto porcentual vale el lado corto entre 100. El error de redondeo nunca pasa de la mitad de eso. Con lado corto 192 px, `radius/m` pide 6,25 % y solo hay 6 % o 7 %. El 6 % da 11,5 px y el 7 % da 13,4 px. Ninguno da 12. **Elige el más cercano.** Con 192 px eso es 6 %, medio píxel por debajo.

**Dos posiciones son exactas siempre.** El tirador del todo hacia fuera es 0 %, y es `radius/zero`. El tirador del todo hacia dentro es el 50 % del lado corto, que es exactamente `radius/full`. La píldora sale bien a cualquier tamaño y no hay nada que medir. `radius/full` es el único radio que no depende del tamaño de la tarjeta.

<SNCallout type="Warning">
**Hueco declarado.** La escala vive en píxeles y el control de Slides en porcentajes enteros. Las dos solo coinciden cuando el lado corto lo permite. Si la tarjeta ya está dimensionada y el radio tiene que ser exacto al píxel, pega la forma como imagen desde Figma.
</SNCallout>

<SNCallout type="Info">
**De dónde salen rango y unidad.** Google documenta que el tipo `ROUND_RECTANGLE` corresponde al `roundRect` de ECMA-376. Documenta también que `ShapeProperties` no expone radio, ajuste ni geometría. Verificado sobre la referencia REST el 30 sep 2026. El rango y la unidad no los publica Google. Los publica ECMA-376, al que su propia referencia remite. El ajuste se recorta con `pin 0 adj 50000`, y el radio se calcula `ss × adj ÷ 100000`, donde `ss` es el lado corto. De ahí salen el tope del 50 % y la unidad, que es una fracción y no una longitud. Cobertura de la fuente: las preguntas eran tres, y fuente primaria de Google contesta 1 de 3. Las otras 2 las contesta ECMA-376. La ayuda de Slides no documenta ninguna, y solo describe el tirador de ajuste. Y una cuarta cosa no la documenta nadie: que el control solo acepte enteros. ECMA-376 permite pasos de milésima de punto porcentual, así que el redondeo a entero lo impone la interfaz y no el modelo. Ese dato sale de una medición del equipo en Slides el 30 sep 2026, no de una fuente publicada.
</SNCallout>

**El grosor va aparte.** Está en `Bordes`, en esta misma pestaña.

## Accesibilidad de la escala

WCAG no fija ningún criterio sobre el radio de una esquina. Un radio no cambia el contraste ni la estructura semántica.

<SNCallout type="Warning">
**Hueco declarado.** La interacción entre radio y área táctil no está medida. Un radio grande recorta las esquinas del rectángulo que el dedo alcanza. Nadie ha comprobado si algún control con `radius/full` queda por debajo del mínimo de 2.5.8.
</SNCallout>

# Estatus y cambios

## Cómo se añade un radio

Tres condiciones para que entre un peldaño nuevo, y las tres ya son doctrina de la casa.

**Alias antes que valor.** Un radio nuevo sale de la colección `unit`. Solo se escribe directo cuando la rejilla no puede expresarlo, y entonces el token declara el motivo en su descripción. `radius/full` es el único caso.

**El nombre dice la función.** `radius/full` se llama así porque redondea del todo, no porque produzca una píldora. Es la sección 0 de la convención de nombres.

**Nunca dupliques.** Dos tokens con el mismo par de valores son un alias mal hecho. La regla vive en la sección 2d de la convención.

**Y una condición que sí falta.** No hay decidido quién aprueba un peldaño nuevo ni dónde se registra la petición. Queda declarado como hueco, no rellenado.

## Changelog

| Fecha | Qué cambió | Por qué |
| --- | --- | --- |
| 23 sep 2026 | `radius/xl` deja de estar declarado sin uso | Se midieron los 5 componentes del Chip. La declaración anterior salía de una muestra del Playground y era falsa |
| 23 sep 2026 | `~radius/circle` y `~radius/pill` se sustituyen por `radius/full` | Eran dos tokens para un solo mecanismo. Medido sobre 8 design systems: 8 de 8 usan un token único y 6 de 8 lo llaman `full` |

## Deprecación y migración

**Dos tokens retirados, un solo sustituto.** `~radius/circle` y `~radius/pill` se migraron a `radius/full` el 23 sep 2026. Los tres valían 999, así que la migración no movió un píxel.

Si encuentras `~radius/circle` o `~radius/pill` citados en un archivo o en código, apuntan a un token que ya no existe. El sustituto es `radius/full` en los dos casos, y no hay que elegir: redondear del todo es un solo mecanismo.
