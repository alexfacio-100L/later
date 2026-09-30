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

## Fundamentos relacionados

`Curvas esquinadas` decide el radio de la misma caja. `Color` decide de qué primitivo sale cada color de borde. `Dimensiones` decide el tamaño del elemento que lleva el borde.

<SNCallout type="Warning">
**Las tres páginas están vacías.** Por eso van nombradas y no enlazadas. Un enlace a una página vacía cuesta más que un nombre en negrita.
</SNCallout>

# Usos

## Qué grosor para qué tamaño

El grosor no se elige por gusto. Se elige por el papel que hace el borde y por la talla del componente.

| Token | Valor | Para qué | Uso medido |
| --- | --- | --- | --- |
| `width/zero` | 0 | Apagar un borde heredado en código | No es «sin borde»: es un apagado explícito |
| `width/xs` | 1 px | El borde por defecto del sistema | Button `secondary` y campos de formulario |
| `width/s` | 1.5 px | Anillo de foco en tallas s y m | Button, medido |
| `width/m` | 2 px | Anillo de foco en talla l | Button, medido |
| `width/l` | 4 px | Barra de acento | 27 bindings en Alerts tallas S y M, y en Select |
| `width/xl` | 8 px | Barra de acento en talla L | 5 bindings en Alerts, medido el 23 sep 2026 |

**Dos grosores escalan con la talla.** El anillo de foco pasa de 1.5 px a 2 px en la talla l. La barra de acento pasa de 4 px a 8 px en la talla L.

El foco es el único estado que cambia una medida en el sistema, y la cambia según la talla.

## Qué color de borde para qué intención

Los trece colores se agrupan en cuatro familias por la decisión que resuelven.

| Familia | Tokens | Cuándo |
| --- | --- | --- |
| Estructura | `border/primary` · `border/subtle` · `border/inverse` · `border/inverseStatic` | Separar cajas sin decir nada más |
| Interacción | `border/focus` · `border/selected` · `border/disabled` | El control responde al teclado, está elegido, o no se puede usar |
| Estado | `border/info` · `border/warning` · `border/negative` · `border/positive` · `border/positiveHighlight` | El contenedor comunica un resultado |
| Marca | `border/brand` | El borde representa a Later |

`border/primary` es el borde estructural por defecto. `border/subtle` y `border/inverse` son estáticos a propósito: valen `#DADADA` en los dos modes.

## Cuándo no usarla

**Invertir obliga a invertir.** `border/positive` cambia de valor entre Light y Dark. Sobre un relleno de marca el par pasa en Light por coincidencia y se rompe en Dark. Ahí va `border/subtle` o `border/inverse`.

**No uses `border/info` ni `border/selected` en un control interactivo.** Los tres comparten el valor `#1C64EB` con `border/focus`. El usuario leerá foco donde no lo hay.

**No escribas un grosor intermedio.** Entre 1.5 px y 2 px no hay peldaño porque no hace falta ninguno. Un valor suelto rompe el consumo del token en código.

**El color no basta.** `border/negative` acompaña siempre a un mensaje con `text/negative`. Si el campo solo advierte y no ha fallado, va `border/warning`.

**No uses `width/zero` para decir «sin borde».** Existe para apagar un borde heredado, y lo mismo vale para `radius/zero`.

# Especificaciones

## Los seis grosores

<SNTokens coleccion="border" grupo="width" titulo="Grosores de borde" />

## Los trece colores de borde

<SNTokens coleccion="semanticColors" grupo="border" titulo="Colores de borde" modes="light,dark" />

<SNCallout type="Info">
**Un token queda fuera a propósito.** Su nombre lleva la palabra `border`. `graphs/basicConfig/borderColor` pertenece a la configuración de gráficas, junto a otros once tokens. Un listado plano lo hace parecer un catorceavo color de borde.
</SNCallout>

## Qué número teclear en cada herramienta

La escala vive en píxeles porque su fuente es Figma. Fuera de Figma el número cambia, y no cambia igual en todas partes.

`Unidades y medios` guarda la regla general: la constante de conversión, por qué un redondeo no se traduce y qué pasa en impreso. Se escribe una sola vez y sirve a los seis fundamentos.

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

**El grosor sí se puede.** La API de Slides expresa el contorno de una forma como `Outline.weight`. Es una `Dimension`, o sea una magnitud con su unidad, así que un grosor es un número de verdad.

Teclea el valor en puntos. Lo que no se puede es el radio, y `Curvas esquinadas` responde distinto en esa misma pestaña. Verificado sobre la referencia REST de Google el 30 sep 2026.

## Accesibilidad de la escala

Un borde que comunica algo es un elemento no textual, y WCAG 1.4.11 le pide 3:1 contra lo que tiene al lado. El mínimo de un borde informativo es 3:1, no 4.5:1.

`border/focus` no es decorativo. Es requisito y debe verse en todo control interactivo.

<SNCallout type="Warning">
**Un par no llega al umbral.** En Dark, `border/primary` da 3.66:1 sobre `background/primary`. Sobre `background/secondary` da 2.84:1. Sobre `background/subtle` da solo 1.81:1. Medido el 4 sep 2026.
</SNCallout>

El sistema no tiene criterio medido de grosor mínimo visible. El hairline de 1 px es el suelo de la escala, y nadie ha comprobado si se sostiene en pantallas de baja densidad. Queda declarado como hueco.

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
| 23 sep 2026 | `width/l` y `width/xl` dejan de estar declarados sin uso | Se midieron 27 y 5 bindings. La declaración anterior salía de una muestra del Playground y era falsa |
| 4 sep 2026 | `border/primary` en Dark sube de `neutral/700` a `neutral/600` | Valía `#404040`, que ese mismo día pasó a ser `background/subtle`. El borde desaparecía sobre una de las tres superficies |
| 4 sep 2026 | `~border/secondary` pasa a llamarse `border/inverseStatic` | El nombre mentía. Valía `#FFFFFF` en los dos modes, y sobre `background/secondary` en Light daba 1.00:1 |

## Deprecación y migración

**Un solo token retirado.** `~border/secondary` se llama hoy `border/inverseStatic`. Fue un renombrado y no un cambio de valor, así que nada de lo que lo consumía cambió de aspecto.

Ningún grosor está deprecado. Los seis siguen vivos y los seis tienen uso medido.
