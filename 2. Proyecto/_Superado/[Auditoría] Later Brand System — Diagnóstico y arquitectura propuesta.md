> # ⚠️ DOCUMENTO SUPERADO — no usar como diagnóstico vigente
>
> **Este informe fue verificado contra Supernova el 13 de agosto de 2026 y tres de sus hallazgos rojos resultaron FALSOS.** Se conserva como registro histórico —incluida la lección metodológica, que es lo más caro que dejó— pero **no describe el estado del sistema**.
>
> **Lo que este documento afirma y no es cierto:**
>
> | Afirmación | Realidad verificada |
> | --- | --- |
> | No existe / no se publica la capa primitiva de color | **Existe, está publicada y llega completa.** Los semánticos viajan con su alias resuelto: `text/primary` = `#000000 (neutralsChromatic/900)`, `border/focus` = `#1C64EB (blue/500)`. La arquitectura **no** se aplana en el import |
> | Hay componentes colgando de un token invisible (`brandColors`) | **`brandColors` está indexado y llega.** `100 Ladrillos` (`#F20544`) y `- Web` (`#F82F56`) |
> | Dark mode se contempló y no se construyó | **Está construido.** Ambos modes aliasan a primitivos y se invierten bien; la convención `Static` funciona — es la única que no cambia entre temas |
> | Nueve familias de componentes con dos generaciones conviviendo | **Ocho estaban limpias.** Sobrevive solo `Alerta`. Las colisiones `Navbar` y `Avatar` no existen |
> | Button tiene tres generaciones | **Tiene una.** 205 variantes, estructura sana |
> | ~40 iconos Solid y ~40 Outline | **Son 309 Outline y 327 Solid.** El conteo estaba errado por un factor de 8 |
>
> **Los pasos 1 y 2 de su "orden de arreglo" —declarados aquí como *el trabajo crítico*— ya estaban resueltos.**
>
> **El error de método, que es lo que conviene recordar:** se trató la ausencia en `search_design_system` como ausencia en el archivo. Esa herramienta **solo devuelve variables de colecciones publicadas**. Sobre arquitectura de alias, la única prueba válida es el **valor resuelto** de un token, no lo que una búsqueda devuelva ni cómo se vea el árbol de grupos.
>
> **El problema real no era ninguno de los que este informe señala:** es que el plugin de Figma Variables **sincroniza altas y cambios pero no borrados**, así que lo eliminado en Figma sobrevive en Supernova hasta que alguien lo borre a mano.
>
> **Diagnóstico vigente:** `100Ladrillos/contexto/10-renovare-later.md` y las entradas del 13 ago 2026 en `100Ladrillos/DECISIONS.md`.

---

# Auditoría · Later: Brand System

**Diagnóstico del sistema y arquitectura de tokens propuesta**

100 Ladrillos · Product Design · 12 de agosto de 2026
Proyecto: Renovare — Fase 2 · Previo al hito 1 (pipeline Figma → Supernova)

---

## Resumen ejecutivo

Se auditó la librería `[Auditoria] - Later: Brand System` en Figma antes de conectar el pipeline hacia Supernova. **El sistema tiene una base de marca sólida y una arquitectura técnica que no la sostiene.**

Tres conclusiones:

1. **La capa primitiva de color existe pero no está publicada.** Si no viaja a Supernova junto con los semánticos, el pipeline **aplana la arquitectura**: los alias se resuelven a valor crudo y las tres capas se pierden en el import. Existe en Figma y muere en el camino.

2. **Conviven dos generaciones de componentes en nueve familias.** No es deuda puntual: es el estado general de la librería de UI. Para los controles de formulario y navegación, **reconstruir cuesta menos que corregir**.

3. **La tipografía está bien hecha.** Tiene arquitectura de dos capas real. Es la prueba de que el criterio existe en el equipo — solo no se aplicó al resto.

**Recomendación de secuencia:** tokens primero, componentes después. Corregir componentes sobre tokens rotos es hacer el trabajo dos veces.

---

## 1. Alcance y método

**Objeto auditado:** librería `[Auditoria] - Later: Brand System`, copia de trabajo tomada el 24 jun 2026 de `BS-01 Later: Brand System - Core v2.0 (WIP)`.

**Dimensiones cubiertas:** consistencia de componentes, estructura y nomenclatura, arquitectura de variables y estilos, y preparación para la sincronización con Supernova.

**Fuera de alcance:** accesibilidad (contraste, targets táctiles), cumplimiento de pantallas contra el sistema, y documentación de componentes. Se abordan después de la corrección estructural.

### Nota metodológica

Dos advertencias para quien reproduzca este trabajo:

- **El listado de páginas del archivo es incompleto.** Consultar la estructura por páginas devuelve resultados engañosos: omite páginas que sí contienen componentes. El inventario se levantó **por búsqueda en la librería**, filtrando por identificador de librería.
- **Las búsquedas truncan alrededor de 14–20 resultados.** Todos los conteos de este informe son **mínimos verificados**, no totales.
- **La búsqueda solo ve colecciones de variables publicadas.** Todos sus resultados de color provienen de `semanticColors`; ninguna otra colección aparece nunca. **La ausencia en la búsqueda no prueba la ausencia en el archivo** — una primera versión de este informe concluyó erróneamente que no existía capa primitiva de color por ese motivo. Para inventariar variables hay que abrir Figma.

---

## 2. Gobernanza: dos librerías vivas

| Librería | Estado |
| --- | --- |
| `[Auditoria] - Later: Brand System` | Copia de trabajo. **La que manda desde el 12 ago 2026** |
| `BS-01 … Core v2.0 (WIP)` | En producción. **Congelada desde el 12 ago 2026** |

**Hallazgo.** Todos los componentes de la copia tienen marca de tiempo dentro de una ventana de **siete minutos del 24 de junio**: es un snapshot, no una librería que se edite. Mientras tanto, `BS-01` siguió recibiendo cambios durante la pausa del proyecto:

| Componente | Editado en `BS-01` |
| --- | --- |
| `Toggle` | 27 jul 2026 |
| `Tabs/Primary` · `Tabs/Secondary` · `Plug-in o File Cover` | 9 jul 2026 |
| `Button Card` · `Tabs/Tertiary` | 3 jul 2026 |
| `Alerts` | 1 jul 2026 |

**Decisión tomada:** congelar `BS-01`. Esas siete ediciones las revisa el Lead y decide qué se rescata. Se aceptó la pérdida antes que sostener dos librerías vivas durante la reconstrucción.

**Verificado:** no falta ningún componente en la copia. Lo que quedó atrás son cambios, no cobertura.

---

## 3. Componentes: el diagnóstico

### 3.1 Dos generaciones conviviendo — es la regla

| Familia | Generación con variantes | Generación vieja conviviendo |
| --- | --- | --- |
| Checkbox | `Checkbox/Default` | `Inputs - Light/Checkbox - On` · `- Off` |
| Radio | `Radio Button/Radio button con Label` | `Inputs - Radio - On` · `- Off` |
| Toggle | `Toggle` · `Toggle/Toggle con Label` | `Toggle Help` |
| Button | `Button` · `Component / Button` | `Primary Button` · `Inactive Primary Button` |
| Tabs | `Tabs/Primary` `/Secondary` `/Tertiary` | seis `Tab Bar – N Tabs – …` |
| Alert | `Alerts` | `Alerta` · `Alert Modal` |
| Avatar | `Avatar` (set) | `Avatar` (componente) |
| Segmented | `Control Segment` | `Segmented Control` |
| Iconos | ~40 `XxxSolid` (set) | ~40 `XxxOutline` (sueltos) |

Button acumula **tres** generaciones. Hay **colisiones de nombre exacto**: `Avatar` existe como set y como componente; hay dos `Navbar` distintos con el mismo nombre.

**Lectura.** El patrón no es un descuido puntual. Cada vez que se modernizó un componente, la versión anterior se quedó publicada. Quien diseña hoy elige entre dos versiones del mismo control sin saber cuál es la buena — y ambas llegarían a Supernova.

### 3.2 El tema se resolvió duplicando componentes

**`Inputs - Dark` no existe.** El prefijo `Light` de `Inputs - Light/Checkbox` es una convención que se empezó y no se completó — y `Inputs - Radio - On/Off` ni siquiera lo lleva.

Donde el tema **sí** se duplicó literalmente es en `Bars / Navigation Bar / iPhone - Compact / Light|Dark /…` y en los splash icons.

**Implicación:** mientras claro y oscuro sean componentes distintos, el pipeline no puede tratarlos como themes. El tema tiene que vivir en las variables.

### 3.3 Nomenclatura

**Cuatro convenciones para el mismo separador**, todas publicadas:

```
Checkbox/Default        sin espacios
Card/ Deafult           espacio después
Icon / close            espacios a ambos lados
Icon/Face               ninguno
```

**Typos en nombres publicados:** `Card/ Deafult` · `Oferamos Simple` · `Extention Icon` · `100L/Monocramatico Negro` · `Table / Column / Acction`. Y `Payment ` con espacio final.

**Mezcla de idiomas dentro del mismo nombre:** `Checkbox/Checkbox con Label`, `Radio Button/Radio button con Label`.

**Acentuación irregular:** `Ubicación` y `Creación` los llevan; `Grafica` e `Imagenes` no.

**Profundidad de jerarquía incoherente:** conviven nombres de 0 niveles (`Toggle`) hasta 6 (`Bars / Navigation Bar / iPhone - Compact / Light / Modal Stack…`).

> Ninguno de estos defectos rompe Figma. **Todos viajan a los nombres de token en el código.**

### 3.4 Veredicto por familia

| Acción | Familias | Razón |
| --- | --- | --- |
| **Reconstruir** | Checkbox, radio, toggle, input, button, tabs, alerts, avatar, segmented control | El defecto es estructural, no de detalle. Sobre tokens sanos se rehacen rápido |
| **Consolidar** | ~40 iconos | El dibujo está bien. Falta fusionar Solid y Outline en un set con propiedad `Estilo` |
| **Conservar y renombrar** | Logos, ilustraciones | El activo es el dibujo; solo hay que limpiar nombres |

---

## 4. Variables y estilos: el diagnóstico

### 4.1 Estado de las cinco colecciones

| Colección | Contenido | Estado de la capa |
| --- | --- | --- |
| `primitiveType` | `family/*`, `size/*`, `lineHeight/*`, `letterSpacing/*`, `weight/*` | ✅ Primitiva, publicada |
| `semanticType` | `heading/{talla}/{peso}/{propiedad}`, `text/…` | ✅ Aliasa a la anterior |
| `primitiveColor` | Escalas de color | ⚠️ **Existe, no aparece publicada** |
| `semanticColors` | `background/*`, `text/*`, `icon/*`, `border/*`, `shadows/*` | Publicada |
| `spacing` | `Space/2XS … Space/9XL` | ❌ Capa única |
| `border` | `radius/*`, `width/*` | ❌ Capa única |

### 4.2 🔴 El bloqueo principal: la capa primitiva no viaja

`primitiveColor` **existe en el archivo**, pero no aparece entre las colecciones publicadas — igual que `brandColors` (§4.3).

Esto choca con un requisito duro de Supernova: **los alias que apuntan a variables fuera del alcance importado se resuelven a valor crudo.** Si `primitiveColor` no se publica y no se pushea junto a `semanticColors`, **Supernova recibe los tokens semánticos con el hex plano** y la arquitectura de tres capas se aplana en el import.

El sistema está mejor construido de lo que el pipeline va a poder aprovechar. Y el fallo es silencioso: en Figma todo se ve correcto.

**Se resuelve publicando la colección, no reconstruyéndola.**

**Aparte, y esto sí es deuda de diseño:** varios semánticos llevan el color en el nombre.

```
background/brandRed
background/brandDarkBlue
illustration/DarkBlueGradient/tint-2
```

Un token que se llama `brandRed` deja de ser semántico: describe lo que *es*, no para lo que *sirve*. Aunque detrás haya un alias correcto, el nombre miente el día que la marca cambie de color.

**Pendiente de verificar con el archivo delante:** si `primitiveColor` está publicada o es solo local, y si los ~55 semánticos aliasan de verdad a ella o alguno conserva el hex pegado.

**Dark mode se contempló y no se construyó.** Existe la familia `*/inverse` completa y un `text/primaryInverseStatic` — el sufijo *Static* solo tiene sentido si su hermano cambia con el tema. Pero `background/secondary` es `#ffffff` y `text/primary` es `#000000`: valores puros que no sobreviven a un modo oscuro.

### 4.3 🔴 Componentes colgando de un token invisible

`brandColors/100 Ladrillos` (#f20544) y `brandColors/100 Ladrillos - Web` (#f82f56) **son consumidos por componentes** —Chip, Button Menu— pero **no aparecen indexados en la librería publicada**. O la colección es local sin publicar, o quedó huérfana.

Cualquier consumidor externo de la librería recibe componentes que dependen de un token que no puede resolver.

### 4.4 Defectos de detalle verificados

| Hallazgo | Evidencia |
| --- | --- |
| **Cableado incorrecto de `lineHeight`** | `Text/L - Poppins/Regular` y `Text/M - Poppins/Regular` apuntan al `lineHeight` del **semiBold**. Las variantes Nunito Sans están bien. Es copy-paste al duplicar la familia. **El token correcto ya existe** — cuatro estilos a corregir |
| **Capitalización mezclada dentro de una colección** | `border` tiene `radius/Pill` y `radius/Circle` junto a `radius/zero` y `width/zero` |
| **Sombras duplicadas con nombres distintos** | Cada sombra existe como variable (`shadows/single/small/sm1`) **y** como estilo (`Shadows/Single/Small/sm-1`). Y entre variables: `sm1, sm2, sm3` sin guion, `sm-4` con guion |
| **`semiBold` no tiene primitivo** | `primitiveType` solo define `weight/{bold, regular, italic}`. El peso más usado en botones cuelga de un literal en la capa semántica |
| **`size/h5xl`** | Toda la escala usa guion (`h-2xl`, `h-3xl`, `h-4xl`); este no. Sus hermanos `lineHeight/h-5xl` y `letterSpacing/h-5xl` sí lo llevan |
| **Tres esquemas de text style** | `Heading/S/Bold` · `Text/L - Poppins/Bold` · `Amount/Text/L/Bold`. Los dos últimos son casi-duplicados |
| **Nombre de fuente dentro del token** | Los 8 estilos `Text/*` incluyen ` - Poppins` o ` - Nunito Sans`. Cambiar de tipografía obliga a renombrar todo |
| **Valores flotantes sin redondear** | `23.520000457763672`, `-0.4000000059604645`, `0.10000000149011612`. Llegan así a CSS, Swift y XML |
| **Token de componente en la capa semántica** | `graphs/basicConfig/borderColor` vive en `semanticColors` |
| **Variable huérfana** | `family`, sin grupo ni nivel, en medio de `semanticType` |
| **Grids inconsistentes** | `Web app/…/12 Cols - 1440` frente a `Web site/…/12 Cols - D1440` y `DL1920` |
| **Matriz de pesos irregular** | `Heading/S` tiene 4 pesos; M/L/XL tienen 2; 2XL–5XL solo 1 |
| **Sin tokens de opacidad** | La búsqueda no devuelve ninguno |

**Lo que sí está limpio:** el idioma. Todos los tokens y estilos están en inglés, sin mezcla — a diferencia de los componentes.

### 4.5 Pendiente de verificar

**Cuántos modes tiene cada colección.** La herramienta de lectura no expone esa información. Es el dato que falta para diseñar la estructura de modes y **requiere revisión manual en Figma**.

---

## 5. Requisitos de Supernova

Investigado contra documentación oficial. Condiciona qué se corrige y en qué orden.

**Son dos pipelines distintos, con requisitos opuestos:**

| | Conexión de archivo | Plugin de Variables |
| --- | --- | --- |
| Qué trae | Styles, Components, Assets | Variables: colecciones y modes |
| ¿Publicar librería? | **Obligatorio** | No necesario |
| Dirección | Automática al vincular | **Push manual, cada vez** |

**Orden obligatorio:** variables → vincular archivo → **re-importar tipografía al final** (hay un defecto documentado si se hace antes) → configurar pipeline a repositorio.

### Requisitos duros

- Archivo **publicado como librería**
- Componentes **publicados** — los locales no existen para Supernova
- **Todo estilo debe estar aplicado a al menos un elemento.** Un estilo huérfano **no se importa**
- Iconos: componentes **con configuración de exportación**, publicados
- **Sin alias de variables hacia otros archivos**, o se resuelven a valor crudo
- Republicar tras cada cambio

### Buenas prácticas

- **Asignar scopes** a variables numéricas y de texto. Sin scope, el export a código sale sucio
- **Una colección = un contexto.** 1–3 modes por colección
- **El primer mode de cada colección es el valor base**; los demás entran como themes
- Recomendación híbrida: color, número y texto como **Variables**; **tipografía, efectos, gradientes y bordes como Styles**

### Conflicto abierto

El área quiere tres ejes de modes: color (claro/oscuro), tipografía por dispositivo, y escalado por accesibilidad. Dos obstáculos:

1. **Supernova recomienda tipografía como Styles, y los Styles no tienen modes.** El eje tipográfico no encaja en la ruta recomendada.
2. **Los modes no sirven como marcas**, solo como themes. Para multi-marca existe otro mecanismo.

Y hay que **verificar el plan contratado**: la propia documentación de Supernova se contradice sobre qué plan habilita modes-como-themes.

---

## 6. Arquitectura de tokens propuesta

> Propuesta a validar. Resuelve los hallazgos de la sección 4 y respeta los requisitos de la sección 5.

### 6.1 Tres capas

```
PRIMITIVA          →   SEMÁNTICA           →   COMPONENTE
color/blue/500          background/brand         button/primary/background/default
color/neutral/900       text/primary             input/border/focus
```

**Regla que hoy se incumple y que es la más importante: la capa semántica aliasa, nunca copia un valor.** Ningún token semántico debe contener un hex.

La capa de componente **solo cuando se justifique** — un componente con estados y variantes que necesita nombre propio. Si un componente puede vivir con tokens semánticos, no se le crean propios.

### 6.2 Convención de nombres

```
categoría / concepto / variante / estado
```

Reglas, todas verificables:

| Regla | Por qué |
| --- | --- |
| **Todo en minúscula**, separación por `/` | Elimina las cuatro convenciones actuales |
| **Sin espacios, sin acentos, sin guiones dentro del segmento** | Los nombres alimentan la generación de nombres en código |
| **Sin nombre de tipografía ni de color en la capa semántica** | Un token que se llama `poppins` o `brandRed` deja de ser token |
| **Escalas numéricas para color primitivo** (`100`–`900`) | Permite insertar valores intermedios sin renombrar |
| **T-shirt para espaciado y radio** (`xs`–`xl`) | Ya es la convención del equipo; solo hay que bajarla a minúscula |
| **Profundidad máxima: 4 niveles** | Hoy hay de 2 a 6 |

### 6.3 Colecciones y modes propuestos

| Colección | Contenido | Modes |
| --- | --- | --- |
| `primitives/color` | Escalas completas de color | 1 (sin modes) |
| `primitives/type` | family, size, weight, lineHeight, letterSpacing | 1 |
| `primitives/dimension` | spacing, radius, borderWidth | 1 |
| `semantic/color` | background, text, icon, border, shadow | **2: light · dark** |
| `semantic/type` | heading y text por talla y peso | **1 por ahora** — ver nota |
| `component/*` | Solo lo que lo justifique | Heredan |

**Un contexto por colección**, como recomienda Supernova. El dark mode vive **solo** en `semantic/color`.

**Sobre el eje tipográfico por dispositivo.** Hay tres caminos y la decisión es del área:

| Opción | Ventaja | Costo |
| --- | --- | --- |
| **A — Tipografía como Variables con mode de dispositivo** | Un solo lugar de cambio; el responsive vive en el token | Contradice la recomendación de Supernova; obliga a push manual en cada cambio |
| **B — Responsive en código** | Sigue la ruta recomendada; los styles se auto-sincronizan | El breakpoint deja de ser una decisión de diseño |
| **C — Dos escalas semánticas** (`type/desktop/*`, `type/mobile/*`) | Compatible con Styles; explícito | Duplica la escala; hay que mantener las dos |

**Recomendación: opción B**, con la escala tipográfica definida en tokens y el cambio por breakpoint resuelto en el consumo. Razón: es la única que no pelea con la herramienta ni duplica mantenimiento, y el responsive tipográfico es una regla de layout más que una decisión de marca.

**Sobre el eje de accesibilidad.** No debería ser un mode. El escalado de texto para baja visión se resuelve con **unidades relativas en el consumo** y respetando la preferencia del sistema operativo — no con un tercer juego de tokens que habría que mantener sincronizado. Un mode congela un tamaño; una unidad relativa respeta lo que el usuario ya configuró en su dispositivo.

### 6.4 Orden de ejecución

| # | Paso | Desbloquea |
| --- | --- | --- |
| 1 | **Auditar `primitiveColor` y publicarla** | Que la arquitectura sobreviva al import |
| 2 | **Verificar que los ~55 semánticos aliasen** de verdad, y corregir los que no | Dark mode y retema |
| 3 | **Publicar o eliminar `brandColors`** | Cierra la dependencia invisible |
| 4 | **Renombrar los semánticos con color en el nombre** | Que el token no mienta al cambiar la marca |
| 5 | **Corregir el cableado de `lineHeight`** en las cuatro variantes Poppins | Corrección barata, valor inmediato |
| 6 | **Normalizar nombres** según 6.2 y redondear los flotantes | Limpieza del export a código |
| 7 | **Decidir sombras**: variable o estilo, no ambas | Elimina la doble fuente de verdad |
| 8 | **Asignar scopes** a variables numéricas y de texto | Export limpio a código |
| 9 | **Añadir el mode `dark`** a `semantic/color` | El eje de tema |

Los pasos 1 y 2 siguen siendo el trabajo crítico, pero cambiaron de naturaleza tras la corrección del diagnóstico: ya no es **construir** la capa primitiva sino **publicarla y verificar que la cadena de alias esté completa**. Es bastante más barato de lo estimado en la primera versión de este informe.

---

## 7. Riesgos

| Riesgo | Mitigación |
| --- | --- |
| **Reconstruir componentes desde cero se percibe como retroceso** | El activo caro —marca, paleta, tipografía, iconos— se conserva. Lo que se rehace es la estructura, que es lo barato de rehacer y lo caro de arrastrar |
| **La corrección de tokens rompe componentes existentes** | Los semánticos conservan su nombre: solo cambia lo que hay detrás. Los componentes que ya los consumen no se enteran |
| **`BS-01` se sigue editando por costumbre** | Comunicado al equipo. Conviene reforzarlo en la ceremonia de sprint |
| **El plan de Supernova no incluye modes-como-themes** | Verificar antes de construir la estructura de modes. Si no está, el dark mode se resuelve por otra vía |
| **La adopción no ocurre** | Es el riesgo declarado del proyecto y el que hundió la Fase 1. El hito 3 —capacitación a los tres equipos— existe precisamente para eso |

---

## 8. Qué falta para cerrar el diagnóstico

1. **Verificar los modes actuales** de cada colección — requiere revisión manual en Figma
2. **Confirmar el plan de Supernova** contratado
3. **Auditoría de accesibilidad** — contraste de la paleta y tamaños de área táctil
4. **Cobertura real**: qué porcentaje de las pantallas en producción consume tokens del sistema frente a valores sueltos

---

*Fuentes: inventario levantado sobre la librería en Figma el 12 ago 2026 · documentación oficial de Supernova · contexto del proyecto en `contexto/10-renovare-later.md` del repositorio de Product Design.*
