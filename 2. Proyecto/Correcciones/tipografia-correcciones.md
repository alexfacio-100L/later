# Tipografía — correcciones para aplicar en Figma

> **Para aplicar en Figma**, librería `[Auditoria] - Later: Brand System`, colección de tipografía (semánticos `heading/*`, `text/*`, `amount/*` y primitivos `size/*`, `lineHeight/*`, `letterSpacing/*`, `unit/*`).
>
> **Auditado el 13 ago 2026** contra Supernova por MCP (`sn_get_token_list`, `sn_get_token_detail`, `sn_get_token_theme_list`). Todas las afirmaciones se sostienen en **valor resuelto**, no en el árbol de grupos.
>
> ✅ **Actualizado el 14 ago 2026. El import de variables FUNCIONA** — se probó con un canario y el push retipa tokens correctamente. `hasError: true` **es un indicador que miente**: marca error sin detener el import. Lo verificable se verifica tras el push.
>
> ✅ **Ya aplicado por el Lead el 14 ago:** `unit/26` corregido a 26px · **scopes asignados a todo el sistema** (`lineHeight/*` llega como `LineHeight`, `size/*` como `FontSize`, `radius/*` como `BorderRadius`, `width/*` como `BorderWidth`, `Space/*` como `Space`).
>
> 📌 **§4 (`size/h5xl`) se absorbe en la tarea 1.13** del tablero — renombrar la colección `size` → `fontSize`, que corrige el guion en el mismo movimiento. **No hacerlo suelto aquí.**

---

## Veredicto: se corrige in situ. No se reconstruye.

La Decisión 6 del 13 ago dejó abierto reconstruir la escala *"si los valores no aguantan"*. **Aguantan.** La prueba es aritmética y falsable:

**1. La escala es 1:1 por diseño, y el cableado es lo único que la rompe.**

Hay exactamente **12 primitivos de `lineHeight`** y **12 tamaños semánticos**. Si cada semántico consumiera el primitivo de su mismo nombre, la correspondencia sería perfecta: cero primitivos huérfanos, cero primitivos compartidos. Hoy hay **3 huérfanos** (`h-s`, `h-xl`, `h-3xl` no los consume ningún `heading/*`) y **3 compartidos por dos dueños**. Eso no es una escala mal diseñada: es una escala bien diseñada mal conectada.

**2. `size` y `letterSpacing` están 100 % correctos. Solo falla `lineHeight`.**

| Propiedad | Emparejamiento correcto | Estado |
| --- | --- | --- |
| `size` | 12 de 12 | ✅ Desktop y Mobile |
| `letterSpacing` | 11 de 12 | ✅ salvo `text/n` |
| `lineHeight` | **6 de 12** | 🔴 seis tamaños con el escalón de abajo |

Un defecto que aparece en una sola de las tres propiedades, con las otras dos perfectas, es **copy-paste**, no criterio de diseño equivocado.

**3. `amount/*` es la misma escala cableada bien.** En los cuatro tamaños que cubre, apunta al primitivo de su nombre — incluso donde su gemelo de `heading`/`text` falla:

| Token | `lineHeight` que usa | Su gemelo | Lo que usa el gemelo |
| --- | --- | --- | --- |
| `amount/heading/s` (20px) | `h-s` 26.48 ✅ | `heading/s` | `t-l` 23.52 ❌ |
| `amount/text/l` (16px) | `t-l` 23.52 ✅ | `text/l` | `t-m` 21 ❌ |
| `amount/text/m` (14px) | `t-m` 21 ✅ | `text/m` | `t-s` 18 ❌ |
| `amount/text/s` (12px) | `t-s` 18 ✅ | `text/s` | `t-s` 18 ✅ |

**`amount/*` es la evidencia definitiva:** demuestra cuál era la intención y que era alcanzable. No hay que inventar una escala nueva — hay que copiar la que ya está bien escrita al lado.

**4. El eje responsive está sano y no debe tocarse.** Ver la sección de modes abajo.

**Lo que sí se reconstruye —y es chico— son cuatro valores primitivos**, no la escala.

---

## 1. 🔴 El cableado de `lineHeight` — 36 variables, 72 ediciones

**Esto supersede el diagnóstico del 12 ago**, que reportó *"cuatro estilos Poppins con `lineHeight` mal apuntado"*. **No son cuatro estilos: son seis tamaños completos, y no tiene nada que ver con Poppins.** El defecto afecta los seis pesos de cada tamaño y está presente en Desktop y en Mobile por igual.

### La regla que hay que restaurar

> **`X/N/*/lineHeight` apunta a `lineHeight/N`** — el primitivo del mismo nombre que su `size`.

### Desktop (= valores base)

| Semántico | `size` | `lineHeight` hoy | **Debe apuntar a** | Factor hoy | Factor correcto |
| --- | --- | --- | --- | --- | --- |
| `heading/5xl` | 64px | `h-5xl` 74.9 | — ✅ | 1.170 | — |
| `heading/4xl` | 56px | `h-4xl` 67.65 | — ✅ | 1.208 | — |
| **`heading/3xl`** | 48px | `h-2xl` 52.96 | **`h-3xl` 57.98** | 1.103 | 1.208 |
| `heading/2xl` | 40px | `h-2xl` 52.96 | — ✅ | 1.324 | — |
| **`heading/xl`** | 32px | `h-l` 37.07 | **`h-xl` 42.37** | 1.158 | 1.324 |
| **`heading/l`** | 28px | `h-m` 31.78 | **`h-l` 37.07** | 1.135 | 1.324 |
| `heading/m` | 24px | `h-m` 31.78 | — ✅ | 1.324 | — |
| **`heading/s`** | 20px | `t-l` 23.52 | **`h-s` 26.48** | 1.176 | 1.324 |
| **`text/l`** | 16px | `t-m` 21 | **`t-l` 23.52** | 1.313 | 1.470 |
| **`text/m`** | 14px | `t-s` 18 | **`t-m` 21** | 1.286 | 1.500 |
| `text/s` | 12px | `t-s` 18 | — ✅ | 1.500 | — |
| `text/n` | 10px | `t-n` 12 | — ✅ | 1.200 | — |

**Seis tamaños × seis pesos = 36 variables.** Los pesos son `regular`, `semiBold`, `bold`, `italic`, `semiBoldItalic`, `boldItalic` — verificados uno por uno; **el defecto es idéntico en los seis**, no hay variantes sueltas.

### Mobile — el mismo defecto, un escalón abajo

En `Mobile` toda la escala de `heading` baja exactamente un escalón (`heading/5xl` = 56px, `heading/s` = 16px) y `text/*` no se mueve. El emparejamiento correcto es el mismo, evaluado sobre el tamaño resuelto en ese mode:

| Semántico | `size` Mobile | `lineHeight` hoy | **Debe apuntar a** |
| --- | --- | --- | --- |
| `heading/5xl` | 56px | `h-4xl` 67.65 ✅ | — |
| `heading/4xl` | 48px | `h-3xl` 57.98 ✅ | — |
| **`heading/3xl`** | 40px | `h-xl` 42.37 | **`h-2xl` 52.96** |
| `heading/2xl` | 32px | `h-xl` 42.37 ✅ | — |
| **`heading/xl`** | 28px | `h-m` 31.78 | **`h-l` 37.07** |
| **`heading/l`** | 24px | `h-s` 26.48 | **`h-m` 31.78** |
| `heading/m` | 20px | `h-s` 26.48 ✅ | — |
| **`heading/s`** | 16px | `t-m` 21 | **`t-l` 23.52** |
| **`text/l`** | 16px | `t-m` 21 | **`t-l` 23.52** |
| **`text/m`** | 14px | `t-s` 18 | **`t-m` 21** |

**Total: 36 variables × 2 modes = 72 ediciones de valor.** Es el bloque grande de este documento y el de mayor impacto visual.

### Cómo verificar que quedó

Tras aplicar y re-importar, **ningún primitivo de `lineHeight` debe quedar huérfano y ninguno debe tener dos dueños**. Los doce quedan con exactamente un consumidor en `heading`/`text`. Si sobra o falta uno, algo quedó a medias.

---

## 2. 🔴 `text/n` no lleva tracking

`text/n/*/letterSpacing` apunta a **`letterSpacing/none` (0px)**, en Desktop y en Mobile. El primitivo que le toca, **`letterSpacing/t-n` (0.3px)**, existe y **está huérfano** — es el único de su grupo sin consumidor.

| Semántico | Hoy | **Debe apuntar a** |
| --- | --- | --- |
| `text/n/*/letterSpacing` (10px, 6 pesos) | `none` 0px | **`t-n` 0.3px** |

**No es cosmético.** 10 px es el tamaño más pequeño del sistema; es justo donde el tracking positivo hace falta para separar las formas. Ponerle 0 es lo contrario de lo que pide la legibilidad. **6 pesos × 2 modes = 12 ediciones.**

---

## 3. ✅ `unit/26` vale 24px — CORREGIDO el 14 ago 2026

> **Hecho.** El Lead lo corrigió a `26px` y lo publicó. Verificado por MCP. Se conserva el análisis abajo como registro; **la recomendación de eliminarlo quedó superada** — el Lead optó por corregir el valor.

### Análisis original

| Token | Valor | Debería |
| --- | --- | --- |
| `unit/26` | **24px** | 26px |

`unit/*` es la capa primitiva de la que cuelga `size/*`. Un primitivo cuyo nombre miente sobre su valor es la peor clase de defecto: se propaga en silencio a todo lo que lo consuma.

⚠️ **Antes de corregirlo, verificar quién lo consume.** Hoy `unit/24` y `unit/26` valen lo mismo, así que **cualquier cosa cableada a `unit/26` está funcionando por accidente** y cambiará de valor al corregirlo. Dos salidas válidas:

- **Corregir a 26px** si el escalón de 26 hace falta en la escala, y re-apuntar a `unit/24` lo que en realidad quería 24.
- **Eliminarlo** si nadie lo necesita — la escala `unit/*` no tiene otro salto de 2 en ese rango (`24, 28, 32`), lo que sugiere que `26` fue un escalón añadido y luego abandonado.

**Recomendación: eliminarlo.** Es más barato que arrastrar un escalón sin lugar en la progresión. Y si se elimina, **acordarse de borrarlo también a mano en Supernova** — el plugin no propaga bajas (R-12).

---

## 4. 🟡 `size/h5xl` rompe la convención

| Actual | Nuevo |
| --- | --- |
| `size/h5xl` | **`size/h-5xl`** |

Todos sus hermanos llevan guion (`size/h-4xl`, `size/h-3xl`…) y sus contrapartes `lineHeight/h-5xl` y `letterSpacing/h-5xl` también. Es el único del sistema sin él. Rompe cualquier parseo de la escala y sale así a código.

---

## 5. 🟡 `letterSpacing` — dos escalones indistinguibles y el tramo de texto desordenado

**Duplicados de valor** (dos escalones que no se distinguen):

| Par | Valor compartido |
| --- | --- |
| `letterSpacing/h-4xl` · `h-5xl` | ambos `-1.4px` |
| `letterSpacing/h-l` · `h-xl` | ambos `-0.6px` |

**El tramo de texto no es monótono.** El tracking debe *decrecer* conforme el tamaño *crece*. Hoy:

| Primitivo | Tamaño que sirve | Valor | Esperado |
| --- | --- | --- | --- |
| `t-n` | 10px | 0.3px | el más alto del tramo |
| `t-s` | 12px | **0.4px** | menor que `t-n` |
| `t-m` | 14px | **0.1px** | menor que `t-s` |
| `t-l` | 16px | **0.2px** | menor que `t-m` |

Dos inversiones: `t-n < t-s` y `t-m < t-l`. **El tramo de heading sí es monótono** (−0.4 → −1.4), así que esto está localizado en cuatro valores.

🟡 **Esto es criterio de diseño, no defecto mecánico. Decisión del Lead.** Una progresión defendible sería `0.4 / 0.3 / 0.2 / 0.1`, pero cambia el aspecto del cuerpo de texto en todo el producto — no se aplica sin verlo.

---

## 6. 🟡 El factor de `t-n` está invertido respecto a la escala

La escala primitiva aplica un factor `lineHeight / size` que **decrece conforme crece el tamaño** — que es la práctica correcta, y es la razón declarable que salva a esta escala de tener que reconstruirse:

| Tramo | Factor |
| --- | --- |
| `t-s`, `t-m` (12–14px) | 1.500 |
| `t-l` (16px) | 1.470 |
| `h-s` … `h-2xl` (20–40px) | **1.324** exacto en los cinco |
| `h-3xl`, `h-4xl` (48–56px) | **1.208** exacto en los dos |
| `h-5xl` (64px) | 1.170 |

Los decimales sucios (`52.96`, `67.65`, `74.9`) no son azar: son el residuo de aplicar el factor sin redondear. **La progresión tiene lógica y se sostiene.**

**La única excepción es `t-n`:** 12 / 10 = **1.200**, el factor más bajo de toda la escala, en el tamaño más pequeño. Va exactamente contra la regla. Debería ser el más alto.

| Token | Valor | Propuesta |
| --- | --- | --- |
| `lineHeight/t-n` | 12px (×1.200) | **15px** (×1.500, alineado con `t-s` y `t-m`) |

🟡 **Decisión del Lead.** Es un valor de escala, no un cableado. Afecta a `text/n` en todo el producto.

---

## 7. 🟡 La familia tipográfica no está tokenizada en la capa semántica

**Verificado:** no existe ningún token `heading/*/*/family` ni `text/*/*/family`. Cada tamaño semántico define `size`, `lineHeight`, `letterSpacing` y `weight` — **cuatro de las cinco propiedades de un estilo de texto.** La quinta se elige fuera del sistema de tokens: vive en el nombre del text style composite (`Typography/Text/L - Poppins` frente a `Text/L - Nunito Sans`).

Los primitivos sí existen: `family/poppins`, `family/nunitoSans`, `family/azeretMono`. Hay además un token suelto **`String/family` = `Nunito Sans`**, en el grupo `String` junto a `title` y `url`, que son placeholders de contenido — no es la capa semántica de familia, es el huérfano que el 12 ago se reportó como *"variable llamada exactamente `family`"*.

**Consecuencia, y es la que importa:** por eso existen text styles casi-duplicados por familia. El sistema resuelve *"este texto es Poppins"* **duplicando el estilo**, no cambiando un token. A código no viaja la familia como token; viaja incrustada en el nombre del estilo.

🔴 **Esto es decisión de arquitectura del Lead, no una corrección de este lote.** Las dos salidas:

- **Tokenizar la familia** — agregar `heading/*/*/family` y `text/*/*/family` apuntando a `family/*`. Colapsa los duplicados de estilo, pero es alta de tokens en toda la capa semántica.
- **Declarar que la familia se decide por rol, no por token** — y entonces `Poppins` / `Nunito Sans` deja de estar en el nombre del estilo y pasa a ser una regla escrita (p. ej. *heading = Poppins, text = Nunito Sans*).

**Recomendación: la segunda, y verificar si el sistema realmente usa dos familias para el mismo rol.** Si `heading` siempre es Poppins y `text` siempre es Nunito Sans, no hace falta tokenizar nada — hace falta borrar la mitad de los estilos y escribir la regla. Es mucho más barato y elimina los casi-duplicados de un tirón. Si en cambio hay superficies donde el mismo rol cambia de familia, entonces sí hace falta el token.

---

## 8. ✅ El eje responsive está sano — no tocarlo

Verificado token por token en las tres propiedades, `Desktop` frente a `Mobile`:

- **El desplazamiento es de exactamente un escalón, uniforme, sin excepciones.** `heading/5xl` 64→56, `4xl` 56→48, `3xl` 48→40, `2xl` 40→32, `xl` 32→28, `l` 28→24, `m` 24→20, `s` 20→16. Ni un salto irregular.
- **`size`, `lineHeight` y `letterSpacing` se desplazan las tres a la vez**, coherentemente. `heading/s` en Mobile queda en 16px con `letterSpacing/t-l` — el par correcto para 16px.
- **`text/*` no se desplaza:** 16 / 14 / 12 / 10 en ambos modes. Es una decisión defendible — el cuerpo de texto no debe encoger en móvil — pero **no está declarada en ningún lado**, y los tokens de `text/*` sí figuran en la lista de overrides de ambos themes con valor idéntico al base. Conviene escribirlo, o alguien lo va a "arreglar".
- **`Desktop` es el mode base:** sus valores resueltos son idénticos a los base. `App` ya no existe — la eliminación manual funcionó.

**El defecto de `lineHeight` se replica idéntico en los dos modes**, lo que confirma que el mecanismo responsive es sano: propaga fielmente lo que le dan, incluido el error.

⚠️ **No verificado desde Supernova:** al aplicar un theme, Supernova resuelve el alias hasta el primitivo final (`unit/56`) en vez de mostrar la capa intermedia (`size/h-4xl`), que sí aparece en los valores base. **No se puede concluir desde aquí si los modes aliasan a `size/*` o saltan directo a `unit/*`.** Hay que abrirlo en Figma. Si saltan, la arquitectura de dos capas se pierde en ambos modes y es un hallazgo mayor.

---

## Prioridad — por relación valor/esfuerzo

| # | Corrección | Ediciones | Impacto |
| --- | --- | --- | --- |
| **1** | **Cableado de `lineHeight`** (§1) | 72 | 🔴 Alto. Seis de doce tamaños con interlineado apretado en todo el producto. Mecánico, sin criterio: la tabla dice a qué apuntar |
| **2** | **`text/n` → `letterSpacing/t-n`** (§2) | 12 | 🔴 Legibilidad en el tamaño más pequeño. Trivial |
| **3** | **`size/h5xl` → `size/h-5xl`** (§4) | 1 | 🟡 Un renombre. Rompe el parseo en código |
| **4** | **`unit/26`** (§3) | 1 | 🟡 Verificar consumo antes. Recomendado: eliminar |
| **5** | **`letterSpacing` duplicados y no monótono** (§5) | 4–6 | 🟡 Decisión del Lead. Cambia el aspecto del texto |
| **6** | **`lineHeight/t-n` 12 → 15** (§6) | 1 | 🟡 Decisión del Lead |
| **7** | **La familia** (§7) | — | 🔴 Decisión de arquitectura. No es de este lote |

**Los pasos 1 a 4 no necesitan criterio: son mecánicos y la tabla los dicta.** Ésos se aplican y ya. Los pasos 5 a 7 son criterio de diseño y van a conversación con el Lead antes de tocarse.

---

## Después de aplicar

1. ~~Destrabar el import~~ ✅ **Resuelto el 14 ago: el import funciona.** `hasError: true` no lo detiene.
2. Correr el plugin de Figma Variables Sync (es push manual, `autoImportMode: Never`).
3. **Ojo con las bajas.** Si se elimina `unit/26`, el plugin **no propaga el borrado**: hay que eliminarlo a mano en Supernova (R-12).
4. **Verificación de cierre, y es la buena:** listar `lineHeight/*` y confirmar que **los doce primitivos tienen exactamente un consumidor** en `heading`/`text`, y **cero huérfanos**. Si ese conteo cierra, el cableado quedó bien. Si no, quedó a medias.

> ⚠️ **Verificar SIEMPRE por MCP después del push, no en Figma.** El 14 ago, al aliasar `Space/*` a `unit/*`, `Space/L` quedó apuntando a `unit/14` en vez de `unit/16` — dos entradas contiguas en la lista. **Rompía el ritmo de la escala y no era visible en Figma.** Lo atrapó la verificación tras el push. Estas 36 ediciones son exactamente el mismo tipo de trabajo.
