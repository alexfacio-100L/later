# Resumen general

Un borde separa una superficie de la de al lado cuando el color de fondo no basta. En Later un borde son dos decisiones: cuánto grosor y de qué color.

## Qué es y qué resuelve

El grosor dice cuánta presencia tiene la separación. El color dice qué significa.

Las dos decisiones se toman por separado y viven en colecciones distintas. Los seis grosores están en la colección `border`. Los trece colores están en `semanticColors`.

<SNCallout type="Info">
**El radio no se decide aquí.** Vive en `Curvas esquinadas`, que documenta los siete tokens `radius/*` de la misma colección `border`. Grosor y radio comparten colección y no comparten ni un token: la intersección es de 0 sobre 13.
</SNCallout>

## Cómo se eligió la escala

La rejilla del sistema es la colección `unit`, y empieza en 2. Cuatro de los seis grosores son alias de esa rejilla: `zero`, `m` sobre `unit/2`, `l` sobre `unit/4` y `xl` sobre `unit/8`.

Los otros dos son valores directos, y el motivo es que la rejilla no puede expresarlos. `width/xs` vale 1 px y `width/s` vale 1.5 px. Una rejilla de 4 no contiene ninguno de los dos.

Un hairline de 1 px no cabe en la rejilla y sigue siendo el borde correcto por defecto. Escribirlo directo no incumple la convención: la cumple declarando por qué.

Los colores de borde no son una escala. Son trece intenciones, y cada una alias de un primitivo distinto por mode.

<SNCallout type="Warning">
**La evidencia cubre un destino.** Las cifras de uso salen del archivo de producto digital. La escala rige los tres destinos, y su uso medido todavía no los cubre.
</SNCallout>

## Fundamentos relacionados

`Curvas esquinadas` decide el radio de la misma caja. `Color` decide de qué primitivo sale cada color de borde. `Dimensiones` decide el tamaño del elemento que lleva el borde.

<SNCallout type="Warning">
**Solo dos siguen vacías.** `Color` y `Dimensiones` no tienen contenido, así que van nombradas y no enlazadas. `Curvas esquinadas` se publicó el 23 sep 2026.
</SNCallout>

# Usos

## Qué grosor para qué papel

El grosor no se elige por gusto. Se elige por el papel que hace el borde y por la talla del componente.

| Token | Valor | Qué papel hace | Uso medido |
| --- | --- | --- | --- |
| `width/zero` | 0 | Apagar un borde heredado | No es «sin borde»: es un apagado explícito |
| `width/xs` | 1 px | El borde por defecto del sistema | Producto digital: Button `secondary` y campos de formulario |
| `width/s` | 1.5 px | Marcar un elemento señalado, en tallas s y m | Producto digital: el anillo de foco del Button |
| `width/m` | 2 px | Marcar un elemento señalado, en talla l | Producto digital: el anillo de foco del Button |
| `width/l` | 4 px | Barra de acento | Producto digital: 27 bindings en Alerts tallas S y M, y en Select |
| `width/xl` | 8 px | Barra de acento en talla L | Producto digital: 5 bindings en Alerts, medido el 23 sep 2026 |

**Dos grosores escalan con la talla.** El peldaño que marca un elemento señalado pasa de 1.5 px a 2 px en la talla l. La barra de acento pasa de 4 px a 8 px en la talla L.

**Dos peldaños, un solo destino.** `width/s` y `width/m` existen hoy por el anillo de foco, que es de producto digital. El peldaño es de la escala; su único consumidor medido, no.

## Qué color de borde para qué intención

Los trece colores se agrupan en cuatro familias por la decisión que resuelven.

| Familia | Tokens | Cuándo |
| --- | --- | --- |
| Estructura | `border/primary` · `border/subtle` · `border/inverse` · `border/inverseStatic` | Separar cajas sin decir nada más |
| Estado | `border/info` · `border/warning` · `border/negative` · `border/positive` · `border/positiveHighlight` | El contenedor comunica un resultado |
| Marca | `border/brand` | El borde representa a Later |

Faltan tres de los trece, y es a propósito. `border/focus`, `border/selected` y `border/disabled` son de interacción, y una interacción no existe fuera de una pantalla.

`border/primary` es el borde estructural por defecto. `border/subtle` y `border/inverse` no cambian de valor: valen `#DADADA` siempre.

## Cuándo no usarla

**No escribas un grosor intermedio.** Entre 1.5 px y 2 px no hay peldaño porque no hace falta ninguno. Un valor suelto rompe el consumo del token más adelante.

**El color no basta.** `border/negative` acompaña siempre a un mensaje con `text/negative`. Si algo solo advierte y no ha fallado, va `border/warning`.

**No uses `width/zero` para decir «sin borde».** Existe para apagar un borde heredado, y lo mismo vale para `radius/zero`.

## El borde en producto digital

**Tres colores son de interacción.** `border/focus` dice que el control responde al teclado, `border/selected` que está elegido y `border/disabled` que no se puede usar.

**El foco cambia una medida.** Es el único estado que lo hace: el anillo pasa de 1.5 px a 2 px en la talla l. Ninguna otra medida del sistema se mueve por estado.

**Invertir obliga a invertir.** `border/positive` cambia de valor entre Light y Dark. Sobre un relleno de marca el par pasa en Light por coincidencia y se rompe en Dark. Ahí va `border/subtle` o `border/inverse`.

**No uses `border/info` ni `border/selected` en un control interactivo.** Los tres comparten el valor `#1C64EB` con `border/focus`. El usuario leerá foco donde no lo hay.

# Especificaciones

## Los seis grosores

<SNTokens coleccion="border" grupo="width" titulo="Grosores de borde" />

## Los trece colores de borde

<SNTokens coleccion="semanticColors" grupo="border" titulo="Colores de borde" modes="light,dark" />

<SNCallout type="Info">
**Un token queda fuera a propósito.** Su nombre lleva la palabra `border`. `graphs/basicConfig/borderColor` pertenece a la configuración de gráficas, junto a otros once tokens. Un listado plano lo hace parecer un catorceavo color de borde.
</SNCallout>

## Accesibilidad de la escala

Un borde que comunica algo es un elemento no textual, y WCAG 1.4.11 le pide 3:1 contra lo que tiene al lado. El mínimo de un borde informativo es 3:1, no 4.5:1.

El sistema no tiene criterio medido de grosor mínimo visible. El hairline de 1 px es el suelo de la escala. Nadie ha comprobado si se sostiene en una pantalla de baja densidad ni al imprimir. Queda declarado como hueco.

## Qué número teclear en cada herramienta

La escala vive en píxeles porque su fuente es Figma. Fuera de Figma el número cambia, y no cambia igual en todas partes.

`Unidades y medios` guarda la regla general: la constante de conversión, por qué un redondeo no se traduce y qué pasa en impreso. Se escribe una sola vez y sirve a los seis fundamentos.

**Hay una cuarta herramienta.** El equipo también produce diseño en código, con Claude. Ahí no hay número que teclear. El token se consume literal: se escribe `width/xs`, no `1`.

**Es el caso de referencia.** Figma, Illustrator y Slides no saben leer un token, y por eso obligan a resolverlo a un número. El código no lo resuelve nunca. Es el único sitio donde cambiar la escala llega solo.

**El código no va ahí.** Las tres pestañas responden «¿qué número tecleo?». Para el código la respuesta no es otro número. Es que la pregunta no aplica. Ponerlo junto a las otras tres lo volvería un cuarto destino de conversión.

#### Figma

Los seis valores tal cual, en píxeles. Es la fuente de verdad de la escala y no hay conversión que hacer.

| Token | Grosor |
| --- | --- |
| `width/zero` | 0 px |
| `width/xs` | 1 px |
| `width/s` | 1.5 px |
| `width/m` | 2 px |
| `width/l` | 4 px |
| `width/xl` | 8 px |

#### Illustrator

Configura el documento en píxeles y teclea el mismo número.

Si el entregable exige puntos, la constante es multiplicar por 0,75. Sale del estándar y no de una costumbre: CSS Values 4 fija 1 in en 96 px, y 1 pt en un setentaidosavo de pulgada.

| Token | px | pt |
| --- | --- | --- |
| `width/xs` | 1 | 0,75 |
| `width/s` | 1.5 | 1,125 |
| `width/m` | 2 | 1,5 |
| `width/l` | 4 | 3 |
| `width/xl` | 8 | 6 |

<SNCallout type="Warning">
**Hueco declarado.** Adobe no publica en qué unidad lee el campo de grosor de trazo. Las tres páginas de ayuda consultadas devolvieron 403 el 30 sep 2026. La conversión está verificada contra el W3C, la interfaz no. Comprueba la unidad del documento antes de teclear.
</SNCallout>

#### Google Slides

**El grosor sale de un menú.** No es un campo libre. Es una lista cerrada, y sus valores vienen en píxeles. Medido en Slides el 30 sep 2026.

La lista es 1, 2, 3, 4, 8, 12, 16 y 24 píxeles.

**No hay conversión que hacer.** El valor del token se elige tal cual, sin pasar por puntos. Es la única de las tres herramientas donde la escala entra sin traducir.

| Token | px | En el menú |
| --- | --- | --- |
| `width/zero` | 0 | Se apaga el borde |
| `width/xs` | 1 | 1 |
| `width/s` | 1.5 | No existe |
| `width/m` | 2 | 2 |
| `width/l` | 4 | 4 |
| `width/xl` | 8 | 8 |

**Cinco de los seis entran exactos.** El que falta es `width/s`, y no es casualidad. Es el único peldaño de la escala que no es entero. **Sube, nunca bajes.** Con 1,5 px vas a `width/m`, no a `width/xs`. El sistema ya declara que entre 1,5 px y 2 px no hay peldaño, así que subir no inventa nada.

<SNCallout type="Info">
**La API no es el menú.** `Outline.weight` es una `Dimension` y acepta cualquier valor, así que por API los seis grosores entran exactos, `width/s` incluido. Apps Script lo dice en puntos: el grosor es «the thickness of the border in points». El menú de la barra no tiene esa libertad, y quien arma la slide usa el menú. La restricción que manda es la del menú. La unidad y el modelo están verificados sobre Apps Script `Class Border` y la referencia REST el 30 sep 2026. La lista de valores es medición del equipo en Slides el mismo día, porque Google no la publica.
</SNCallout>

El radio es otra cosa y vive en `Curvas esquinadas`, en esta misma pestaña.

## El contraste en producto digital

`border/focus` no es decorativo. Es requisito y debe verse en todo control interactivo.

<SNCallout type="Warning">
**Un par no llega al umbral.** En Dark, `border/primary` da 3.66:1 sobre `background/primary`. Sobre `background/secondary` da 2.84:1. Sobre `background/subtle` da solo 1.81:1. Medido el 4 sep 2026.
</SNCallout>

# Estatus y cambios

## Cómo se añade un grosor o un color

Tres condiciones para que entre un peldaño nuevo, y las tres ya son doctrina de la casa.

**Alias antes que valor.** Un grosor nuevo sale de la colección `unit`. Solo se escribe directo cuando la rejilla no puede expresarlo, y entonces el token declara el motivo en su descripción.

**El nombre dice la función.** `width/xs` se llama así porque es el peldaño más fino de la escala. No se llama por dónde se usa, que son el campo de formulario y el Button `secondary`. Es la sección 0 de la convención de nombres.

**Nunca dupliques.** Dos tokens con el mismo par de valores son un alias mal hecho. La regla vive en la sección 2d de la convención.

**Y una condición que sí falta.** No hay decidido quién aprueba un peldaño nuevo ni dónde se registra la petición. Queda declarado como hueco, no rellenado.

## Changelog

| Fecha | Qué cambió | Por qué |
| --- | --- | --- |
| 1 oct 2026 | `Curvas esquinadas` deja de estar declarada vacía | Está publicada desde el 23 sep 2026, y la declaración ya era falsa |
| 1 oct 2026 | Lo que solo sirve a producto digital pasa a secciones que lo nombran en su título | El sistema alimenta producto, marketing e impresos, y dos de los tres no se veían reflejados |
| 1 oct 2026 | Se declara que las cifras de uso salen del archivo de producto digital | Un uso medido sin destino declarado se lee como si cubriera los tres |
| 23 sep 2026 | `width/l` y `width/xl` dejan de estar declarados sin uso | Se midieron 27 y 5 bindings. La declaración anterior salía de una muestra del Playground y era falsa |
| 4 sep 2026 | `border/primary` en Dark sube de `neutral/700` a `neutral/600` | Valía `#404040`, que ese mismo día pasó a ser `background/subtle`. El borde desaparecía sobre una de las tres superficies |
| 4 sep 2026 | `~border/secondary` pasa a llamarse `border/inverseStatic` | El nombre mentía. Valía `#FFFFFF` en los dos modes, y sobre `background/secondary` en Light daba 1.00:1 |

## Deprecación y migración

**Un solo token retirado.** `~border/secondary` se llama hoy `border/inverseStatic`. Fue un renombrado y no un cambio de valor, así que nada de lo que lo consumía cambió de aspecto.

Ningún grosor está deprecado. Los seis siguen vivos y los seis tienen uso medido.
