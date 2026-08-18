> 🛑 **DESACTUALIZADO — aplicado el 14 ago 2026, con una premisa que resultó FALSA.**
>
> Este documento afirmaba que renombrar los nueve slots de icono a tres nombres haría que **Figma los fusionara**, bajando la API de 16 propiedades a 10. **Se probó y no ocurre.** La fusión sucede cuando propiedades homónimas viven en *variantes distintas* y Figma las unifica al formar el set; aquí ya son nueve propiedades del mismo set con identidad propia, y renombrarlas no las une. **Fusionarlas exige reconstruir el componente**, no renombrarlo.
>
> **Lo aplicado realmente:** `Purpose` → **`Surface`** con valores `Product`/`Marketing` (no `Purpose`, ver auditoría del 14 ago) · `On-focus` → `Focus` · `M. B. Izquierdo/Derecho` → `marginLeft`/`marginRight` · los nueve slots con nombres únicos y coherentes (`iconLeftMicro`, `iconRightMini`, `iconLoadingSmall`…), sin typos ni español mezclado. **La API sigue en 16 propiedades.**
>
> **La sección del `Quaternary` ya no aplica:** ese tipo se eliminó y el componente pasó de 205 a 175 variantes.
>
> Estado y decisiones vigentes: `contexto/11-renovare-ejecucion.md` tarea 2.3 y `DECISIONS.md`, 14 ago 2026.

---

# Button — correcciones antes de correr el piloto

> **Para aplicar en Figma**, librería `[Auditoria] - Later: Brand System`, componente `Button`.
> Verificado contra Supernova el 13 ago 2026 (`sn_get_figma_component_detail`). 205 variantes, 16 propiedades.
>
> **Por qué antes y no después:** el piloto está probando que los nombres viajen bien a código. Si corre con los nombres de hoy, lo que valida es la propagación de un typo hasta producción.

---

## 1. El typo que llega a código

| Actual | Nuevo |
| --- | --- |
| `Propouse` | **`Purpose`** |

Es una **propiedad de variante publicada**, no una capa. Engineering la lee como nombre de prop. Sus valores (`Regular`, `CTA`) están bien.

## 2. El valor que rompe la convención

| Propiedad | Actual | Nuevo |
| --- | --- | --- |
| `State` | `On-focus` | **`Focus`** |

Sus cinco hermanos son PascalCase de una palabra: `Default`, `Hover`, `Pressed`, `Loading`, `Disabled`. `On-focus` es el único con guion y minúscula, y el guion complica el nombre generado en código.

## 3. Los 9 slots de icono — aquí está el problema real

Hoy el componente expone **nueve** propiedades `InstanceSwap`:

| ID | Nombre actual |
| --- | --- |
| `3566:5` | `Icono Izq. Micro` |
| `3566:9` | `Icono Der. Micro` |
| `3570:10` | `Icono Izq. Mini` |
| `3570:41` | `Icono Der. Mini` |
| `3570:72` | `Icon. Izq. Small` ← además con el typo `Icon.` |
| `3570:103` | `Icono Der. Small` |
| `3570:134` | `Icon Loading Small` |
| `3570:165` | `Icon Loading Mini` |
| `3570:346` | `Icon Loading Micro` |

**Dos defectos superpuestos:**

1. **Vocabulario de tamaño incompatible.** Los slots hablan de `Micro`, `Mini`, `Small`. El eje `Size` del componente va de `S` a `XXL`. Son dos escalas distintas dentro del mismo componente, y nada documenta cómo se corresponden.
2. **El tamaño no debería estar en el nombre del slot.** El tamaño ya lo determina la variante. Que el slot lo repita obliga a quien consume el componente a elegir entre nueve entradas cuando conceptualmente hay tres.

**La corrección: renombrarlos a tres nombres, no a nueve.**

| Slots actuales | Nombre nuevo |
| --- | --- |
| `Icono Izq. Micro` · `Icono Izq. Mini` · `Icon. Izq. Small` | **`iconLeft`** |
| `Icono Der. Micro` · `Icono Der. Mini` · `Icono Der. Small` | **`iconRight`** |
| `Icon Loading Micro` · `Icon Loading Mini` · `Icon Loading Small` | **`iconLoading`** |

Cuando varias variantes exponen una propiedad con el mismo nombre y tipo, **Figma las fusiona en una sola propiedad del set**. El resultado: la API del Button pasa de **16 propiedades a 10**, y el consumidor ve `iconLeft` / `iconRight` / `iconLoading` en vez de nueve variantes de lo mismo.

> ⚠️ **Verificar al aplicar:** confirma que cada slot sigue apuntando a su instancia por defecto correcta (`474:5817`, `765:1572`, `474:5819`, `996:3080`…). El renombrado no debería tocar los defaults, pero conviene revisarlo antes de publicar.

## 4. Las abreviaturas sin glosario

| Actual | Nuevo |
| --- | --- |
| `M. B. Izquierdo` | **`marginLeft`** |
| `M. B. Derecho` | **`marginRight`** |

Son booleanos. `M. B.` no está documentado en ningún lado; si significa otra cosa —"Margen Bloque", "Margen Botón"—, ajusta el nombre, pero **no lo dejes abreviado**: nadie fuera de ti puede decodificarlo.

## 5. `Label` se queda

Es `Text`, se llama `Label`, está bien. No lo toques.

---

## La API resultante

De 16 propiedades a **10**:

| Propiedad | Tipo | Valores |
| --- | --- | --- |
| `Size` | Variant | `XXL`, `XL`, `L`, `M`, `S` |
| `Type` | Variant | `Primary`, `Secondary`, `Tertiary`, `Quaternary` |
| `State` | Variant | `Default`, `Hover`, `Pressed`, `Focus`, `Loading`, `Disabled` |
| `Purpose` | Variant | `Regular`, `CTA` |
| `Label` | Text | — |
| `iconLeft` | InstanceSwap | — |
| `iconRight` | InstanceSwap | — |
| `iconLoading` | InstanceSwap | — |
| `marginLeft` | Boolean | — |
| `marginRight` | Boolean | — |

---

## Documentar antes de publicar: las dos reglas de `Quaternary`

De 240 combinaciones posibles hay **205**. Las 35 ausencias **no son azar** — verificado reconstruyendo la matriz completa:

| Regla | Variantes que no existen |
| --- | --- |
| `Quaternary` nunca existe con `Purpose = CTA`, en ningún tamaño | 5 × 6 = **30** |
| `Quaternary` + `Regular` nunca tiene `State = Loading` | **5** |

Los otros 35 grupos (`Size` × `Type` × `Purpose`) están completos con sus seis estados.

**Esto es una regla de diseño, no deuda** — y probablemente correcta: un botón cuaternario no debería ser una llamada a la acción ni mostrar estado de carga. **Pero no está declarada en ningún lado.** Sin documentarla, el generador de código las lee como huecos y alguien las va a "arreglar" añadiendo variantes que no deben existir.

Ponlo en la descripción del componente, que sí viaja a Supernova:

> `Quaternary` es el botón de menor jerarquía: no admite `Purpose = CTA` ni `State = Loading`, porque no se usa para acciones primarias ni para operaciones que bloqueen la interfaz.

---

## Después de aplicar

1. Republica la librería en Figma.
2. Re-importa la conexión de archivo en Supernova (no se sincroniza sola — `autoImportMode: Never`).
3. **Ojo con las bajas:** el plugin de variables sincroniza altas y cambios, pero **no borrados**. Si algún renombrado deja residuo en Supernova, hay que eliminarlo a mano.
4. Verifica en Supernova que la propiedad aparece como `Purpose` y que los slots de icono son tres.

Con eso el Button está listo para correr punta a punta.
