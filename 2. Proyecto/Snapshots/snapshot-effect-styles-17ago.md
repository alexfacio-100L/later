# Snapshot de los effect styles — 17 ago 2026, antes de ligar las tintas

**Para qué sirve:** revertir. Si al ligar el color a `shadow/*` alguna sombra cambia de aspecto, aquí está el valor original de cada capa para restaurarlo a mano.

**Estado en el momento del snapshot:** 27 estilos (26 sombras + `Blur/10`). Cinco ya ligados en la pasada anterior —los que usa el Button—, el resto con color literal.

---

## Inventario

| Color | Estilos | Opacidades distintas |
| --- | --- | --- |
| **`#0E1F35`** | 24 | 0.06 · 0.08 · 0.10 · 0.12 · 0.14 · 0.16 · 0.18 · 0.20 · 0.24 · 0.28 · 0.32 · 0.36 · 0.48 → **13** |
| **`#051D3D`** | 2 | 0.06 · 0.12 |

**Frecuencia de uso de cada opacidad en `#0E1F35`:** `0.12` ×15 · `0.06` ×7 · `0.08` ×7 · `0.10` ×5 · `0.16` ×5 · `0.20` ×3 · `0.14` ×2 · y una sola vez cada uno de `0.18`, `0.24`, `0.28`, `0.32`, `0.36`, `0.48`.

---

## Los 26 estilos, capa por capa

Formato: `y · blur · spread · alpha`. Todos son `DROP_SHADOW` con `x = 0`.

### Single / Small

| Estilo | Capas | Ligado antes del snapshot |
| --- | --- | --- |
| `sm-1` | `0 · 2 · 0 · 0.12` | `shadow/default` |
| `sm-2` | `2 · 4 · 0 · 0.12` | `shadow/default` |
| `sm-3` | `3 · 7 · 0 · 0.12` | `shadow/default` |
| `sm-4` | `4 · 8 · 0 · 0.16` | `shadow/strong` |

### Single / Medium

| Estilo | Capas |
| --- | --- |
| `md-1` | `12 · 20 · 0 · 0.12` |
| `md-2` | `14 · 24 · 0 · 0.16` |
| `md-3` | `16 · 28 · -1 · 0.18` |
| `md-4` | `28 · 40 · -1 · 0.20` |

### Single / Large

| Estilo | Capas |
| --- | --- |
| `lg-1` | `32 · 48 · -2 · 0.20` |
| `lg-2` | `36 · 56 · -4 · 0.28` |
| `lg-3` | `40 · 64 · -6 · 0.36` |
| `lg-4` | `48 · 84 · -8 · 0.48` |

### Multiple / Small

| Estilo | Capas |
| --- | --- |
| `sm-1` | `0 · 2 · 0 · 0.12` |
| `sm-2` | `1 · 4 · 0 · 0.06` — `0 · 2 · 0 · 0.12` |
| `sm-3` | `4 · 8 · 0 · 0.08` *(→ `shadow/subtle`)* — `1 · 4 · 0 · 0.12` *(→ `shadow/default`)* |
| `sm-4` | `6 · 12 · 0 · 0.08` — `4 · 8 · 0 · 0.10` — `1 · 4 · 0 · 0.12` |

### Multiple / Medium

| Estilo | Capas |
| --- | --- |
| `md-1` | `12 · 20 · 0 · 0.06` — `6 · 12 · 0 · 0.08` — `2 · 4 · 0 · 0.06` |
| `md-2` | `14 · 24 · 0 · 0.08` — `6 · 12 · 0 · 0.12` — `3 · 6 · 0 · 0.08` |
| `md-3` | `16 · 28 · -1 · 0.10` — `8 · 16 · 0 · 0.16` — `4 · 8 · 0 · 0.10` |
| `md-4` | `20 · 40 · -1 · 0.12` — `12 · 18 · 0 · 0.20` — `6 · 10 · 0 · 0.12` |

### Multiple / Large

| Estilo | Capas |
| --- | --- |
| `lg-1` | `20 · 38 · -2 · 0.06` — `16 · 24 · -1 · 0.12` — `10 · 20 · 0 · 0.12` — `5 · 10 · 0 · 0.06` |
| `lg-2` | `32 · 64 · -2 · 0.08` — `24 · 32 · -1 · 0.16` — `10 · 20 · 0 · 0.16` — `5 · 10 · 0 · 0.08` |
| `lg-3` | `40 · 72 · -5 · 0.24` — `32 · 64 · -4 · 0.14` — `16 · 32 · -3 · 0.12` — `10 · 20 · -2 · 0.10` — `5 · 10 · -1 · 0.06` |
| `lg-4` | `56 · 84 · -5 · 0.32` — `32 · 64 · -4 · 0.14` — `16 · 32 · -3 · 0.12` — `10 · 20 · -2 · 0.10` — `5 · 10 · -1 · 0.06` |

### 🔴 Modern / Soft — color distinto, `#051D3D`

| Estilo | Capas |
| --- | --- |
| `v1` | `72 · 132 · 0 · 0.06` |
| `v2` | `90 · 200 · 0 · 0.12` |

**Son los dos únicos que no usan `#0E1F35`.** No hay razón documentada para la diferencia. **Se dejan sin ligar** hasta que se decida si se unifican — ligarlos a una tinta de `#0E1F35` les cambiaría el color, y unificar es decisión del Lead.

### Blur/10

`LAYER_BLUR · 4`. No es sombra, no lleva color, queda fuera.

---

## Cómo revertir

Si al ligar una sombra cambia de aspecto, en Figma: abrir el estilo, desligar el color de la variable y volver a escribir el hex y el alfa de la tabla de arriba. La geometría —`y`, `blur`, `spread`— **no se toca en ningún momento** del proceso de ligado, así que solo el color puede desviarse.

**Comprobación de que nada cambió:** tras ligar, cada capa debe conservar exactamente el mismo `alpha` de esta tabla. Si un alfa difiere, la tinta asignada no era la que correspondía.
