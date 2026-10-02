# Resumen general

[🔴 LA REGLA DE REPARTO, y va antes que cualquier otra cosa porque decide dónde cae todo lo demás: el cuerpo no nombra una tecnología ni un destino; un apartado lo nombra en su título.]

[El test, y es decidible sin juicio: si una sección solo la puede usar una de las tres audiencias, no es cuerpo, es apartado. Las tres son producto, marketing e impresos. Atlassian y Carbon no son agnósticos y hacen bien, porque su sistema ES web; Later alimenta tres destinos.]

[Se comprueba leyendo encabezados, y la comprueba un comando. Una regla que exige criterio para ejecutarse no se ejecuta.]

[🔴 LO QUE BAJA AL APARTADO ES EL USO, NO EL PELDAÑO. Un peldaño de la escala se queda en el cuerpo aunque su único consumidor medido sea de un destino. Su fila declara de qué destino sale ese uso.]

[El caso que lo fijó: `width/s` vale 1.5 px y hoy solo lo usa el anillo de foco, que es de producto digital. Bajarlo habría recortado la escala publicada de seis grosores a cuatro.]

[Un peldaño no deja de ser del sistema porque hoy solo lo use un destino. Lo contrario publica una escala mutilada.]

[🔴 UN APARTADO CON VARIAS PARTES SE AGRUPA, NO SE REPARTE EN SECCIONES SUELTAS. Un título de nivel 2 nombra el destino, y sus partes cuelgan en nivel 3. Así el destino se nombra una vez y no hay que repetirlo en cada subtítulo.]

[Y el orden dentro de una pestaña es siempre el mismo: primero todo el cuerpo, después los apartados. Una vez que aparece un apartado no vuelve a aparecer cuerpo. Changelog y Deprecación son la excepción, y van al final por prescripción de abajo.]

[Una o dos frases. Qué es el fundamento y qué problema resuelve. Sin metáforas y sin abrir con el nombre del fundamento: la página ya lo lleva de título.]

## Qué es y qué resuelve

[Para qué existe la escala. Qué decisión le quita de encima a quien diseña. Un fundamento sin esto se lee como una lista de números.]

[Dilo sin nombrar el medio. Si la frase necesita la palabra pantalla, ventana o navegador para sostenerse, pertenece a un apartado.]

## Cómo se eligió la escala

[La razón de los peldaños, no su listado. Cuál es la unidad base, qué razón sigue la progresión, y por qué esos valores y no otros.]

[Declara cuántos peldaños son alias de la rejilla base y cuántos son valores directos, con la cifra. Un valor directo siempre lleva su motivo: la rejilla no puede expresarlo.]

[Base declara la razón matemática de su espaciado. Atlassian no. Declararla es la práctica buena, y es la pregunta que llega sola.]

[🔴 LA PROCEDENCIA DE LA EVIDENCIA ES OBLIGATORIA. Di de qué destino salen las cifras de uso que cites. Si salen de uno solo, ponlo en un callout y nómbralo.]

[Un uso medido sin destino declarado se lee como si cubriera los tres. Hoy toda la medición sale del archivo de producto digital, así que el callout aplica salvo que midas otra cosa.]

## Fundamentos relacionados

[Nombra los fundamentos que se deciden junto a éste, con qué se decide en cada uno. Módulo opcional.]

[No enlaces a una página vacía. Un enlace a un hueco cuesta más que un nombre en negrita.]

## El fundamento en producto digital

[MÓDULO OPCIONAL POR DESTINO. Aquí vive lo que solo sirve a un destino: modelos de navegación, rejillas de aplicación, comportamiento al cambiar de tamaño. Bórralo si no hay nada que solo valga para uno.]

[El título nombra el destino, nunca la estructura del documento. La rejilla en producto digital sí; apartado específico no. Sustituye la palabra fundamento por el nombre real.]

[Repite el módulo por cada destino que tenga contenido propio. Un destino sin contenido no lleva sección vacía: no lleva sección.]

# Usos

## Qué valor para qué caso

[La regla de decisión, no un inventario. Base documenta a qué tamaño de componente pertenece cada valor, y eso convierte una escala en un criterio.]

[Un peldaño por fila, con la RELACIÓN que resuelve y el uso medido que lo respalda. Describe la relación, no el campo donde se teclea: dos partes pegadas de una misma pieza vale en los tres destinos, relleno de un control solo en uno.]

[Si un peldaño no tiene uso medido, dilo en su fila. No lo rellenes.]

[Marca los peldaños que escalan con la talla. Son los que más se eligen mal.]

## Cuándo no usarla

[Los casos en que la escala no aplica o se usa mal. Valores intermedios, saltarse peldaños, mezclar familias.]

[Cada regla lleva qué pasa si se incumple. Una prohibición sin consecuencia no se respeta.]

[Pasa por el test una por una. Una prohibición que solo tiene sentido en pantalla baja al módulo de abajo.]

## Cómo se elige en producto digital

[MÓDULO OPCIONAL POR DESTINO. Las reglas de elección que solo valen en un destino. Bórralo si no hay ninguna.]

# Especificaciones

## La escala completa

[Un bloque vivo por familia. Nunca una tabla escrita a mano: los valores caducan y nadie lo nota. Sustituye los tres valores en mayúsculas del marcador de abajo.]

<SNTokens coleccion="COLECCION" grupo="GRUPO" titulo="TITULO DEL BLOQUE" />

[Un fundamento con más de una familia emite un bloque por cada una, con su encabezado. El grosor y el color de un borde son dos familias, y viven en colecciones distintas.]

[Para una familia de color, añade `modes="light,dark"` y el bloque muestra los dos valores.]

## Accesibilidad de la escala

[SOLO LO QUE VALE EN CUALQUIER MEDIO. Contraste, distinción entre dos cosas, tamaño mínimo legible. El criterio citado por número cuando exista.]

[Los pares que no llegan al umbral van aquí, con su ratio medido. Un hueco declarado vale más que un silencio.]

[🔴 PARTIDA A PROPÓSITO. Un criterio de WCAG que exige una pantalla táctil no vale en papel, así que no es cuerpo. El área táctil y la separación entre destinos táctiles bajan al módulo de producto digital.]

## Cómo se expresa en cada herramienta

[EL APARTADO POR HERRAMIENTA. Qué cambia al salir de la herramienta de origen.]

[Di primero de qué clase es la instrucción, porque no es la misma en todas las escalas. En grosor y en radio lo que viaja es un número que se teclea. En separación no hay campo que teclear fuera de una herramienta con auto-layout, y lo que viaja es el repertorio de peldaños.]

[🔴 COMPLETO O NO SE ENTREGA, Y SALE DEL MECANISMO, NO DEL GUSTO. El publicador sale con código 1 si declaras una herramienta y agrupa menos de las declaradas. Una pestaña sola no es una pestaña, y un título de nivel 4 suelto se publica como título colgado, sin error y sin hueco visible.]

[Mientras falte alguna de las tres, baja el bloque a nivel 3 y declara el hueco con su fecha. No publiques una sola en nivel 4 esperando completar después.]

#### Figma

[La fuente de verdad de la escala. Qué se aplica, desde dónde, y si el valor arrastra el token o hay que bindear a mano.]

#### Illustrator

[Qué unidad lee el campo y cuál es la constante de conversión, con su fuente. Si la referencia del fabricante no se pudo consultar, dilo con la fecha y mide en la aplicación.]

#### Google Slides

[Si el valor sale de una lista cerrada, escribe la lista y qué peldaños no entran. La regla de redondeo se declara, no se improvisa.]

## El fundamento en producto digital

[MÓDULO OPCIONAL POR DESTINO. Los valores, umbrales y criterios que solo existen en pantalla: umbrales de ventana, medidas por dispositivo, área táctil.]

# Estatus y cambios

## Cómo se añade un peldaño

[LA GOBERNANZA DE LA ESCALA, y solo de la escala. Ningún sistema del benchmark la documenta, y es la pregunta que bloquea a quien quiere un valor nuevo.]

[Qué condiciones cumple un peldaño para entrar, qué nombre recibe, y quién lo aprueba. Si alguna de las tres no está decidida, declárala como hueco en vez de inventarla.]

[🔴 SON DOS PERMISOS Y NO SE MEZCLAN. Añadir un peldaño a la escala es una decisión del sistema y afecta a los tres destinos. Añadir una medida para un destino solo afecta a ése.]

[Juntarlos hace que quien quiera lo segundo pida permiso para lo primero, y acabe sin pedir ninguno.]

## Cómo se añade una medida en producto digital

[EL SEGUNDO PERMISO. MÓDULO OPCIONAL POR DESTINO. Qué necesita una medida nueva de ese destino, y de dónde salen sus valores.]

[Los valores de un destino salen de la escala del cuerpo. Un valor que no sea un peldaño no entra.]

## Changelog

[Una TABLA de tres columnas: `Fecha | Qué cambió | Por qué`, del cambio más reciente al más antiguo. Misma forma que el molde de componente.]

[Tabla y no viñetas, y hay un motivo que no es de gusto: en una tabla la fecha es una columna. En una viñeta hay que separarla con algo, y la raya está prohibida por V2 del registro editorial. La tabla resuelve el conflicto sin tocar la regla.]

[Un cambio sin fecha no es un hecho, es un recuerdo.]

[Un token retirado se cita con una tilde dentro de los backticks, así: `~grupo/nombre`. La puerta comprueba que de verdad ya no existe, y el publicador borra la tilde antes de escribir.]

## Deprecación y migración

[Qué hacer con los tokens retirados de esta escala: cuál los sustituye, si el valor cambió, y qué tiene que revisar quien los consuma. Módulo opcional: bórralo si la escala no ha retirado nada.]

[Si el valor no cambió, dilo. Es la diferencia entre un renombrado y una migración con riesgo visual.]
