# Propuesta · El reparto contra las cuatro pestañas vivas

> 🟡 **Es una PROPUESTA, no doctrina.** *El Lead la aprueba o la corrige. Cuando la apruebe, se traslada al `README.md` del repo (paso 2.7) y al destino que él decida.*
>
> **Fecha:** 25 sep 2026 · **Método:** ingeniería inversa del Button, no invención.

## Qué se leyó para derivarla

**Las cuatro pestañas vivas, leídas en Supernova** con `getFullDocumentationLegacyRepresentation` el 25 sep 2026 — el grupo `Button` (`836f5e48-77f0-4499-b344-51779236a6d6`, `groupBehavior: Tabs`):

| Pestaña | persistentId | Bloques vivos | Oculta |
| --- | --- | --- | --- |
| `Resumen general` | `68ae03cb-…` | 13 | no |
| `_Usos` | `cae701ed-…` | 36 | **sí** |
| `Especificaciones` | `05ae1325-…` | 56 | no |
| `Estatus y cambios` | `e8df1bb3-…` | 12 | no |

**Y el `.md` insumo:** `Componentes/button.md`, 945 líneas, **16 secciones de nivel 2**.

*El volcado local `salida/button-tabs/*.mdx` se contrastó contra el contenido vivo: coinciden bloque a bloque en el primer bloque de cada pestaña y en el número de `title2` por pestaña (3 · 10 · 12 · 5).*

---

## 1 · La regla, enunciada en general

**Cada pestaña hace una pregunta, y una sección va a la pestaña cuya pregunta responde.**

| Pestaña | La pregunta que hace | Quién la trae |
| --- | --- | --- |
| **Resumen general** | **¿Qué es esto, y es lo que busco?** | cualquiera que llega por el índice |
| **Usos** | **¿Cuál elijo, y cómo lo uso bien?** | quien diseña una pantalla o escribe su copy |
| **Especificaciones** | **¿Cuánto mide, de qué color, cómo se anuncia?** | quien lo construye, y quien lo prueba |
| **Estatus y cambios** | **¿Puedo confiar en él hoy, y qué cambió?** | quien ya lo tiene puesto |

**La discriminante, en una línea: no es el tema, es la decisión que el lector toma.** *El color aparece en tres pestañas del Button y no está duplicado: en `Resumen general` decide si mira, en `Usos` decide cuál pone, en `Especificaciones` decide qué valor escribe.*

### Regla de segundo orden — una sección que responde a dos preguntas se PARTE, no se duplica

**Precedentes medidos en el Button, tres:**

| Sección del `.md` | Se partió entre | Por dónde corta |
| --- | --- | --- |
| `Behavior & interaction` | `Usos` ← → `Especificaciones` | La tabla de condiciones (`rest`/`hover`/`focus-visible`…) es medida; «qué pasa mientras carga» y «cuándo no deshabilitar» son elección |
| `Content & data assumptions` | `Usos` ← → `Especificaciones` | Las reglas del label —1 a 3 palabras, 24 caracteres— son elección; la tabla de entradas y tipos es medida |
| `Cross-references` | `Usos` ← → `Especificaciones` | `Componentes relacionados` es elección; `Foundations relacionadas` es construcción |

### La única cosa que sí se repite, y es deliberado: el preview

**El frame `1e9df347-…` aparece en `Resumen general` y en `Usos`.** *Mismo `entityId`, distinto título y descripción: «Las dos variantes» arriba, «primary y secondary» abajo.* **La imagen se reutiliza; la prosa no.**

---

## 2 · El reparto sección a sección — cobertura **16 de 16**

| # | Sección del `.md` de uSpec | Va a | Aterrizó en |
| --- | --- | --- | --- |
| 1 | `Overview` | **Resumen general** | § Qué resuelve · § Cómo está construido |
| 2 | `Anatomy` | **Especificaciones** | § Anatomía *(tabla de 4 filas, idéntica)* |
| 3 | `Behavior & interaction` | **partida** | Esp § Estados · § Área táctil — Usos § Qué pasa mientras carga · § Cuándo no deshabilitar |
| 4 | `Motion` | **Especificaciones** | § Movimiento · § Con `prefers-reduced-motion` |
| 5 | `Responsive rules` | **Especificaciones** | § Ancho, alto y zoom |
| 6 | `Content & data assumptions` | **partida** | Esp § Contenido que recibe — Usos § Cómo se escribe el label |
| 7 | `Known gaps` | **Estatus y cambios** | § Defectos abiertos |
| 8 | `Follow-ups` | **nunca se publica** | *gestión de trabajo* |
| 9 | `API` | **Especificaciones** | § Propiedades · § Cómo se declara `isLoading` |
| 10 | `Structure` | **Especificaciones** | § Medidas *(por talla, superficie, variante, foco)* |
| 11 | `Color` | **Especificaciones** | § Color |
| 12 | `Token resolution` | **Especificaciones** | § Color › Cómo resuelve en cada mode · Los tokens del componente |
| 13 | `Voice / Screen reader` | **Especificaciones** | § Lector de pantalla |
| 14 | `Acceptance criteria` | **Especificaciones** | § Criterios de aceptación |
| 15 | `Cross-references` | **partida** | Usos § Componentes relacionados — Esp § Foundations relacionadas |
| 16 | `Provenance` | **nunca se publica** | *metadato del generador* |

**Cobertura: 16 de 16 clasificadas · 14 publicadas · 2 nunca.** Ninguna se forzó.

### 🔴 El cambio de criterio que hay que ratificar, porque contradice lo escrito

**`Known gaps` pasó de «especificación» a `Estatus y cambios`.** *El reparto de tres pestañas —README paso 2.7— lo manda a la pestaña de medida.* **En el Button vive en la de confianza, y la regla nueva lo explica:** un defecto abierto no cambia lo que alguien escribe, cambia si se fía. **Pero el cambio nunca se declaró: se hizo.**

### ⚠️ Y `Anatomy` también se movió, sin criterio escrito

*El reparto de tres pestañas la mandaba a «¿cuál elijo?». En el Button está en `Especificaciones`.* **Esto no responde a ninguna regla visible — hace falta decisión.** *La regla de arriba lo justifica —la anatomía numerada es lo que alguien construye, no lo que alguien elige— pero eso es reconstrucción mía, no criterio registrado.*

---

## 3 · La medición que cambia el tamaño del trabajo de `Link` y `Tag`

🔴 **El `.md` de uSpec NO produce la página. Produce dos tercios de ella.**

**De las 29 secciones publicadas en las cuatro pestañas del Button, 19 tienen origen en el `.md` y 10 se escribieron a mano.**

| Pestaña | Secciones publicadas | Con origen en el `.md` | Escritas a mano |
| --- | --- | --- | --- |
| Resumen general | 3 | 2 | **1** — `Dónde está disponible` |
| Usos | 10 | 5 | **5** — Cuál variante · Cuál superficie · Cuál talla · Cuándo no deshabilitar · Lo que no hace |
| Especificaciones | 11 | **11** | 0 |
| Estatus y cambios | 5 | 1 | **4** — Salud · Definition of done · Changelog · Deprecación |
| **Total** | **29** | **19** | **10** |

**La consecuencia, y es de planificación, no de redacción:** *`Especificaciones` se puede generar del `.md` casi entera.* **`Usos` y `Estatus y cambios` no tienen fuente: 9 de las 10 secciones a mano viven ahí.** *Documentar `Link` y `Tag` con el reparto solo llena una pestaña y media de cuatro.*

⚠️ **Dos de las cuatro a mano de `Estatus y cambios` no son prosa: son bloques vivos** —`component-health` y `component-checklist`— **y solo necesitan el `entityId` del componente.** *Esos sí se automatizan sin escribir nada.* **Changelog y Deprecación no: los tiene que escribir una persona.**

---

## 4 · Qué pasa con una sección que no existe en un componente

**El Button tiene precedente para los dos casos, y son distintos.**

| Caso | Qué hizo el Button | Propuesta |
| --- | --- | --- |
| **La sección aplica y la respuesta es «no»** | `Responsive rules` dice *«El Button no reacciona a los breakpoints. Esto es el comportamiento actual declarado, no una omisión»* — **y se publica**, como § Ancho, alto y zoom, y se repite en Usos § Lo que este componente no hace | **Se publica el «no», afirmado.** *Un hueco silencioso se lee como olvido; un «no» declarado es información* |
| **La sección es de gestión y está vacía** | `Follow-ups` dice `_None._` — **no se publica** | **No se publica.** *Nunca sale del repo* |

### Y a nivel de PESTAÑA, mi recomendación — marcada como recomendación, no como hallazgo

**Las cuatro pestañas se crean siempre.** *`crear-pestanas.mjs` ya las crea fijas, y el índice del portal debe verse igual en los 41 componentes.*

🔴 **Ninguna se deja vacía: una pestaña que quedaría vacía es la señal de que el componente no pasó la puerta de `17-done-de-componente.md`.** *`Estatus y cambios` sin changelog significa que nadie registró qué cambió, no que no cambiara nada.*

**Ni marcador ni pestaña ausente.** *Un marcador («pendiente») se publica, envejece y nadie lo retira — es el falso vigente de la regla 16 con forma de página.*

---

## 5 · Lo que la regla NO resuelve — decisiones que el Lead tiene que tomar

| | La decisión | Por qué no la puedo tomar yo | Mi recomendación |
| --- | --- | --- | --- |
| **A** | **¿`Usos` nace visible u oculta en `Link` y `Tag`?** En el Button se llama `_Usos` y tiene `isHidden: true`, con 36 bloques dentro. 🟢 **El porqué SÍ está registrado** — `99-pendientes.md` D2.9: *«la página la ocultó el Lead, porque falta material suyo por construir»* | Fue una decisión del Lead sobre **ese** componente. **Si vale como regla para los siguientes es decisión suya, no deducción mía** | **Nace oculta y se revela al completarse.** *Coherente con el precedente, y evita publicar media pestaña* |
| **B** | **¿El umbral de 120 líneas y el «nunca dos» siguen vivos?** El README dice «menos de 120 líneas publicables → una sola página»; `crear-pestanas.mjs` crea **cuatro siempre** | Es una contradicción verificable entre dos fuentes, y ninguna es más nueva de forma demostrable | **Retirar el umbral.** Cuatro pestañas fijas en los 41 componentes; el índice constante vale más que ahorrar una pestaña en `Tag` |
| **C** | **¿Se ratifica `Known gaps` → `Estatus y cambios`?** *(§2)* | Cambia el criterio escrito | **Sí.** Un defecto es cuestión de confianza |
| **D** | **¿De dónde salen Changelog y Deprecación en `Link` y `Tag`?** No hay fuente: en el Button son 7 entradas escritas a mano | Es trabajo que hay que presupuestar, no una regla | **Del historial de decisiones del componente.** *Y presupuestarlo: ~1 h por componente* |
| **E** | **`Link` navega — ¿lleva estados `visited` y `external`?** El Button no tuvo el caso | Es criterio de dominio | Que lo diga la auditoría del componente antes de documentar |
| **F** | **`Tag` puede no tener `Motion` ni `Acceptance criteria` propios.** ¿Se publica el «no» (regla §4) o se omite la sección? | El precedente de `Responsive rules` dice publicar; no hay precedente de una sección entera ausente | **Publicar el «no»**, salvo que el Lead prefiera omitir |

---

## 6 · Lo que esta propuesta deja listo para `Link` y `Tag`

1. **La estructura ya se sabe crear** — `npm run docs:pestanas -- --buscar="Link"`.
2. **`Especificaciones` se puede generar del `.md`**, 11 de 11 secciones con origen.
3. **`Resumen general` necesita una sección a mano**, y ya está resuelta: las 6 filas fijas de `Dónde está disponible` (`17-done-de-componente.md` §C).
4. **`Usos` y `Estatus y cambios` se escriben.** *9 secciones, ~2 h por componente.*

⚠️ **Lo que esta propuesta NO hace: no se aplicó a nada y no se construyó ningún guion.** *Es texto para discutir.*
