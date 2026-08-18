# Auditoría de contraste — colores semánticos de estado

**Fecha:** 17 ago 2026 · **Norma:** WCAG 2.2 nivel AA · **Skill:** `accessibility`
**Origen:** duda del Lead — *"si estamos en modo oscuro, no estoy seguro si los rojos de soporte vayan a lograr contraste en dark"*.

---

## Alcance y límites — leer antes de usar estos números

**Qué se midió:** los 30 tokens de `semanticColors` de las familias de estado (`negative`, `warning`, `positive`, `offer`), resueltos a hex **por mode** siguiendo la cadena de alias completa hasta el primitivo.

**Contra qué se midió:**

| Mode | `background/primary` | `background/secondary` |
| --- | --- | --- |
| Light | `#f4f7fb` | `#ffffff` |
| Dark | `#000000` | `#202020` |

🔴 **Si un estado se pinta sobre otra superficie, los números cambian.** `background/inverseStatic` vale `#202020` en **los dos modes** y es sospechoso por la misma razón que todo lo de abajo. **No está medido aquí.**

**Umbrales aplicados:**

| Elemento | Mínimo | Criterio |
| --- | --- | --- |
| `text/*` | **4.5:1** | 1.4.3 Contrast (Minimum), texto normal |
| `icon/*`, `border/*` | **3:1** | 1.4.11 Non-text Contrast |
| `background/*` de estado | **4.5:1** contra el texto que lleva encima | 1.4.3 |

*El 3:1 de icono y borde aplica cuando el elemento es **la señal** — un ícono de error, un borde que marca un campo inválido. Un borde decorativo no cuenta.*

**Lo que una auditoría de contraste NO puede decir:** si el sistema es accesible. Un contraste perfecto no salva un error comunicado **solo con color** (1.4.1). Ver "Lo que el contraste no arregla" al final.

---

## El hallazgo estructural

**28 de los 30 tokens de estado tienen el mismo hex en Light y Dark.**

**Un token semántico que no cambia con el mode no es semántico** — es un primitivo con un nombre bonito. De aquí sale todo lo demás: cada color se eligió mirando **un solo fondo**, y por eso cada uno funciona en un mode y falla en el otro.

**Solo 4 de 17 tokens de texto/icono/borde pasan AA en los dos modes.**

---

## Los que fallan en DARK — la sospecha del Lead, confirmada

Son los tonos **oscuros** de cada escala. Sobre negro o `#202020` se apagan.

| Token | Hex | Light (prim/sec) | Dark (prim/sec) | Mínimo |
| --- | --- | --- | --- | --- |
| `text/negativePressed` | `#8b0505` | 9.21 · 9.90 | **2.12 · 1.65** 🔴 | 4.5 |
| `text/negativeHover` | `#bf0606` | 6.02 · 6.47 | **3.24 · 2.52** 🔴 | 4.5 |
| `text/positive` | `#267c4b` | 4.81 · 5.16 | **4.07 · 3.16** 🔴 | 4.5 |
| `text/warning` | `#965f05` | 4.97 · 5.34 | **3.94 · 3.05** 🔴 | 4.5 |
| `icon/negative` | `#d40707` | 5.10 · 5.48 | **3.83 · 2.97** 🔴 | 3.0 |
| `border/negative` | `#d40707` | 5.10 · 5.48 | **3.83 · 2.97** 🔴 | 3.0 |

**`text/negativePressed` a 1.65 es prácticamente invisible** sobre `background/secondary` en dark.

**No es un problema del rojo:** el verde y el naranja fallan igual. Es la familia entera.

## Los que fallan en LIGHT — el espejo del mismo error

Son los tonos **claros**. Elegidos para dark, se pierden sobre blanco.

| Token | Hex | Light (prim/sec) | Dark (prim/sec) | Mínimo |
| --- | --- | --- | --- | --- |
| `text/warningSubtle` | `#e59206` | **2.31 · 2.49** 🔴 | 8.45 · 6.55 | 4.5 |
| `text/positiveSubtle` | `#34a865` | **2.82 · 3.03** 🔴 | 6.93 · 5.38 | 4.5 |
| `text/offer` | `#f94848` | **3.23 · 3.47** 🔴 | 6.05 · 4.69 | 4.5 |
| `icon/warning` · `border/warning` | `#e59206` | **2.31 · 2.49** 🔴 | 8.45 · 6.55 | 3.0 |
| `icon/positiveSubtle` · `border/positiveSubtle` | `#34a865` | **2.82 · 3.03** 🔴 | 6.93 · 5.38 | 3.0 |

## Los cuatro que pasan en los dos modes

`text/negative` · `icon/offer` · `icon/positive` · `border/positive`

---

## Dos fallos que NO dependen del mode

Éstos fallan siempre, y son los más urgentes porque no hay mode donde funcionen.

### `background/positive` `#2a8a53` no admite texto legible

| Texto encima | Ratio |
| --- | --- |
| Blanco `#ffffff` | **4.32** 🔴 |
| Oscuro `#202020` | **3.77** 🔴 |

**Ningún color de texto alcanza 4.5:1.** El verde está en la banda muerta: demasiado oscuro para texto negro, demasiado claro para texto blanco. **Hay que mover el color, no el texto.**

### `background/offer` `#f94848` con texto blanco da 3.47

Y ése es exactamente el tag de *"últimos ladrillos"* y los descuentos. **Pide texto oscuro** (`#202020` da 4.69), no blanco.

*Cuando el fondo de estado es la única señal de que algo cambió, también necesita **3:1 contra la superficie**. `background/warningSubtle` da **1.51** sobre `background/primary` en Light — indistinguible del fondo.*

---

## 🟢 La solución ya existe en el sistema, ejecutada una sola vez

**`text/negative` es el único token de estado que cambia entre modes:**

| Mode | Valor | Alias | Contraste |
| --- | --- | --- | --- |
| Light | `#bf0606` | `supportColors/red/600` | 6.02 · 6.47 ✅ |
| Dark | `#ff7b71` | **`secondaryColors/orangeAccent`** | 8.32 · 6.46 ✅ |

**Y es el único de la familia `negative` que pasa en los dos modes.**

El Lead lo describió como *"de emergencia sin probar bien"*. **Resultó ser el patrón correcto**, aplicado una vez por accidente. Su único defecto es el alias: `secondaryColors/orangeAccent` **ni es naranja ni es un acento** — es el rojo claro de estado, guardado en el cajón equivocado.

---

## La ruta que esto pide

**No son 17 correcciones sueltas. Es un cambio de arquitectura**, y por eso es decisión del Lead, no ejecución.

**1 · Cada escala de estado necesita dos anclas verificadas** — un tono para fondo claro y otro para fondo oscuro, en `supportColors/red`, `/green` y `/orange`. Hoy `red` tiene la banda oscura bien poblada (500–900) y le falta el tono claro legible; `#ff7b71` ya es el candidato y solo hay que darle su lugar en la escala.

**2 · Los semánticos de estado aliasan distinto por mode**, como ya hace `text/negative`. Es exactamente la regla que el Lead dio para los dos rojos de marca, extendida al resto: **la decide el fondo.**

**3 · Mover `#ff7b71` de `secondaryColors/orangeAccent` a la escala `red`** y reapuntar `text/negative`. Sin esto, el patrón correcto queda escondido detrás de un nombre que miente y nadie lo va a replicar.

**4 · `background/positive` y `background/offer` se corrigen aparte** — no dependen de la decisión de modes y hoy fallan en los dos.

**5 · Verificar `background/inverseStatic`** y cualquier superficie que no sea `primary`/`secondary`.

**Prioridad:** primero 4 (falla siempre, es corto), luego 1–3 (el cambio de fondo), y 5 al cerrar.

---

## Lo que el contraste no arregla

**1.4.1 — El color no puede ser la única señal.** Un error que solo se distingue porque el borde es rojo falla aunque el rojo contraste perfecto: no lo ve quien tiene daltonismo, ni quien mira en sol directo. **El ícono y el texto que el sistema ya usa son los que sostienen esto** — conviene que quede escrito como regla, no como costumbre.

**Y el recordatorio de fondo:** cumplir AA es el piso, no la meta. Estos números dicen que el sistema *conforma* en tal punto; no dicen que sea usable con un lector de pantalla ni bajo luz difícil. Eso se prueba con personas.

---

*Método reproducible: `scratchpad/contraste.py`, fórmula de luminancia relativa WCAG 2.x. Valores extraídos de Figma (`UGwIBzERV4vB7mk0mejZ0y`) resolviendo alias por mode.*
