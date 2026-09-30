# Resumen general

[Una o dos frases. Qué es el fundamento y qué problema resuelve en el producto. Sin metáforas y sin abrir con el nombre del fundamento: la página ya lo lleva de título.]

## Qué es y qué resuelve

[Para qué existe la escala. Qué decisión le quita de encima a quien diseña. Un fundamento sin esto se lee como una lista de números.]

## Cómo se eligió la escala

[La razón de los peldaños, no su listado. Cuál es la unidad base, qué razón sigue la progresión, y por qué esos valores y no otros.]

[Declara cuántos peldaños son alias de la rejilla base y cuántos son valores directos, con la cifra. Un valor directo siempre lleva su motivo: la rejilla no puede expresarlo.]

[Base declara la razón matemática de su espaciado. Atlassian no. Declararla es la práctica buena, y es la pregunta que llega sola.]

## Fundamentos relacionados

[Nombra los fundamentos que se deciden junto a éste, con qué se decide en cada uno. Módulo opcional.]

[No enlaces a una página vacía. Un enlace a un hueco cuesta más que un nombre en negrita.]

# Usos

## Qué valor para qué tamaño

[La regla de decisión, no un inventario. Base documenta a qué tamaño de componente pertenece cada valor, y eso convierte una escala en un criterio.]

[Un peldaño por fila, con el tamaño o el rol de componente que lo pide y el uso medido que lo respalda. Si un peldaño no tiene uso medido, dilo en su fila. No lo rellenes.]

[Marca los peldaños que escalan con la talla del componente. Son los que más se eligen mal.]

## Cuándo no usarla

[Los casos en que la escala no aplica o se usa mal. Valores intermedios, saltarse peldaños, mezclar familias.]

[Cada regla lleva qué pasa si se incumple. Una prohibición sin consecuencia no se respeta.]

# Especificaciones

## La escala completa

[Un bloque vivo por familia. Nunca una tabla escrita a mano: los valores caducan y nadie lo nota. Sustituye los tres valores en mayúsculas del marcador de abajo.]

<SNTokens coleccion="COLECCION" grupo="GRUPO" titulo="TITULO DEL BLOQUE" />

[Un fundamento con más de una familia emite un bloque por cada una, con su encabezado. El grosor y el color de un borde son dos familias, y viven en colecciones distintas.]

[Para una familia de color, añade `modes="light,dark"` y el bloque muestra los dos valores.]

## Accesibilidad de la escala

[Qué exige WCAG sobre estos valores, con el criterio citado por número. Un fundamento no tiene foco ni teclado, pero sí contraste y tamaño mínimo.]

[Los pares que no llegan al umbral van aquí, con su ratio medido. Un hueco declarado vale más que un silencio.]

# Estatus y cambios

## Cómo se añade un peldaño

[La gobernanza de la escala. Ningún sistema del benchmark la documenta, y es la pregunta que bloquea a quien quiere un valor nuevo.]

[Qué condiciones cumple un peldaño para entrar, qué nombre recibe, y quién lo aprueba. Si alguna de las tres no está decidida, declárala como hueco en vez de inventarla.]

## Versión y cambios

[Los cambios de la escala con su fecha y su motivo. Un token retirado se nombra junto al que lo sustituye.]

[Un cambio sin fecha no es un hecho, es un recuerdo.]

[Un token retirado se cita con una tilde dentro de los backticks, así: `~grupo/nombre`. La puerta comprueba que de verdad ya no existe, y el publicador borra la tilde antes de escribir.]
