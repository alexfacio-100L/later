# Renovare · Later: Brand System

> **Qué es este archivo.** El contexto del proyecto activo más grande del área. Registra qué es Renovare, en qué punto está la Fase 2, quién lidera qué frente y qué está bloqueado. **Lo volátil —avance por sprint, estado de cada entregable— no vive aquí:** vive en Notion y en la fuente de verdad del sistema. Aquí queda lo durable: el porqué, el alcance, la infraestructura decidida y los bloqueos.
>
> **Vigente a: 13 ago 2026.** Capturado desde el brief y el kickoff de Fase 2, y **verificado contra Supernova el 13 ago** en lo que toca a tokens y modes — color, tipografía y el eje responsive, token por token con valor resuelto. El inventario de componentes **no** está verificado: quedó caduco tras la depuración del archivo.
>
> ⚠️ **Los hallazgos de tokens describen el último import exitoso de variables, no el Figma de hoy.** `FigmaVariablesPlugin` sigue fallando (R-12); último intento 13 ago 22:26 UTC.
>
> 👉 **¿Vienes a trabajar, no a entender?** El tablero con lo que sigue, en casillas, es **`tablero-de-ejecucion.md`**. Este archivo explica el porqué; ese dice qué hacer.

## Qué es Renovare

**Renovare** —del latín, *"volver a hacer de nuevo"*— es el proyecto que refunda la identidad de 100 Ladrillos desde sus bases. Nace de una constatación: el rediseño del website, las mejoras de enrolamiento y onboarding, y el desarrollo continuo de producto compartían un problema de raíz — **no existía un sistema de diseño unificado que sirviera de lenguaje común entre marketing, product design y tecnología.**

El Brand Book heredado se concibió en un contexto de negocio distinto y quedó desalineado. En paralelo, Product Design mantenía su propio lenguaje visual sin referente compartido. Esa fragmentación se manifestó en inconsistencia visual y de experiencia a través de los puntos de contacto, y un diagnóstico heurístico interno la localizó en la categoría de **confianza y credibilidad** del sitio — no como falla sistémica, sino focalizada en coherencia de identidad.

**Later** es el nombre del sistema que produce Renovare. Viene de *Lateranus*, raíz latina de ladrillo, fusionado con *Letrán* como memoria histórica. La lectura declarada: origen + estructura + resguardo + coherencia.

## Dónde está el proyecto

| Fase | Qué cubrió | Estado |
| --- | --- | --- |
| **Fase 1** — Construcción de marca | Brand Sprint, Voz y Tono, Brand System, Naming | ✅ Completa |
| **Fase 1 · bloque Implementación** | Habilitar el sistema en producción, Storybook, proceso de distribución | ❌ **No se hizo.** Bajas en el equipo y cambio de prioridades |
| **Fase 2** — Later: Brand System | Traducir y distribuir: el puente técnico de Figma a código | 🔄 **Activa, retomada ago 2026** |

**Lo que dejó la Fase 1:** naming y brandbook, manual de voz y tono v1.0 (cuatro valores de voz, matriz por superficie), paleta blue 100 Ladrillos con acentos, tipografías Poppins / Nunito Sans / Azeret Mono, tokens de color, espaciado, radios y sombras, sistema iconográfico sobre Heroicons v2 con marcas de dominio 100L, y primeros componentes base en Figma.

**El problema que ataca la Fase 2, en una frase:** *la marca está definida pero no operada — la consistencia depende del esfuerzo manual, no del sistema.* El reto **no es rediseñar: es traducir y distribuir.**

⚠️ **El proyecto arrancó en julio y se detuvo por carga de operación.** Se retoma en agosto de 2026. Esa pausa no está reflejada en el calendario del kickoff.

## La evidencia del diagnóstico

Levantamiento propio, 16 respuestas en 3 equipos. Cinco fricciones ubicadas en matriz frecuencia × impacto:

| Fricción | | Frecuencia promedio por equipo |
| --- | --- | --- |
| 1. Diseño ≠ código | **Prioridad crítica** | Tecnología (n=9): 3.0 |
| 2. Reglas y versiones | | Product Design (n=2): 2.0 |
| 3. Recursos visuales viejos | | Marketing (n=5): 1.8 |
| 4. Acceso a recursos | | |
| 5. Onboarding de uso | | |

**+3 h por semana** es lo que pierden los casos de mayor frecuencia —la desincronización diseño↔código— en buscar y rehacer manualmente. Tecnología es el equipo más expuesto y el más numeroso; las tres áreas reportan fricción.

La misma fricción se vive distinto por área: Marketing valida cada pieza a mano; Product Design ve *drift* entre lo diseñado y lo que ve el usuario; Tecnología no tiene proceso para consumir los activos de diseño y acumula deuda técnica.

> **Este es el primer dato de fricción medido del área.** Vale para `99-pendientes.md` (repo de Product Design) B1 (impacto de diseño medido) como línea base parcial — no es impacto de diseño en negocio, pero es evidencia levantada, no percepción.

## La infraestructura decidida

Pipeline conceptual en cuatro etapas encadenadas, sin reinterpretación humana entre ellas:

| Etapa | Qué pasa | Herramienta |
| --- | --- | --- |
| 1. Producción | Se crean y mantienen tokens, componentes y assets | Figma · Adobe · Storybook |
| 2. Documentación y traducción | Se documenta y se traduce a cada lenguaje de código | **Supernova** + GitHub |
| 3. Distribución | Se publica y versiona como fuente de verdad única | Supernova + GitHub |
| 4. Implementación | Llega a cada plataforma lista para construir | Web · iOS · Android · No-code · Prototipado |

**Claude atraviesa las cuatro etapas** como acelerador del flujo, vía IA + MCP.

**Supernova es la fuente de verdad** (decisión tomada, ver `DECISIONS.md` (repo de Product Design) 12 ago 2026). Ganó el benchmark **46/50 contra 37/50 de Zeroheight** por cuatro razones: pipeline Figma → código sin add-ons, conexión por MCP para IA, Storybook bidireccional y multi-marca nativo. La migración es por fases: **A** en paralelo solo con Tecnología y Product Design · **B** migración técnica del pipeline · **C** decisión de consolidar o coexistir. El setup inicial se estimó en 3–5 días de configuración por Tecnología.

## El pipeline hecho en casa — registro, no ruta activa

⚠️ **Leer esto antes de tocar `later-tokens`.** Es un activo **anterior a la decisión de Supernova**, y hoy es **plan B, no la ruta de trabajo.**

**De dónde viene.** El flujo original era: los tokens se producían en **Zeroheight**, salían como JSON, y ese JSON se procesaba en `later-tokens` con Style Dictionary para generar las salidas por plataforma y distribuirlas por GitHub. Cuando el benchmark comparó Zeroheight contra Supernova, resultó que **Supernova ya hace todo ese tramo de forma nativa** — y eso volvió la decisión fácil. El pipeline casero dejó de ser necesario.

**Por qué se conserva de todos modos.** Es una implementación funcional y propia de la traducción diseño → código. Si Supernova falla, sube de precio, o el área decide salirse, existe una ruta ya probada que produce los tokens y los distribuye sin depender de un proveedor. **Se conserva como seguro, no como pendiente que retomar.**

**Qué es exactamente.** Repo propio (`github.com/alexfacio-100L/later-tokens`), consumido como **submódulo git** por las tres apps. Style Dictionary 5.4 traduce de JSON a cuatro salidas: CSS custom properties, JS + definiciones TypeScript, Swift para iOS y XML para Android. Con modos **light y dark** separados y arquitectura de dos capas —`tokens/global/` primitivos y `tokens/brands/100ladrillos/` semánticos.

| Capa | Tokens |
| --- | --- |
| Globales (primitivos) | 152 — color 70 · unit 25 · spacing 22 · typography 22 · border 13 |
| Semánticos por modo | 157 light + 157 dark |
| Variables CSS generadas | 309 por modo |

**Tres apps de consumo**, todas con Tailwind: `later-web-astro`, `later-web-next` y `later-mobile-expo` (React Native). Cada una monta `later-tokens` como submódulo.

**Consecuencias para el estado del proyecto:**

- El entregable *"traducción de tokens vía Style Dictionary"* del brief se resuelve ahora **dentro de Supernova**, no en este repo. El casero queda como respaldo.
- **El framework frontend está resuelto de facto: Tailwind**, en las tres apps. El brief lo declara abierto (R-1) — el código dice otra cosa.
- Hay **posible duplicación estructural** en los tokens: `brands/100ladrillos/color.light.json` y `brands/100ladrillos/light/color.json` tienen ambos 157 tokens. Probable residuo de una iteración previa. Como el repo es plan B, **no es urgente arreglarlo** — pero sí anotarlo, porque un plan B que no compila no es plan B.

**También ahí:** un `HANDOFF — Sesión pendiente.md` (17 jun 2026) con el diseño completo del análisis del diagnóstico, y un `Research Synthesis` que cruza los hallazgos con literatura. El handoff marca dos datos con caveat: *"41% de design systems no mantenidos"* (fuente no verificada) y *"23% de revenue lift por consistencia de marca"* (atribución conflictiva Lucidpress vs. Forbes). **No usar esos dos números sin verificar.**

Del coding inductivo del diagnóstico salen los cinco clusters con su nombre corto: **Token Gap** (Tec n=7, Design n=2) · **Governance** (Tec n=5, Mkt n=3) · **Asset Drift** (Mkt n=5, Design n=1) · **Distribution** (Mkt n=4, Tec n=2) · **Onboarding** (Tec n=3, Mkt n=2). El 75% de las respuestas reporta fricción de frecuencia alta o muy alta. **Product Design está subrepresentado (12.5%, n=2)** — limitación declarada del estudio.

## Qué exige Supernova del archivo de Figma

> **Por qué esto va antes de la auditoría.** Si se audita y corrige Figma sin conocer estos requisitos, se corrige dos veces. Investigado el 12 ago 2026 contra documentación oficial; las incógnitas están marcadas como tales.

**Son dos pipelines distintos, con requisitos opuestos.** No es una sola conexión:

| | **Conexión de archivo** | **Plugin Figma Variables Sync** |
| --- | --- | --- |
| Qué trae | Styles, Components, Assets, Layers | Variables: colecciones y modes |
| ¿Publicar librería? | **Obligatorio** | No es necesario |
| Dirección | Supernova jala, auto-sync | **Push manual, cada vez** |

**Orden de operaciones:** variables por plugin → vincular archivo para styles, components y assets → **re-importar tipografía al final** (hay un bug documentado de referencias faltantes si se hace antes) → configurar pipeline a GitHub.

### Requisitos duros

- El archivo **publicado como librería**. Sin eso no se importa nada.
- Los componentes **publicados**. Los locales sin publicar no existen para Supernova.
- **Todo style debe estar aplicado a al menos un elemento.** Un estilo definido pero huérfano **no se importa** — basta aplicarlo a un rectángulo. Es la causa del error "styles not imported".
- Los iconos deben ser **componentes con export settings** activado, y publicados.
- **Sin alias de variables apuntando a otros archivos**, o se resuelven a valor crudo. Si los hay, importar primero el archivo referenciado.
- **Republicar después de cada cambio**, y hacer "Get updates" del lado de Supernova.
- Una sola fuente: Figma nativo **o** Token Studio. No ambos.

### Buenas prácticas documentadas

- **Asignar scopes** a las variables number/string (spacing, radius, opacity). Sin scope, Supernova no infiere el tipo de token y **el export a código sale sucio**.
- **Una colección = un contexto.** No mezclar light/dark con marca en la misma colección. **1–3 modes por colección.**
- **El primer mode de cada colección se vuelve el valor base del token**; los demás entran como *themes*. El orden importa.
- Naming con `/` para jerarquía. En component sets, el texto antes del primer `/` da nombre al set.
- **Recomendación híbrida, no "todo a variables":** color, number y string como **Variables**; **tipografía, efectos, gradientes y bordes como Styles**. Razón: los styles se auto-sincronizan al vincular; las variables exigen push manual.

### ~~Conflicto abierto con los modes deseados~~ — ✅ Resuelto 13 ago 2026

Los tres puntos que estaban abiertos, cerrados:

1. **"Supernova recomienda tipografía como Styles, y los Styles no tienen modes."** Resuelto por decisión del Lead: **la tipografía se queda como Variables con modes, aceptando el push manual**, y el responsive se resuelve además por media query en código. Verificado que los modes llegan bien a Supernova como themes. Ver la sección de arquitectura de tokens.
2. **Los modes no pueden usarse como marcas.** Sigue siendo cierto — solo como themes. Para multi-marca existen las Extended Collections (marzo 2026), que es otro mecanismo. No aplica hoy: hay una sola marca.
3. **El plan contratado ya está verificado** (confirmado por el Lead el 13 ago). Y la evidencia lo respalda: los cinco themes existen y funcionan.

### 🔴 El plugin de variables sincroniza altas y cambios, pero NO borrados

**Diagnosticado por el Lead el 13 ago 2026, y es el hallazgo operativo más importante de la auditoría.** El Lead eliminó el mode `App` en Figma, corrió el plugin, y **el mode siguió existiendo en Supernova**. Tuvo que borrarlo a mano.

**La regla, entonces:** lo que se borra en Figma **no desaparece de Supernova**. Queda huérfano hasta que alguien lo elimine manualmente.

**Por qué importa más de lo que parece:**

- Es **deuda permanente de la cadena**, no un fallo de una corrida. Cada depuración futura de tokens deja residuo.
- El residuo es **silencioso**: en Figma todo se ve limpio, y Supernova sigue exportando lo borrado a código.
- **Rompe el supuesto de "una sola fuente de verdad"**: Figma manda para lo que existe, pero no para lo que dejó de existir.

> ⚠️ **Corrección del 14 ago 2026.** Esta sección atribuía a los borrados el `hasError: true` persistente. **No está probado.**
>
> **Cerrado el 14 ago (tarea 0.7): no hay culpable identificable desde Supernova.** Barrido completo de 813 tokens. Las causas *out of range* y *unidades incompatibles* quedan descartadas por estructura —no existe ningún token de tipo especializado—; las booleanas ya estaban descartadas. Queda **referencias no resueltas**, que **no es falsable desde Supernova**: una referencia rota y un valor legítimamente crudo se ven igual. **`overlay/*` deja de ser sospechoso** — color + alpha no admite alias, así que nacieron crudos. El ticket se reformula hacia la pregunta de observabilidad. Ver `DECISIONS.md` (repo de Product Design) (14 ago) y tareas 0.7 y 0.5.
>
> 🔴 **Y el barrido destapó algo mayor:** los 135 tokens desconectados son **108 Typography + 26 Shadow + 1 Blur** — el 100% de esas capas. **Las sombras vivas solo transportan color; la geometría vive solo en los desconectados.** Tarea **1.12**, y bloquea la limpieza de "No collections".

#### ✅ Está documentado, y hay procedimiento (14 ago 2026)

**No es un bug: es comportamiento declarado.** La [FAQ del conector](https://learn.supernova.io/latest/design-systems/import-design-system-data/connect-figma-variables/faq-T4yERPk4) lo dice literal: *"When a token is removed from the Figma data source, we simply disconnect it from its Figma counterpart."* La razón que dan es deliberada — el token podría estar en uso en documentación o en hooks de exportación, así que no lo eliminan por ti.

**Eso explica el grupo "No collections": es donde aterriza lo desconectado.** No es una zona del sistema; es el residuo acumulado de lo borrado en Figma. **Excluirlo del universo vivo en cualquier auditoría.**

**Verificado con un canario el 13 ago:** una colección de prueba creada en Figma **entró** con el push; al borrarla y volver a empujar, **no se eliminó** — perdió su colección y cayó a "No collections". Prueba las dos cosas a la vez: el import procesa contenido, y las eliminaciones no se propagan.

### Definition of done del pipeline — el procedimiento de borrado

**Toda eliminación de tokens son tres pasos, no uno.** Va en checklist, no en la memoria del Lead: el equipo declara en su FODA que no documenta por hábito, y una regla que depende de acordarse no se ejecuta.

1. **Borrar la variable en Figma.**
2. **Correr el push.** Supernova la desconecta de su origen y la convierte en **token nativo de Supernova** — es el momento en que cae a "No collections".
3. **Borrar ese token desde Supernova.**

**Sin el paso 3, el token sigue exportándose a código.** El residuo es silencioso: en Figma todo se ve limpio.

**Limitación adicional:** el plugin en beta **no permite eliminar colecciones ya empujadas**, solo sus tokens. Una colección vacía puede quedar visible.

### ⚠️ Nada se sincroniza solo — verificado 13 ago 2026

`autoImportMode` está en **`Never`** en la conexión de archivo, y el plugin de variables es **push manual** por diseño de Supernova. Consecuencia operativa: **toda auditoría corre sobre el último import, no sobre Figma.** Es R-7 materializándose.

### ⚠️ El MCP de Supernova es de solo lectura

Expone `sn_get_*` y `sn_search`, sin herramientas de escritura. **La documentación no se puede migrar ni crear desde un agente**: los agentes leen y diagnostican, pero poblar Supernova es trabajo manual del Lead. Considerarlo al planear el Hito 2 (fuente de verdad documentada), que es enteramente trabajo manual.

#### ⚠️ Y además ignora los filtros — cambia cómo se audita (14 ago 2026)

**`sn_get_token_list` y `sn_get_token_group_list` ignoran los parámetros de búsqueda y de filtro por tipo.** Se les pasa `search` o `tokenType` y devuelven el catálogo completo paginado desde el principio. `sn_get_figma_component_list` hace lo mismo. Y **`sn_search` solo indexa páginas de documentación, no tokens ni componentes.**

**Cómo se audita entonces, sin engañarse:**

| Para saber… | Usar | No usar |
| --- | --- | --- |
| Si un token **existe** | Recorrer el árbol con `sn_get_token_group_list`, **o paginar la lista con `cursor`** | `search` — se ignora |
| El **valor y el alias** de un token | `sn_get_token_detail` con `tokenIds` (array) | El árbol de grupos: agrupa por tipo, no por colección de origen |
| La **colección de origen** | `sn_get_token_property_list` → propiedad `Collection`, que mapea IDs a nombres | Inferirla del path |

> **Trampa verificada el 13 ago:** buscar un token **suelto** —sin barra en el nombre— entre los grupos **no lo encuentra**, porque un token sin ruta no genera grupo: vive en la raíz. Se concluyó que el canario no había llegado cuando sí estaba. **Ver regla 14 de `CLAUDE.md`.**

#### 🔴 Excluir "No collections" de toda auditoría — y cómo hacerlo

**Riesgo señalado por el Lead el 14 ago:** un token borrado en Figma sobrevive en "No collections" **conservando su nombre**. Si coincide con uno vivo, **una auditoría puede leer el muerto en vez del vivo, o contar ambos** — y todos los hallazgos quedan contaminados sin que nada lo delate.

**El filtro fiable — por propiedad, no por nombre:**

> **Un token está vivo si tiene valor en la propiedad `Collection`.** Los desconectados no lo tienen.

Se obtiene con `sn_get_token_property_list`: devuelve la propiedad `Collection` con sus **ocho opciones vivas** —`primitiveColor`, `semanticColors`, `primitiveType`, `semanticType`, `spacing`, `unit`, `border`, `layout`— y el `value` de cada `tokenId`. **Un token cuyo id no aparece con valor de colección está desconectado: ignorarlo.**

**No filtrar por nombre ni por path:** son idénticos entre el vivo y el muerto. Es justo lo que hace la trampa invisible.

**Nota operativa:** limpiar "No collections" es lento —hay que borrar uno por uno, sin selección múltiple— así que **el residuo va a convivir con el sistema una temporada**. La exclusión por propiedad no es un parche temporal: es cómo se audita mientras exista residuo.

### Lo que Supernova NO documenta

Marcado explícitamente para que nadie lo dé por cierto: **no hay regla oficial** sobre acentos, mayúsculas, espacios ni caracteres especiales en nombres; **no exige component sets** (ni lo prohíbe); y **no lista capas sueltas, frames sin autolayout, grupos ni elementos ocultos como problema de sync** — el único filtro real es publicado/no publicado y aplicado/huérfano. Evitar acentos sigue siendo prudente porque esos nombres alimentan la generación de nombres en código, pero es criterio propio, no requisito.

Existe una **checklist oficial de import** —Styles, Components, Vector Assets, Layers— pero es más pobre que las recomendaciones del propio playbook: no cubre variables, modes ni naming.

Fuente: documentación oficial de Supernova (learn.supernova.io y playbook de Figma Variables), consultada 12 ago 2026.

## Los cuatro frentes

| Frente | Objetivo | Lidera |
| --- | --- | --- |
| **Implementación & flujo** | Levantar implementación, lineamientos y flujo del sistema en público y plataforma | Head of Engineering · Product Design Lead |
| **Foundations & pipeline** | Framework técnico, sincronización con Supernova, pipeline de GitHub con IA + MCP | Head of Engineering |
| **Marca & contenido** | Brand Book, voz y tono, alineación visual de las piezas | Design Head (Marketing) |
| **Componentes & QA** | Biblioteca de componentes, control de calidad, consistencia diseño ↔ código | Product Design Lead + el equipo de Product Design |

Los nombres de las personas asignadas viven en el brief y el kickoff; el contexto organizacional vigente está en `01-equipo.md`. Product Design participa en los cuatro frentes pero **solo es dueño de dos**: Componentes & QA, y la mitad de Implementación & flujo. Foundations & pipeline es de Tecnología.

## Cómo se trabaja

**Scrumban**, sprints de dos semanas. Sin daily. Avances async en Notion. **Máximo tres cosas en curso por área** — se cierra antes de abrir. Planning el lunes de semana 1, review de 30 min el viernes con el equipo core, retro cada dos sprints.

**Ventana del proyecto: 6 jul → 2 oct 2026.** Tres meses dentro del Q3. Ese plazo se estimó asumiendo **trabajo manual, sin asistencia de IA** — es el plazo a batir, no el plazo esperado. El arranque real se corrió a agosto porque la operación consumió el tiempo de julio.

### Los tres hitos

El proyecto se cierra en tres bloques de entregable, en este orden:

| # | Hito | Qué significa terminado |
| --- | --- | --- |
| **1** | **Pipeline funcionando** | Figma → Supernova → distribución, corriendo de extremo a extremo. Es el objetivo principal |
| **2** | **Fuente de verdad documentada** | Supernova con documentación profunda, no solo poblada: foundations, componentes, guías de uso |
| **3** | **Capacitación a los operadores** | Los tres equipos que operan el sistema saben usarlo: **diseño de Marketing, Product Design y Engineering**. Sin esto, el sistema existe pero no se adopta — que es exactamente cómo terminó la Fase 1 |

Calendario original del kickoff, hoy corrido: junio Fase 0 (setup) · julio S1–S3 foundations y pipeline · agosto S4–S6 componentes e IA · septiembre S7–S9 QA y cierre.

## Cómo se mide el éxito

Cuatro métricas al cierre de la fase, definidas en el brief:

| Meta | Métrica |
| --- | --- |
| **≥ 80%** | Tokens primitivos y semánticos de Figma correctamente traducidos a código |
| **0** | Discrepancias críticas entre Figma y código en los componentes revisados en QA |
| **1** | Fuente de verdad centralizada, operativa y usada por los tres equipos |
| **100%** | Pipeline Figma → Supernova → GitHub funcionando con un solo comando |

El brief agrega dimensiones sin meta numérica: cobertura de pantallas de la web app que consumen tokens del sistema vs. valores ad hoc, reducción del tiempo de handoff sprint sobre sprint, tiempo de componer una pantalla reutilizando vs. construyendo desde cero, número de correcciones pedidas por desarrollo por ambigüedad en la documentación, y satisfacción del equipo en retrospectivas (escala 1–5).

> **Estas son las primeras métricas del área con meta declarada y fecha de corte.** Ninguna tiene serie histórica todavía.

## Bloqueos y contradicciones

| # | Qué | Estado |
| --- | --- | --- |
| **R-1** | ~~**Framework frontend sin definir** — Tailwind vs. Vanilla CSS~~ | ✅ **Resuelto de facto.** Las tres apps de `Later2.0` usan Tailwind y Style Dictionary ya genera para ellas. El brief quedó desactualizado; falta hacerlo explícito ante Tecnología |
| **R-2** | **Frontend developers TBD** — el brief lista dos posiciones sin asignar para tokens→código y componentes→QA. El kickoff nombra un Frontend en la lista de informados | 🟡 Contradicción entre los dos documentos |
| **R-3** | **UX Writing y UX Copywriting TBD** — "por confirmar entre leads" | 🔴 Abierto |
| **R-4** | ~~Tres calendarios distintos~~ | ✅ **Resuelto 12 ago 2026 por el Lead.** Vale la tabla del brief: **6 jul → 2 oct 2026**, tres meses dentro del Q3. Ese plazo asumía trabajo manual, sin asistencia de IA |
| **R-5** | ~~"Fase" significa dos cosas~~ | ✅ **Cerrado 12 ago 2026.** El Lead confirma que la nomenclatura es clara para el equipo. No requiere acción |
| **R-6** | **Riesgo de adopción** — declarado en el brief: si tecnología y producto no integran el flujo en sus procesos, se repite el patrón de la Fase 1, que produjo activos sin ruta de adopción | 🔴 Es el riesgo principal del proyecto |
| **R-7** | **Cadena de sincronización frágil** — Figma → Supernova → Style Dictionary → GitHub. Si se rompe en cualquier punto, la consistencia del sistema se invalida | 🟡 Riesgo estructural declarado |
| **R-8** | **La carpeta de Drive está en `2. Hecho`** cuando el proyecto está activo | 🟡 Higiene de inventario |
| **R-9** | ~~Tres lugares sin conexión~~ | 🟢 **Reencuadrado 12 ago 2026: es división deliberada, no desorden.** Ver "Dónde vive el proyecto". El costo real es que los documentos envejecen respecto del código — el brief declara abierto lo que el código ya cerró. Se paga actualizando este archivo, no unificando carpetas |
| **R-10** | **Auditoría de Figma** — diagnóstico del estado real de la biblioteca | 🟢 **Diagnóstico completo al 13 ago 2026: color, tipografía, modes y componentes.** Variables verificadas contra Supernova —**tres hallazgos rojos del 12 ago resultaron falsos**, la arquitectura de color está sana—, componentes re-levantados tras la depuración (ocho de nueve familias limpias) y **tipografía auditada token por token: veredicto corregir in situ**. Lo que resta **no es diagnóstico sino ejecución manual** del Lead en Figma |
| **R-12** | **El plugin de variables no propaga borrados** — sincroniza altas y cambios, pero lo eliminado en Figma sobrevive en Supernova. Diagnosticado por el Lead el 13 ago tras borrar el mode `App` y verlo persistir | 🔴 **Abierto, y ahora bloqueante.** `FigmaVariablesPlugin` sigue en `hasError: true` / `lastImportResult: null`, último intento **13 ago 19:53 UTC**. Causa identificada, sin solución automática: el Lead resolvió el mode `App` a mano. **Requiere un paso manual de verificación en la definición de done del pipeline.** Sube a rojo porque **sin destrabar el import no hay forma de verificar que las correcciones de foundations quedaron** — ver la sección de sincronización |
| **R-13** | **La voz y tono no está en Figma** — el archivo solo tiene identidad visual. Vive en Drive, en **dos documentos** que resultaron ser ramas paralelas del mismo `Ver. 1.0` | 🟡 **Comparados el 13 ago 2026: la fuente canónica es compuesta.** Cada documento creció en una mitad distinta. Cuatro decisiones quedan abiertas y **pertenecen a Brand, no a Product Design**. Ver la sección de voz y tono |
| **R-11** | **`BS-01` congelada desde el 12 ago 2026** — siete ediciones posteriores al snapshot quedaron solo en producción. El Lead las revisa por su cuenta | 🟡 Decidido, con pérdida asumida. Lista abajo |

## Las dos librerías, y cuál manda

| Librería | Rol |
| --- | --- |
| **`[Auditoria] - Later: Brand System`** | **La que manda desde el 12 ago 2026.** Es donde se corrige y será la fuente de verdad tras el swap. Ya conectada a Supernova |
| **`BS-01 Later: Brand System - Core v2.0 (WIP)`** | La que está en producción y alimenta los proyectos. **Congelada desde el 12 ago 2026.** Se deprecia tras el swap |

**Ojo con el snapshot.** La librería de auditoría se copió el **24 jun 2026** —todos sus componentes tienen timestamp dentro de una ventana de siete minutos de ese día— y `BS-01` **siguió recibiendo cambios después**, mientras el proyecto estaba pausado. Al congelar, estas siete ediciones quedan solo en producción:

| Componente | Editado en `BS-01` |
| --- | --- |
| `Toggle` | 27 jul 2026 |
| `Tabs/Primary` · `Tabs/Secondary` · `Plug-in o File Cover` | 9 jul 2026 |
| `Button Card` · `Tabs/Tertiary` | 3 jul 2026 |
| `Alerts` | 1 jul 2026 |

**El Lead las revisa por su cuenta** y decide qué se rescata. Se aceptó la pérdida antes que arrastrar dos librerías vivas en paralelo.

Verificado: **no falta ningún componente** en la copia. Lo que quedó atrás son cambios, no cobertura.

## Auditoría — hallazgos de componentes (13 ago 2026)

> Re-levantado contra el import verde del 13 ago 19:46 — **2,788 componentes** (root + variantes) tras la depuración del Lead. El inventario del 12 ago quedó abajo como registro histórico; **ocho de sus nueve familias ya no aplican**.

**Estructura real del archivo:** 5 páginas — `Cover`, `📕 Brand Book 100 Ladrillos`, `Foundation ↴`, `Components ↴`, `Organisms ↴`.

### El universo real son 183 componentes, no 2,788

| | Root |
| --- | --- |
| Iconos `XxxOutline` (sueltos) | 309 |
| Iconos `XxxSolid` (sets de 3 variantes) | 327 |
| **Subtotal iconos** | **636 — el 78%** |
| Todo lo demás | **183** |
| **Total root** | **819** |

**El informe del 12 ago decía "~40 y ~40": el conteo estaba errado por un factor de 8.** Son 308 iconos pareados Solid/Outline más 19 logos que solo existen en Solid. La recomendación de fusionarlos en un set con propiedad `Estilo` sigue siendo correcta, pero son **308 fusiones, no 40**.

### ✅ Ocho de las nueve familias están limpias

Ya no existen: `Inputs - Light/Checkbox - On|Off` · `Inputs - Radio - On|Off` · `Toggle Help` · `Primary Button` · `Inactive Primary Button` · `Component / Button` · los seis `Tab Bar – N Tabs` · `Alert Modal` · el segundo `Avatar` · `Segmented Control` · **ambos `Navbar`** · `Extention Icon`.

**Las colisiones de nombre exacto ya no existen.** Varias familias quedaron con matriz completa y coherente: `Toggle` (20 var = On × Size × Status), `Avatar` (12 = 6 sizes × 2 types), `Control Segment` (14), `Checkbox/Default` (15 = Type × State).

**Sobrevive una sola pieza de generación vieja:** `Alerta` (0 variantes) conviviendo con `Alerts` (30 variantes, 13 propiedades).

### 🔴 El Button — diagnóstico del piloto

**Una sola generación** (el informe del 12 ago le atribuía tres). 205 variantes, 16 propiedades, cuatro ejes coherentes: `Size` (XXL–S), `Type` (Primary–Quaternary), `State` (6), `Propouse` (Regular, CTA).

**Está listo para ser el piloto, pero con una corrección de nombres antes** — y no es cosmética: los nombres son justamente lo que el piloto está probando que viaje bien a código.

| Corregir | Por qué |
| --- | --- |
| **`Propouse` → `purpose`** | Es un **nombre de propiedad publicada**, no una capa. Engineering lo lee en código. Correr el piloto así valida la propagación de un typo hasta producción |
| Los 8 slots `InstanceSwap` de icono | Usan una escala (`Micro`, `Mini`, `Small`) **que no existe en el componente** — el eje `Size` va de S a XXL. Dos vocabularios de tamaño incompatibles adentro del mismo componente. Además mezclan `Icono Izq.` con `Icon. Izq.` |
| `M. B. Derecho` · `M. B. Izquierdo` | Abreviaturas sin glosario |
| `On-focus` | Único valor con guion y minúscula entre seis PascalCase |

**Los 35 huecos de la matriz son regla de diseño, no deuda.** De 240 combinaciones posibles hay 205, y las ausencias caen en exactamente dos reglas: `Quaternary` nunca existe en `Propouse=CTA` (30), y `Quaternary + Regular` nunca tiene `State=Loading` (5). Probablemente correcto — **pero no está documentado**, así que el generador de código las leerá como huecos y alguien las va a "arreglar".

### Defectos vivos de naming en componentes

**Typos publicados que persisten:** `Deafult` · `Acction` (y está **duplicado**, más un `2 Acctions`) · `Monocramatico Negro` —junto a `Monocromatico Blanco`, bien escrito— · `Oferamos Simple`. **Nuevos:** `Adjustaments` (×4 iconos) · `Spiner` y `Spiner With BG`.

**Nombres por defecto de Figma con variantes reales:** `Component 1` (5 var), `Component 6` (4 var), `Component 12` (4 var). Y propiedades sin renombrar: `Payment` › `Property 1`, `Property 2`.

**Cuatro convenciones de casing conviviendo:** `progress bar` · `progressBarLeft` · `inputText` · `Slider-point`. Mezcla de idiomas (`Checkbox con Label`, `Status de Producto`) y acentos irregulares (`Ubicación` sí, `Grafica` no). Nombres puramente numéricos: `40`, `50`, `60`, `70`, `80`, `90`.

**En iconos:** el mismo icono con dos nombres (`Square 3 Stack 3dSolid` vs `Square Three Stack 3DOutline`), espacio antes de `Solid` (`Bars Four Solid`), doble espacio (`Arrow Left  End On RectangleSolid`) y capitalización irregular (`QR CodeOutline` / `Qr CodeSolid`, `TVOutline` / `TvSolid`).

**Escalas rotas:** `Avatar` › `Size` va `small, large, xlarge, xxlarge, xxxlarge, big` — sin `medium`, y `big` no pertenece a la escala. `Toggle` › `Size` mete la unidad en el valor: `16px`, `24px`.

### 🟡 Patrón nuevo — tres sistemas de logo de marca conviviendo

`logo-facebookSolid` (Heroicons) · `Facebook` (6 var, 2 props) · y el set `Brands` (64 var). Se repite en Instagram, LinkedIn, Google, RSS, YouTube y WhatsApp. Más un set `Logos` (16 var). **Esto sí es generaciones duplicadas, y no estaba en la lista de nueve familias del 12 ago.**

### ⚙️ Configuración — los iconos entran como componentes, no como assets

El scope de la conexión tiene **`assets: false`** y `stats.assets: 0`. Ningún gráfico entra como *vector asset*: los 636 iconos entran como componentes. Eso infla el conteo y **afecta cómo salen a código**. Es decisión de configuración, no deuda del archivo — revisar si es lo que se quiere.

### Lo que NO se pudo verificar desde Supernova

- **Convenciones de separador.** `sn_get_figma_component_list` devuelve **solo el último segmento del path**: `Table / Column / Acction` llega como `Acction`. No se puede distinguir `Card/ Deafult` de `Card/Deafult` — hay que abrir Figma. Los espacios *internos* sí se preservan.
- **`Payment` con espacio final.** Supernova trimea; llega como `Payment`.
- **Colisiones de nombre exacto tras el aplanado.** Hay muchas (`Bombilla` ×2, `Empty` ×3, `Label` ×2…), pero no se puede saber si colisionan en Figma o solo al aplanar. **Importa igual: ese nombre aplanado es el que viaja a código.**

---

## Auditoría — hallazgos de componentes (12 ago 2026) — ⚠️ CADUCO, registro histórico

> 🔴 **No usar como estado actual.** Superado por el re-levantamiento del 13 ago, arriba. Se conserva para entender qué se buscó y en qué se falló: el Lead confirmó que parte de lo reportado como "dos generaciones conviviendo" venía de **recursos de notaciones y plantillas** mal interpretados, y el conteo de iconos estaba errado por un factor de 8.

> Inventario levantado por búsqueda en la librería, no recorriendo páginas: **el listado de páginas de este archivo es incompleto y engañoso**. Quien retome esto, use `search_design_system` filtrando por `libraryKey`, no `get_metadata`.

**El veredicto:** el patrón de dos generaciones conviviendo **es la regla, no la excepción**. Se repite en nueve familias.

| Familia | Generación con variantes | Generación vieja conviviendo |
| --- | --- | --- |
| Checkbox | `Checkbox/Default` | `Inputs - Light/Checkbox - On` · `- Off` |
| Radio | `Radio Button/Radio button con Label` | `Inputs - Radio - On` · `- Off` |
| Toggle | `Toggle` · `Toggle/Toggle con Label` | `Toggle Help` |
| Button | `Button` · `Component / Button` | `Primary Button` · `Inactive Primary Button` |
| Tabs | `Tabs/Primary` `/Secondary` `/Tertiary` | seis `Tab Bar – N Tabs – …` |
| Alert | `Alerts` | `Alerta` · `Alert Modal` |
| Avatar | `Avatar` (set) | `Avatar` (componente) — **mismo nombre exacto** |
| Segmented | `Control Segment` | `Segmented Control` |
| Iconos | ~40 `XxxSolid` (set) | ~40 `XxxOutline` (sueltos) |

Button tiene **tres** generaciones. Hay colisiones de nombre exacto: dos `Navbar` distintos y dos `Avatar`.

**Recomendación por familia, no en bloque:**

- **Reconstruir** — los cinco controles de formulario, tabs, alerts, avatar, segmented control. El defecto es estructural, no de detalle; sobre tokens sanos se rehacen rápido.
- **Consolidar sin reconstruir** — los ~40 iconos. El dibujo está bien; falta fusionar Solid y Outline en un set con propiedad `Estilo`.
- **Conservar con limpieza de nombres** — logos e ilustraciones. El activo es el dibujo.

### `Inputs - Light` es una convención abandonada

**`Inputs - Dark` no existe.** El prefijo no es duplicación por tema: es una convención que se empezó y no se completó — y `Inputs - Radio - On/Off` ni siquiera lo lleva. Donde el tema **sí** se duplicó literalmente es en `Bars / Navigation Bar / iPhone - Compact / Light|Dark /…` y en los splash icons. Confirma que el tema se resolvió duplicando componentes en vez de con modes de variables.

### Naming — cuatro convenciones conviviendo

Para el mismo separador, todas publicadas hoy: `Checkbox/Default` (sin espacios) · `Card/ Deafult` (espacio después) · `Icon / close` (ambos lados) · `Icon/Face` (ninguno).

**Typos en nombres publicados:** `Card/ Deafult`, `Oferamos Simple`, `Extention Icon`, `100L/Monocramatico Negro`, `Table / Column / Acction`. Y `Payment` lleva un espacio final en su nombre.

Mezcla de idiomas dentro del mismo nombre (`Checkbox/Checkbox con Label`) y acentos irregulares: `Ubicación` y `Creación` los llevan; `Grafica` e `Imagenes` no.

**Nada de esto rompe Figma. Todo esto viaja a los nombres de token en código.**

## Arquitectura de primitivos: qué entra en `unit` y qué no (14 ago 2026)

**El planteamiento del Lead.** `unit` se creó como escala primitiva de números para evitar que alguien invente un `13px` a mano, reutilizable en espaciados, radios, bordes y anchos. Pero **radius y width necesitan a veces impares o decimales fuera de esa escala**, y en tipografía el `lineHeight` sale de un cálculo (`fontSize × factor`) que produce decimales. De ahí la mezcla observada en `radius/*`: `XL, L, M, S, XS, zero` aliasan a `unit/*`, mientras `Circle` (50px) y `Pill` (999px) llevan valor crudo.

**La mezcla no es el defecto. La falta de regla declarada sí** — quien la lee no distingue intención de descuido, y de hecho la auditoría de 0.7 llegó a listar `radius/Circle` y `radius/Pill` como sospechosos de referencia rota justamente por eso.

### La regla

> **Un valor pertenece a `unit` si es un punto de una escala compartida entre dominios.** Si es un valor **propio de un dominio** —un radio de píldora, un borde de 1.5px, un interlineado calculado— vive en su capa con valor literal, **y eso es correcto, no deuda.**

**`unit` no debe contener todos los números del sistema.** Contiene el ritmo de espaciado, que es donde la consistencia importa. Casos que **no** pertenecen:

| Token | Por qué no | Qué es en realidad |
| --- | --- | --- |
| `radius/Pill` = `999px` | **999 no significa 999: significa "infinito".** | Centinela — garantiza redondeo completo sin importar la altura |
| `radius/Circle` = `50px` | No es un escalón de escala | Centinela — "la mitad" |
| `width/S` = `1.5px` | Los bordes viven en `1, 1.5, 2, 4` | Escala propia del dominio, con otro ritmo |
| `lineHeight/*` con decimales | Es **resultado de un cálculo**, no un valor elegido | Derivado, ver abajo |

**Con esta regla, `radius` deja de ser una mezcla rara:** son dos cosas legítimas conviviendo. Lo único que faltaba era declararlo.

### Los decimales del `lineHeight` son otro problema, y sí es defecto

`74.9` es `64 × 1.17` tal cual salió de la calculadora; `67.65` es `56 × 1.208`. **Nadie decidió esos números: son residuo aritmético.**

Dos costos reales: los navegadores redondean subpíxeles de forma distinta, así que **el render varía entre plataformas**; y son **imposibles de mantener** —si cambia el factor, hay que recalcular los doce a mano—.

**Acción segura:** redondear. `74.9 → 75`, `67.65 → 68`. No se pierde nada en diseño.

**Alternativa a evaluar, no ratificada:** interlineado **sin unidad** (`1.2`, `1.5`) en vez de píxeles. Es el estándar en código porque escala solo con el tamaño de fuente y eliminaría la mitad de los tokens de `lineHeight`. **Falta verificar cómo lo maneja Figma Variables y cómo viaja por el conector** — no darlo por bueno sin comprobarlo.

> **Sobre el render entre plataformas:** es una consideración de la **capa de consumo en código**, no del diseño. Por la Decisión 8 del 13 ago, la auditoría entrega el requisito a desarrollo, no la implementación. **No es acción del Lead hoy.**

---

## Auditoría — hallazgos de variables

> ⚠️ **Los hallazgos del 12 ago 2026 fueron verificados contra Supernova el 13 ago y tres de ellos resultaron falsos.** Esta sección ya está corregida. Ver `DECISIONS.md` (repo de Product Design) — *"La auditoría de variables se verifica contra Supernova"*.

**Cinco colecciones verificadas el 12 ago:** `primitiveType`, `semanticType`, `semanticColors`, `spacing`, `border`. Más `primitiveColor` y `brandColors`, confirmadas después.

### ✅ La arquitectura de color está sana — verificado en el pipeline (13 ago 2026)

**Los tres hallazgos rojos del 12 ago eran falsos.** La verificación se hizo con valores resueltos en Supernova (`sn_get_token_detail`, `sn_get_token_list`), que es la única prueba válida: lo que importa no es qué existe en Figma sino qué sobrevive al import.

**1. La capa primitiva de color existe, está publicada y llega completa.** Los semánticos viajan con su alias resuelto y nombrado:

| Token semántico | Valor que llega a Supernova |
| --- | --- |
| `text/primary` | `#000000 (neutralsChromatic/900)` |
| `background/brandRed` | `#F20544 (100 Ladrillos)` |
| `border/focus` | `#1C64EB (blue/500)` |
| `background/selected` | `#315FA3 (neutralDarkBlue/500)` |

**La cadena de alias está intacta y la arquitectura no se aplana en el import.**

**2. No hay componentes colgando de un token invisible.** `brandColors/100 Ladrillos` (`#F20544`) y `brandColors/100 Ladrillos - Web` (`#F82F56`) están indexados y llegan.

**3. Dark mode sí está construido.** Los dos modes aliasan a primitivos y se invierten correctamente. Y la convención `Static` funciona: son los únicos que no cambian entre temas.

| Token | Light | Dark |
| --- | --- | --- |
| `text/primary` | `#000000` (Chromatic/900) | `#FFFFFF` (Chromatic/100) |
| `background/primary` | `#F4F7FB` (Lighter Blue) | `#000000` (Chromatic/900) |
| `background/secondary` | `#FFFFFF` (Chromatic/100) | `#202020` (Chromatic/800) |
| `border/primary` | `#DADADA` (Gray/300) | `#404040` (Chromatic/700) |
| `text/primaryInverseStatic` | `#F9F9F9` | `#F9F9F9` — no cambia |

**Sí siguen sin capa primitiva:** spacing (`Space/M` = `12` directo) y radius/width.

> **Nota metodológica — dos formas de equivocarse, ambas cometidas aquí.** (1) `search_design_system` **solo devuelve variables de colecciones publicadas**, así que su silencio no prueba ausencia. (2) El árbol de grupos de Supernova **no refleja las colecciones de Figma** — Supernova agrupa por *tipo* de token, no por colección de origen, así que ver primitivos y semánticos como hermanos no prueba que falten capas. **Sobre arquitectura de alias, la única prueba es el valor resuelto de un token.**

### 🔴 Nombres semánticos que llevan el color adentro

`background/brandRed`, `background/brandDarkBlue` y equivalentes. **Nombrar el color dentro de la capa semántica anula el propósito del token**, aunque el alias detrás sea correcto: el nombre miente cuando la marca cambie de color. Confirmado como defecto por el Lead el 13 ago — se renombran por función.

### 🔴 El cableado del `lineHeight` — auditado a fondo el 13 ago 2026

> ⚠️ **Supersede el diagnóstico del 12 ago**, que lo describió como *"cuatro estilos Poppins, corrección fácil"*. **No son cuatro estilos y no tiene que ver con Poppins.** Ver la sección de auditoría tipográfica abajo. Lista de ejecución en `Later2.0/Later: Brand System/2. Proyecto/Correcciones/tipografia-correcciones.md`.

**Es un cableado mal hecho, no un hueco de tokens** — eso del 12 ago sigue siendo cierto. Lo que cambió es el alcance: **seis tamaños semánticos completos** (`heading/3xl`, `heading/xl`, `heading/l`, `heading/s`, `text/l`, `text/m`), cada uno con sus seis pesos, apuntando al escalón de interlineado inmediatamente inferior. **36 variables, 72 ediciones contando ambos modes.**

### Otros defectos verificados

| Hallazgo | Evidencia |
| --- | --- |
| **Capitalización mezclada dentro de una misma colección** | `border` tiene `radius/Pill` y `radius/Circle` junto a `radius/zero` y `width/zero`. `semanticColors` mete PascalCase en `illustration/DarkBlueGradient/tint-2` |
| **Sombras duplicadas y con nombres que no coinciden** | Cada sombra existe como variable (`shadows/single/small/sm1`) **y** como effect style (`Shadows/Single/Small/sm-1`). Dos fuentes de verdad, nombres distintos. Y dentro de las variables: `sm1, sm2, sm3` sin guion pero `sm-4` con guion |
| ~~**`semiBold` no tiene primitivo**~~ | ❌ **Falso, corregido el 13 ago.** `weight/semiBold` existe con valor `Semi Bold`. Lo que sí hay es inconsistencia en los valores del grupo: `Semi Bold` con espacio junto a `SemiBold Italic` sin él |
| **`size/h5xl`** | Toda la escala es `h-s`, `h-m`, `h-2xl`… y luego `h5xl` sin guion. Sus hermanos `lineHeight/h-5xl` y `letterSpacing/h-5xl` sí lo llevan. Rompe cualquier parseo de la escala |
| **Tres esquemas de nombre en text styles** | `Heading/S/Bold` · `Text/L - Poppins/Bold` (fuente en el nombre) · `Amount/Text/L/Bold`. Los dos últimos son casi-duplicados entre sí |
| ~~**Token de componente en la capa semántica**~~ | ❌ **No es defecto.** El Lead confirma el 13 ago que `graphs`, `illustration` y las colecciones de dominio equivalentes se crearon a propósito |
| **`family` huérfano** | Variable llamada exactamente `family`, sin grupo, en medio de `semanticType` |
| **Grid styles inconsistentes** | `Columns Grid/Web app/…/12 Cols - 1440` frente a `Columns Grid/Web site/…/12 Cols - D1440` y `DL1920`. Prefijos de letra sin regla declarada |
| **Matriz de pesos irregular** | `Heading/S` tiene 4 pesos; M/L/XL tienen 2; 2XL–5XL solo 1. Nada documenta si es intencional |
| **Sin tokens de opacidad** | Confirmado 13 ago: el grupo raíz `Opacity` existe en Supernova pero no tiene tokens. La opacidad solo vive dentro de los `overlay/*`, como valor crudo |
| **Idioma: limpio** | Todos los tokens y estilos en inglés. Sin mezcla — a diferencia de los componentes |

### Defectos adicionales verificados en el pipeline (13 ago 2026)

| Hallazgo | Evidencia |
| --- | --- |
| **`neutralsChromatic` está mal nombrado** | Sus valores son `#000000`, `#202020` … `#FFFFFF` — grises puros, es decir *acromáticos*. El nombre afirma lo contrario de lo que contiene |
| **Primitivos duplicados en valor** | `neutralsChromatic/300` y `neutralsGray/500` son ambos `#BFBFBF`. `neutralDarkBlue/900 (Blue 100 Ladrillos)` y `brandColors/Blue 100 Ladrillos` son ambos `#041B3D` — y el primero lleva paréntesis dentro del nombre |
| **Escala `subtle` incoherente** | `background/positiveSubtle` apunta a `green/400`, **más saturado** que su base `green/600`. Igual `text/offer` → `red/100` |
| **Dirección de estado invertida** | `text/linkPressed` → `blue/100` (más claro) mientras `linkHover` → `blue/700` (más oscuro). Sin regla declarada |
| **Tokens declarados y no construidos** | `graphs/visualMapping/hot`, `warm` y `cold` son los tres `#FFFFFF` sin alias |
| **Los `overlay/*` son los únicos con valor crudo** | `#FFFFFF / 10%` sin aliasar. El grupo raíz `Opacity` no tiene tokens. El Lead confirma que hoy no se consumen |
| **Flotantes sucios en `lineHeight`** | `74.9px` en desktop, `67.65px` en mobile |
| **`code-syntax-web` asignado a medias** | `heading/5xl/regular/size` y `regular/letterSpacing` la llevan; `semiBold/size` y `bold/size` no. Afecta el nombre que sale a código |
| **Typos publicados** | `text/warninSubtle` · `text/tertaryInverse` · `text/secundaryInverseStatic` · `illustration/OrangeAcent` · `secondaryColors/Orange acento` |

### Orden de arreglo — revisado el 13 ago 2026

> Los pasos 1 y 2 del orden anterior —construir la capa primitiva y publicar `brandColors`, declarados *"el trabajo crítico"*— **ya estaban resueltos**. El trabajo cambia de naturaleza: no es reconstruir arquitectura, es limpiar defectos localizados y destrabar el pipeline.

1. **Destrabar el import de variables** — bloqueante. Sin esto se audita el pasado, no el archivo.
2. **Reparar el cableado de `lineHeight`** en las cuatro variantes Poppins. Sigue siendo la mejor relación valor/esfuerzo del lote.
3. **Renombrar los semánticos que llevan el color en el nombre** y corregir los typos publicados.
4. **Resolver los primitivos duplicados** y el nombre de `neutralsChromatic`.
5. **Revisar con el Lead las escalas incoherentes** (`subtle`, dirección de estados) — son criterio de diseño, no defecto mecánico.
6. **Eliminar sombras y overlays sin uso**, verificando consumo antes de borrar.
7. ~~Auditar a fondo la capa tipográfica; reconstruir su escala si los valores no aguantan.~~ ✅ **Auditada el 13 ago 2026. Veredicto: corregir in situ, la escala aguanta.** Ver la sección siguiente.

## Auditoría — la capa tipográfica (13 ago 2026)

> Auditada token por token contra Supernova por MCP, con **valor resuelto** en base, `Desktop` y `Mobile`. Lista de ejecución en `Later2.0/Later: Brand System/2. Proyecto/Correcciones/tipografia-correcciones.md`. Veredicto y razón en `DECISIONS.md` (repo de Product Design).
>
> ⚠️ **Sobre qué se audita.** `FigmaVariablesPlugin` sigue en `hasError: true`, `lastImportResult: null`, último intento **13 ago 19:53 UTC**. Todo lo de abajo describe el **último import exitoso de variables**, no el Figma de hoy.

### Veredicto: corregir in situ. La escala aguanta.

Cuatro pruebas, todas falsables:

1. **La escala es 1:1 por diseño.** 12 primitivos de `lineHeight`, 12 tamaños semánticos. Si cada semántico consumiera el primitivo de su nombre, la correspondencia sería exacta. Hoy hay **3 huérfanos** —`h-s`, `h-xl`, `h-3xl`, que ningún `heading/*` consume— y 3 compartidos por dos dueños. Escala bien diseñada, mal conectada.
2. **El defecto está en una sola propiedad.** `size` empareja **12 de 12** y `letterSpacing` **11 de 12**, en ambos modes. `lineHeight` empareja **6 de 12**. Con las otras dos perfectas, es copy-paste, no criterio equivocado.
3. **`amount/*` es la misma escala cableada bien** en los cuatro tamaños que cubre — incluso donde su gemelo falla: `amount/heading/s` usa `h-s` mientras `heading/s` usa `t-l`. Prueba cuál era la intención y que era alcanzable.
4. **El factor tiene razón declarable.** `lineHeight / size` decrece conforme crece el tamaño, que es la práctica correcta: 1.500 en el tramo de texto, **1.324 exacto** en los cinco escalones de 20–40px, **1.208 exacto** en 48 y 56, 1.170 en 64. Los decimales sucios (`52.96`, `67.65`, `74.9`) son el residuo de aplicar el factor sin redondear — no valores a ojo.

### El desglose del cableado roto

| Semántico | `size` | `lineHeight` hoy | Le toca | Factor hoy |
| --- | --- | --- | --- | --- |
| `heading/5xl` · `4xl` · `2xl` · `m` | — | — | ✅ correcto | 1.170 / 1.208 / 1.324 / 1.324 |
| **`heading/3xl`** | 48px | `h-2xl` 52.96 | `h-3xl` 57.98 | 1.103 |
| **`heading/xl`** | 32px | `h-l` 37.07 | `h-xl` 42.37 | 1.158 |
| **`heading/l`** | 28px | `h-m` 31.78 | `h-l` 37.07 | 1.135 |
| **`heading/s`** | 20px | `t-l` 23.52 | `h-s` 26.48 | 1.176 |
| **`text/l`** | 16px | `t-m` 21 | `t-l` 23.52 | 1.313 |
| **`text/m`** | 14px | `t-s` 18 | `t-m` 21 | 1.286 |
| `text/s` · `text/n` | — | — | ✅ correcto | 1.500 / 1.200 |

Seis pesos por tamaño, verificados uno a uno: **36 variables, idénticas en Desktop y Mobile → 72 ediciones.**

### ✅ El eje responsive está sano — no se toca

- **Desplazamiento de exactamente un escalón, uniforme, sin excepciones.** `heading/5xl` 64→56, `4xl` 56→48, `3xl` 48→40, `2xl` 40→32, `xl` 32→28, `l` 28→24, `m` 24→20, `s` 20→16.
- **`size`, `lineHeight` y `letterSpacing` se mueven las tres juntas** y coherentemente.
- **`text/*` no se desplaza** (16/14/12/10 en ambos modes). Defendible —el cuerpo de texto no debe encoger en móvil— pero **no está declarado**, y sus tokens figuran en la lista de overrides de ambos themes con valor idéntico al base. Hay que escribirlo o alguien lo "arregla".
- **`Desktop` es el mode base.** Sus valores resueltos son idénticos a los base. `App` ya no existe.

Que el defecto de `lineHeight` se replique **idéntico** en los dos modes confirma que el mecanismo es sano: propaga fielmente lo que le dan, incluido el error.

⚠️ **No verificable desde Supernova:** al aplicar un theme, Supernova resuelve el alias hasta el primitivo final (`unit/56`) y oculta la capa intermedia (`size/h-4xl`), que sí aparece en base. **No se puede concluir si los modes aliasan a `size/*` o saltan directo a `unit/*`.** Hay que abrirlo en Figma; si saltan, la arquitectura de dos capas se pierde en ambos modes.

### 🔴 La familia tipográfica no está tokenizada en la capa semántica

**No existe ningún `heading/*/*/family` ni `text/*/*/family`.** Cada tamaño define `size`, `lineHeight`, `letterSpacing` y `weight` — **cuatro de las cinco propiedades de un estilo de texto**. La quinta vive incrustada en el nombre del composite: `Typography/Text/L - Poppins` frente a `Text/L - Nunito Sans`.

Los primitivos `family/poppins`, `family/nunitoSans` y `family/azeretMono` sí existen. Y hay un token suelto **`String/family` = `Nunito Sans`**, en el grupo `String` junto a `title` y `url` —que son placeholders de contenido—: ése es el *"`family` huérfano"* del 12 ago.

**Consecuencia, y es la que importa:** por eso existen text styles casi-duplicados por familia. El sistema resuelve *"esto es Poppins"* **duplicando el estilo**, no cambiando un token. A código la familia no viaja como token.

**Recomendación — antes de tokenizar, verificar si el mismo rol usa de verdad dos familias.** Si `heading` siempre es Poppins y `text` siempre Nunito Sans, no hace falta token: hace falta borrar la mitad de los estilos y escribir la regla. Es mucho más barato y elimina los casi-duplicados de un tirón. **Decisión de arquitectura del Lead, no de este lote.**

### Los demás defectos, y quién decide

**Mecánicos, sin criterio — se aplican y ya:**

| Defecto | Evidencia |
| --- | --- |
| **`text/n` sin tracking** | Apunta a `letterSpacing/none` (0px) en ambos modes, dejando huérfano a `letterSpacing/t-n` (0.3px). Es el tamaño más chico del sistema: 0 de tracking es lo contrario de lo que pide la legibilidad. 12 ediciones |
| **`unit/26` vale 24px** | Primitivo cuyo nombre miente. Hoy funciona **por accidente** porque coincide con `unit/24`; corregirlo cambiará el valor de lo que cuelgue de él. La escala no tiene otro salto de 2 en ese rango (`24, 28, 32`) — **recomendación: eliminarlo**, verificando consumo antes |
| **`size/h5xl` sin guion** | Único del sistema. Rompe el parseo de la escala en código |

**Criterio de diseño — no se aplican sin el Lead, cambian el aspecto del texto en todo el producto:**

| Decisión abierta | Evidencia |
| --- | --- |
| **`letterSpacing/t-*` no es monótono** | `t-n` 0.3 · `t-s` **0.4** · `t-m` **0.1** · `t-l` **0.2**. Dos inversiones: el tracking debe decrecer conforme crece el tamaño. El tramo de heading sí es monótono (−0.4 → −1.4) |
| **Dos pares de escalones indistinguibles** | `letterSpacing/h-4xl` y `h-5xl` ambos `-1.4px`; `h-l` y `h-xl` ambos `-0.6px` |
| **`lineHeight/t-n` va contra la propia escala** | 12/10 = **1.200**, el factor más bajo del sistema en el tamaño más pequeño. Debería ser el más alto. Propuesta: 15px (×1.500) |

### La verificación de cierre

Es binaria y no admite interpretación: tras corregir y re-importar, **los doce primitivos de `lineHeight` deben tener exactamente un consumidor en `heading`/`text`, y cero huérfanos.** Si el conteo cierra, el cableado quedó bien.

> **Nota metodológica para quien retome:** `search_design_system` trunca a ~14–20 resultados por llamada, así que los conteos del 12 ago son **mínimos verificados**, no totales. Los modes sí quedaron verificados vía Supernova: existen `Light`, `Dark`, `Desktop`, `Mobile` y `App`.

## Arquitectura de tokens — decisiones tomadas (13 ago 2026)

Las dos decisiones que el 12 ago quedaron esperando al Lead **ya se tomaron en la entrevista del 13 ago**, y una de ellas invirtió la recomendación original. Detalle completo en `DECISIONS.md` (repo de Product Design).

**La regla de fondo se mantiene:** la capa semántica **aliasa, nunca copia un valor**. Verificado el 13 ago: hoy se cumple en color, salvo los `overlay/*`.

**Convención:** todo minúscula, separación por `/`, sin espacios ni acentos, sin nombre de tipografía ni de color en la capa semántica, escalas numéricas 100–900 para color primitivo, T-shirt para dimensión, profundidad máxima de 4 niveles.

### Los modes, resueltos

| Eje | Decisión |
| --- | --- |
| **Color: light / dark** | ✅ Construido y verificado. Light es el default |
| **Tipografía por dispositivo** | ✅ **Se queda como Variables con modes en Figma Y se consume por media query en código.** No era disyuntiva: son las dos mitades del mismo mecanismo. **Supersede la recomendación B del 12 ago** |
| **`App`** | ❌ Se colapsa. Verificado que es duplicado exacto de `Mobile`: misma lista de ~300 overrides, mismos valores. Quedan `Desktop` (default) y `Mobile`, que engloba app y web |
| **Accesibilidad** | 🟡 Recomendación pendiente de ratificar — ver abajo |

**Cómo opera el eje tipográfico, en palabras del Lead.** El diseño vive en `Desktop` por default y no hay que tocarlo. Al construir la vista responsiva se le cambia el mode al frame principal y toda la tipografía responde sola. Verificado: en `Mobile`, `heading/5xl` aliasa al primitivo `h-4xl` — toma el escalón de abajo. En código, bajo el breakpoint se consume mobile; desktop es el default y no necesita media query propia. El grupo `Breakpoint` ya existe en Dimension como insumo.

### Accesibilidad: un eje, tres problemas distintos

El Lead quiere un mode de accesibilidad. La recomendación es **partirlo**, porque no son el mismo problema — y esto supersede la recomendación del 12 ago de descartarlo por completo:

- **Contraste: sí funciona como mode.** Existe `prefers-contrast` y el sistema operativo lo expone. Encaja con el pipeline.
- **Daltonismo: no debe ser un mode.** Es un antipatrón conocido — obliga al usuario a saber que existe y activarlo. Lo correcto es WCAG 1.4.1: **que la paleta base no dependa del matiz para comunicar**. Si `positive` y `negative` solo se distinguen por verde/rojo, un mode alterno no lo arregla; lo arregla añadir icono o texto al estado.
- **Escalado de tamaño: tampoco.** Lo resuelve la unidad relativa respetando lo que el usuario ya configuró en su sistema. Un mode congela un tamaño.

### Alcance: reconstrucción selectiva, no borrón y cuenta nueva

El Lead planteó reconstruir el sistema desde cero. **Se descartó con evidencia:** la arquitectura de color está sana y borrarla tiraría también el eje responsive, que costó trabajo considerable, contra una capacity de 15 h/semana.

- **Color:** corregir in situ.
- **Tipografía:** auditar a fondo y reconstruir la escala si los valores no aguantan. Es donde el propio Lead sospecha más, y donde ya aparecieron flotantes sucios.
- **Espaciado, radio, elevación:** auditar — siguen sin capa primitiva.

### El piloto

**El Button, acordado con Engineering, corriendo en paralelo a la corrección de foundations.** Prueba el pipeline punta a punta con el componente más usado; si sale limpio, siguen lotes de diez —construir, documentar, sincronizar.

**Sobre el dilema *tokens o componentes primero*:** los **primitivos** se fijan solos, pero los **semánticos** solo se validan contra un componente real. El Button es el que revela qué semánticos faltan y cuáles sobran, así que el piloto es parte del diseño de tokens, no algo posterior.

## Voz y tono — dos ramas del mismo v1.0 (13 ago 2026)

**No está en Figma.** El archivo de Figma solo contiene identidad visual. La voz y tono vive en Drive, en **dos documentos homónimos** que resultaron ser **ramas paralelas del mismo original**, no versiones sucesivas: ambos declaran `Ver. 1.0`, julio 2024, con los mismos cuatro firmantes, y comparten pasajes verbatim.

| Documento | Qué desarrolló | Última edición |
| --- | --- | --- |
| **Google Doc** `MANUAL DE VOZ Y TONO` | **El modelo.** Jerarquía explícita (`VALOR PRINCIPAL → INCISIVA`, tres secundarios), racional `REPRESENTA`/`RESPALDA` por valor, tono de dos niveles con complementarios, y la **matriz de aplicación por elemento** — H1 / H2 / párrafo / CTA por canal, que es la única que sirve para UI | may 2025 |
| **Deck** `MANUAL DE VOZ Y TONO 1.0` | **La capa lingüística.** Identidad verbal, retórica, campos semánticos, lenguaje deseable/indeseable, **lenguaje prohibido por regulación**, redacción de marca y productos, análisis del lema | nov 2025 |

La fecha no decide: **cada archivo se editó tarde en su propia mitad**. Transcripción del deck en `Later2.0/Later: Brand System/2. Proyecto/voz-y-tono-100ladrillos.md` — es un **derivado** que se regenera desde la fuente, nunca al revés.

**Lo que el Doc resuelve y el deck no:**

- El **inversionista objetivo**, que en el deck dice literalmente *"Por determinar."*, en el Doc es el **`INVERSIONISTA TROYANO`** con doce viñetas: benchmark contra Monific y Brick, rendimiento sobre plusvalía inicial, Mercado Secundario como salida, notificaciones por WhatsApp, reinversión automática.
- La **jerarquía de los cuatro valores de voz**, que la disposición gráfica del deck dejaba ambigua.
- La fecha (`15 de julio` frente al marcador `XX de JULIO`) y el estatus regulatorio (**CONDUSEF** además de CNBV).

**Lo que el deck tiene y el Doc perdió.** El índice del propio Doc todavía lista `IDENTIDAD VERBAL`, `RETÓRICA` y `CAMPOS SEMÁNTICOS` en las páginas 14–17, pero su cuerpo ya no las contiene: **ese material estuvo ahí y se borró**. Y es donde vive el contenido más nuevo de ambos archivos — la línea discursiva de **renta internacional** y la prohibición de `dolarizado` / `rentas en dólares`.

**Texto muerto detectado:** la sección `RETÓRICA` del deck declara la voz como *"mordaz - segura - transparente - retadora"* y el tono como *"seductor - autónomo - atractivo"*. **No coincide con nada en ninguno de los dos documentos.** No debe viajar a la versión consolidada.

### 🔴 Cuatro decisiones abiertas — son de Brand, no de Product Design

Regla de frontera: la **voz de marca** pertenece a Marketing. Product Design consume, no decide. Estas cuatro no las resuelve consolidar los archivos:

1. **Rango de edad:** `INVERSIONISTA ESTRATÉGICO (35-45)` seguido de *"entre 35 y 55 años"* — **error idéntico en ambos**, heredado del original.
2. **Qué audiencia rige.** El deck describe *"personas educadas, con mayor poder adquisitivo… selectivos y leales"*; el Doc, *"inversionistas novatos o expertos con cierto nivel de conciencia financiera"*. Es posicionamiento, no redacción.
3. **Variantes de copy de marca:** *"nuestros Ladrillos"* vs *"nuestro producto"* · *"consolidamos"* vs *"fortalecemos"* tu patrimonio · *"elige Libertad"* vs *"elige seguridad tecnológica"*.
4. **Por qué se borró `IDENTIDAD VERBAL` del Doc** — si fue migración deliberada al deck o pérdida.

> **El defecto de gobernanza de fondo:** dos archivos divergentes que dicen ser la misma versión. Si eso llega a Supernova sin resolverse, se propaga. Cualquier consolidación debería subir a **1.1** con entrada en control de cambios.

**Frontera de skills:** esto es `brand-writing` (voz de marca), no `ux-writing` (voz de producto). Si Supernova aloja ambas, la frontera hay que declararla explícita.

## Dónde vive la auditoría

| Artefacto | Ubicación |
| --- | --- |
| Informe completo | `Later2.0/Later: Brand System/2. Proyecto/_Superado/[Auditoría] Later Brand System — Diagnóstico y arquitectura propuesta.md` |
| Versión publicada para leer y compartir | Artefacto privado en claude.ai, publicado el 12 ago 2026 |
| Veredicto y decisiones | Este archivo y `DECISIONS.md` (repo de Product Design) |

Pendiente: subir el informe a Drive cuando el Lead lo valide, para que el equipo lo vea.

## Qué queda fuera de esta fase

Distribución a los entornos de consumo (WebApp, Admin, canales públicos tipo Hubspot o Webflow), capacitación formal a los equipos, y gestión de versiones. El brief los ubica en una fase posterior con fecha TBD.

## Dónde vive el proyecto

Tres ubicaciones con **tres trabajos distintos**. No es duplicación: es división deliberada.

| Ubicación | Su trabajo | Quién entra |
| --- | --- | --- |
| **Este repo** (`100Ladrillos`) | **La fuente de verdad del área.** El oráculo: contexto, decisiones, y la visibilidad del design system dentro de Product Design | Los agentes y quien clone el repo |
| **Drive** — *The Last of UX* → `1. DesignOps/2. Hecho/Later - Brand System/` | **Repositorio global del proyecto.** Documentos, briefs, decks, diagnóstico. Es donde el equipo tiene visibilidad — nadie entra a la máquina del Lead | Todo el equipo y las contrapartes |
| **Local** — `/Users/alexfacio/Proyectos/Later2.0/` | **El taller.** Donde nace el trabajo nuevo: código, tokens, apps de prueba, documentos en construcción antes de subirlos a Drive | El Lead y sus agentes |

Subcarpetas en Drive: `1. Recursos`, `2.Proyecto` (Branding, Iconos e Ilustraciones, Diagnóstico, Oráculo, Naming BS) y `3. Entregables`.

**El taller espeja esa estructura.** Dentro de `Later2.0/` conviven las tres apps (`later-web-next`, `later-web-astro`, `later-mobile-expo`) y la carpeta **`Later: Brand System/`**, que replica las subcarpetas de Drive: `1. Recursos`, **`2. Proyecto`** y `3. Entregables`.

> ⚠️ **Regla para agentes:** los documentos del proyecto van a `Later2.0/Later: Brand System/2. Proyecto/` — **nunca a la raíz de `Later2.0/`**, que es donde viven las apps. Ahí están la auditoría, `tipografia-correcciones.md`, `button-renombres-piloto.md` y `voz-y-tono-100ladrillos.md`. Escribir en la raíz obliga al Lead a reacomodar a mano y deja las rutas de este repo apuntando a la nada. Corregido el 13 ago 2026 tras haber pasado.

**La regla que se desprende:** lo que se construye empieza en el taller, se publica a Drive cuando el equipo debe verlo, y **su estado se refleja aquí**. El riesgo conocido es que los documentos de Drive envejezcan respecto del taller — pasó con el brief y el framework frontend. Este archivo es el antídoto: se actualiza cuando el estado cambia.

---
Fuente: `[Brief v1.0] Later: Brand System` (3 jun 2024, actualizado 2026) — Drive · `[KickOff] - Rediseño de Branding - Fase 2` (jul 2026) — Drive · `[Overview] - Fase 2: Renovare -> Later: Brand System - Sprint 2 Q326` — Drive · conversación con el Lead, 12 ago 2026.

Evidencia de industria citada en el brief y el kickoff: McKinsey *The Business Value of Design* (2018) · NN/g sobre deuda de UX · Sparkbox *Design Systems Survey* (2022) · *Design System ROI* (2026) · zeroheight ROI Calculator.

---

## El ciclo componente → token, y cómo cerrarlo

**Registrado el 17 ago 2026.** El Lead describió el proceso real con el que se construyó el sistema:

> *"Armé una base de variables, y al crear los componentes me di cuenta que en ciertos contextos no funcionaba. Me tenía que regresar a las variables a crear alternativas de colores que pudieran funcionar para ese contexto. Ha sido un vaivén, y es muy posible que nos vaya a pasar ahora."*

**Eso no es un defecto del método: es el método.** Los semánticos no se deducen en abstracto — se descubren al chocar con un componente concreto. Lo raro sería lo contrario.

**El punto de fuga es otro: el token entra al sistema cuando desbloquea el componente, no cuando queda cerrado.** Los tres defectos encontrados el 17 ago son la misma firma — `positiveSubtle` con un nombre que significaba lo opuesto, `offer` sin par de texto, `text/secondary` con el rojo de marca en dark. En los tres el token resolvió el componente y ahí se detuvo.

### Triaje — qué significa que un componente no encuentre su token

Cuando al construir un componente ningún token sirve, **hay tres diagnósticos distintos y solo uno es "crear"**:

| Lo que pasa | Diagnóstico | Qué se hace |
| --- | --- | --- |
| El rol ya existe pero lo busqué por color | **Nada roto** | Buscar por rol, no por valor |
| Existe un token para este rol, pero su nombre o su valor no corresponden | **El existente está mal** | **Arreglar ese**, no crear uno nuevo al lado |
| El rol es nuevo y aplica a más de un componente | **Falta un semántico** | Crear, y cerrar el ciclo de abajo |
| Solo lo necesita este componente y nadie más | **Es token de componente** | ⚠️ **Esa capa no existe hoy** en el sistema — ver `DECISIONS.md` (repo de Product Design) 17 ago |

**La pregunta que separa el segundo del tercero:** *¿el token nuevo se distingue del existente por **contexto de uso** o solo por **valor**?*

- **Por contexto** → semántico nuevo legítimo. `positiveHighlight` (verde de dato) frente a `positive` (verde de alerta) es exactamente esto, y fue una buena decisión mal nombrada.
- **Solo por valor** → casi siempre el existente está mal. Crear un gemelo con otro tono multiplica la deuda en vez de resolverla.

### Cierre — un token no está listo por funcionar en su componente

**Cinco puntos. Mientras falte uno, el token es deuda con apariencia de solución:**

1. **El nombre dice el ROL**, no el color ni una intensidad relativa. *Prueba: ¿alguien que solo lee el nombre en la lista lo usaría bien?* `background/brandRed` y `positiveSubtle` fallaban esta prueba.
2. **Verificado en LOS DOS modes**, contra las superficies donde de verdad se dibuja — no solo donde se probó.
3. **Si es un fondo, su par de texto está definido.** Un par que solo vive en la cabeza de quien armó el componente se rompe cuando lo toca otra persona. Es el patrón `on*` de `13-convencion-naming.md` (repo de Product Design) §9.
4. **Descripción que dice cuándo usarlo, cuándo NO, y con qué se confunde.** El valor ya está a la vista; lo que no se ve es el criterio.
5. **Si nació de un componente concreto, preguntar qué otro componente lo necesitaría.** Si la respuesta es ninguno, es un token de componente disfrazado de semántico.

**Y la restricción va escrita dentro del token**, no en un documento aparte: `text/positiveHighlight` lleva en su descripción que solo sirve para texto grande. Quien lo use lo lee donde va a mirar.

### Lo que esto implica para el lote de componentes

**Va a volver a pasar, y está bien.** Lo que cambia es que cada hueco que aparezca se cierra con los cinco puntos antes de seguir, en vez de acumularse para una auditoría posterior. **La auditoría de agosto existe porque ese cierre no ocurrió la primera vez.**

