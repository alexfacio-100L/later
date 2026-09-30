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

## Versión y cambios

| Fecha | Qué cambió | Por qué |
| --- | --- | --- |
| 23 sep 2026 | `~radius/circle` y `~radius/pill` se sustituyen por `radius/full` | Eran dos tokens para un solo mecanismo. Medido sobre 8 design systems: 8 de 8 usan un token único y 6 de 8 lo llaman `full` |
| 23 sep 2026 | `radius/xl` deja de estar declarado sin uso | Se midieron los 5 componentes del Chip. La declaración anterior salía de una muestra del Playground y era falsa |
