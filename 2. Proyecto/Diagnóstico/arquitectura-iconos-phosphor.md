# Arquitectura de iconos — el cambio a Phosphor

**19 ago 2026 · análisis de la tarea 4.2, rehecho sobre la librería nueva**

## Por qué se cambió de librería

100 Ladrillos **no tiene iconos propios**: no ha habido tiempo ni dedicación para construirlos, así que se optó por una librería de terceros. En la Fase 1 se evaluaron varias y se eligió **Heroicons**, con apoyo de una becaria que además levantó el inventario de los iconos en producción y abrió un laboratorio para construir los propios. **Ese proyecto quedó pausado al terminar su estancia** y hoy lo hereda la PD Jr.

**Desde 2024 el problema de Heroicons se volvió operativo, y no es de estilo: es de cobertura.** Faltaban iconos para contextos concretos, así que **se pedían bajo demanda** — trabajo fuera del alcance de cada proyecto, que se difería al proyecto de iconos y nunca llegaba.

**Decisión del 19 ago 2026, acordada entre el Lead y la PD Jr: se cambia a Phosphor Icons.**

| | Heroicons | Phosphor |
| --- | --- | --- |
| Cobertura | **Limitada** — la causa del cambio | 1512 iconos |
| Pesos | Solid / Outline | **6 weights** |
| Variantes | 3 tamaños en Solid | 2 formatos técnicos |
| Carácter | Más orgánico | **Más minimalista y menos redondeado** |

*El coste está aceptado y declarado: se pierde algo de carácter orgánico a cambio de cobertura y flexibilidad. Y se pierden los tres tamaños que Heroicons traía en `Solid`, lo que hay que resolver en los componentes que hoy cambian de tamaño de icono — `Tags` entre ellos.*

---

## Lo que hay hoy en la página `↳ Icons`

**1512 component sets · cero componentes sueltos · firma idéntica en los 1512:**

```
Format = Outline | Stroke
Weight = Bold | Duotone | Fill | Light | Regular | Thin
```

**12 variantes por icono → ~18 100 componentes.** Organizados en 18 categorías temáticas (`Arrows`, `Brands`, `Commerce`, `Communication`, `Design`…).

🟢 **El defecto estructural que definía la tarea 4.2 ya no existe.** Antes había **327 sets con eje `size` y 309 componentes sueltos sin él** — dos anatomías para la misma cosa, de modo que intercambiar un icono cambiaba la forma del componente. **Hoy los 1512 tienen la misma firma.** El problema que quedaba por resolver se resolvió al cambiar de librería.

🟢 **Todo el color está ligado:** 1745 referencias en la muestra, **todas a `icon/primary`**, cero valores crudos.

---

## Tres hallazgos que deciden la arquitectura

### 1 · `Format` es `Raw` frente a `Flattened`, y sí tiene propósito

**Consultado en la documentación antes de tratarlo como defecto**, que es la regla del área. La primera lectura fue *"duplicación técnica sin propósito"* y **era incorrecta**.

| | Nodos | Qué es | Nombre oficial |
| --- | --- | --- | --- |
| **`Outline`** | **1 vector** | Trazo **expandido a geometría** — el producto terminado | **Flattened** |
| **`Stroke`** | ~5 vectores | Trazo **vivo y editable** — la fuente | **Raw** |

> **Phosphor conserva la información de trazo "para que puedas afinar el estilo".** Los `Raw` permiten cambiar el grosor, editar los recorridos, generar pesos intermedios y **dibujar iconos nuevos que igualen el estilo exacto de la familia**.

**Y los propios autores ya tomaron partido:** desde la **v2.0.0 el plugin importa Flattened por defecto**, y **cambiaron la librería de Figma a outlines por feedback de usuarios** — *"el archivo sirve mejor a quien lo quiere usar tal cual, y la mayoría no necesita ese control sobre las variaciones de trazo"*.

**Verificado por nuestra parte: los seis weights se ven idénticos en los dos formatos.** No hay diferencia visual que justifique exponer ambos en el set.

#### La decisión que se sigue de esto

**`Stroke` no se borra: se separa.**

- **`Outline` es lo que se publica** — el set del sistema, lo que consumen los componentes. Escala sin deformarse, porque un contorno relleno mantiene su proporción a cualquier tamaño, mientras que un trazo vivo conserva el grosor absoluto y **al reducir de 32 a 16 px se ve proporcionalmente más grueso**.
- **`Stroke` se archiva en `1. Recursos`**, que es exactamente lo que ese nivel define en el modelo IPO: *material en bruto de terceros que no se edita*.

🟢 **Y tiene un consumidor concreto: el proyecto de iconos propios.** Cuando se retome el laboratorio y haya que dibujar los iconos que Phosphor no cubra —la razón misma del cambio de librería—, **los `Raw` son la referencia que permite igualar el trazo.** Borrarlos sería tirar justo la pieza que ese proyecto necesita.

*Efecto sobre el set publicado: de ~18 100 a ~9 100 componentes, sin perder ni un dato.*

*Fuentes: [phosphor-icons/figma releases](https://github.com/phosphor-icons/figma/releases) · [phosphor-icons/core](https://github.com/phosphor-icons/core) · [archivo de comunidad en Figma](https://www.figma.com/community/file/903830135544202908/phosphor-icons)*

### 2 · `Weight` mezcla dos cosas distintas

Phosphor llama *weight* a los seis, pero **`Thin`, `Light`, `Regular` y `Bold` son grosores; `Fill` y `Duotone` son estilos de relleno.** No es un defecto de Phosphor —es su vocabulario— pero **el sistema no tiene por qué heredarlo.**

Uso previsible en interfaz:

| Valor | Papel esperado |
| --- | --- |
| **`Regular`** | El de por defecto |
| **`Fill`** | Estado activo o seleccionado — el par lleno/vacío es un patrón conocido |
| **`Bold`** | Énfasis puntual |
| `Thin`, `Light` | **Se pierden a 16–24 px**, que es donde vive la interfaz |
| `Duotone` | Requiere **dos colores**; hoy ambos vectores apuntan a `icon/primary` y el segundo se distingue solo por opacidad |

⚠️ **`Duotone` está incompleto, no roto:** funciona visualmente, pero **su segundo tono es opacidad codificada en el nodo, no un token.** Para que sea un duotono de verdad necesita un segundo token propio.

### 3 · No hay eje de tamaño, y la recomendación es no añadirlo

Phosphor viene a **32×32** y el sistema usa **16 / 20 / 24**. Heroicons traía tres tamaños en `Solid` y eso se pierde.

**Recomendación: que el tamaño lo fije el componente que consume el icono, no el icono.** Es lo que ya hace el `Button`, cuya especificación dice *"el tamaño del icono lo decide `size`"*. Con geometría rellena, escalar es seguro.

*Añadir un eje `size` multiplicaría por tres el catálogo y obligaría a mantener tres geometrías por icono para resolver algo que el contenedor ya sabe.* **Lo que sí hace falta son los tokens de tamaño de icono (`16/20/24`), que es la tarea 4.4.**

---

## 🔴 El estado frágil que hay que resolver primero

**Los 636 Heroicons quedaron huérfanos: siguen vivos pero fuera de toda página.** La cadena de padres de `Academic CapSolid` termina en el propio component set, sin página.

**Consecuencias:**

- **Sostienen 150 instancias** en `Button` y `Link` —los cuatro slots `iconLeft`/`iconRight` apuntan ahí— y todas funcionan, porque las instancias referencian por ID, no por ubicación.
- **Pero no se ven, no se gestionan y no se pueden publicar.**
- **Si alguien limpia el archivo, esas 150 instancias se rompen.**

**El swap a Phosphor no es cosmético: es lo que saca al sistema de este estado intermedio.** Y hay que hacerlo antes de publicar la librería.

---

## Lo que queda por decidir

| # | Decisión | Recomendación |
| --- | --- | --- |
| 1 | ¿Qué se hace con `Format=Stroke`? | **Sacarlo del set publicado y archivarlo en `1. Recursos`** — es la fuente editable (`Raw`), no una copia. La necesita el proyecto de iconos propios |
| 2 | ¿Cuántos `Weight` se conservan? | Empezar por **`Regular`, `Fill`, `Bold`**; evaluar `Thin`/`Light` con un caso real antes de borrarlos |
| 3 | ¿Se publican los 1512? | Sí, **agrupados por sus 18 categorías** — la cobertura era el motivo del cambio, recortarla lo desharía |
| 4 | `Duotone` | Darle **un segundo token** o declararlo fuera de alcance |
| 5 | El swap de componentes | Mapear los iconos de Heroicons en uso → Phosphor, empezando por `Button`, `Link` y `Tags` |

**Y una ventaja que conviene no perder:** las descripciones de Phosphor **traen palabras clave de búsqueda** —`"savings, nut, vegetable, food, groceries, market"`— que hacen encontrable el catálogo en Figma y en Supernova. *Vienen con `&amp;` sin decodificar y con marcas propias de Phosphor como `*new*`: conviene limpiarlas antes de publicar.*
