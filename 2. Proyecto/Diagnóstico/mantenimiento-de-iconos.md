# Mantenimiento de iconos — el deber ser

**19 ago 2026 · para retomar con la PD Jr, que hereda el proyecto de iconos**

> **Este documento no es el proyecto de iconos: es lo que hay que acordar antes de arrancarlo.** El alcance actual de Renovare es tener los iconos listos para consumo en los componentes; construir iconos propios es un proyecto por sí mismo.

---

## De dónde viene esto

100 Ladrillos **no tiene iconos propios**. No ha habido tiempo ni dedicación, así que se usa una librería de terceros. En la Fase 1 se evaluaron varias y se eligió **Heroicons**. Una becaria levantó el **inventario de los iconos en producción** y abrió un **laboratorio** en Figma para construir los propios; **el proyecto quedó pausado al terminar su estancia.**

**Desde 2024 el problema se volvió operativo, y no era de estilo sino de cobertura.** Faltaban iconos para contextos concretos, así que **se pedían bajo demanda** — trabajo fuera del alcance de cada proyecto, que se difería y no llegaba.

**El 19 ago 2026 se cambió a Phosphor**, que trae 1512 iconos y seis pesos. *El coste aceptado: es más minimalista y menos orgánico que Heroicons.*

---

## Lo que hay que decidir con la PD Jr

### 1 · Cómo se crea un icono que Phosphor no cubre

**Phosphor publica cada icono en dos formatos, y esa dualidad es exactamente la herramienta de mantenimiento:**

| | Qué es | Para qué sirve |
| --- | --- | --- |
| **`Stroke`** (Raw) | Trazo **vivo y editable** | **La referencia de factura**: grosor, terminaciones, rejilla |
| **`Outline`** (Flattened) | Trazo **expandido a geometría** | Lo que consume el sistema |

*Phosphor conserva el trazo "para que puedas afinar el estilo". No es una copia redundante: es la fuente.*

**El flujo propuesto:**

```
Hace falta un icono que Phosphor no cubre
        ↓
LABORATORIO  ← se toma un Stroke como patrón de trazo
        ↓        (grosor, terminaciones, rejilla, tamaño de caja)
Se dibuja el icono nuevo con esa misma factura
        ↓
Se expande el trazo a contorno
        ↓
Entra al sistema como Format=Outline, indistinguible de los de Phosphor
```

🔴 **La regla que evita el accidente: el `Stroke` NO se edita en el archivo del sistema.** Editarlo cambiaría el icono para todos los consumidores. **Sirve de patrón en el laboratorio, no de lienzo.**

### 2 · Cuántos pesos se mantienen

Phosphor entrega **seis**: `Thin`, `Light`, `Regular`, `Bold`, `Fill`, `Duotone`. **Decisión del Lead: conservarlos todos hasta tener un caso real que permita decidir.**

**Lo que se sabe hoy:**

- `Thin` y `Light` **se pierden a 16–24 px**, que es donde vive la interfaz
- `Fill` es el par natural de `Regular` para estados activos o seleccionados
- **`Duotone` es monocromo**: usa el mismo token en las dos capas, con la de fondo al 20 %. *Funciona con cualquier color y sigue al token del icono.*

💡 **La oportunidad que nadie ha explorado:** un **duotono bicolor** —dos tokens distintos, por ejemplo el navy de marca y el rojo de acento— **es el único lugar del catálogo donde el sistema puede poner carácter propio sin dibujar un icono.** Los iconos son de terceros y no tienen personalidad 100 Ladrillos; el duotono podría dársela. *Es un experimento acotado y reversible, no un compromiso.*

### 3 · Qué se publica y qué no

**Verificado en la documentación de Supernova el 19 ago:**

| | |
| --- | --- |
| **Bloque de documentación** | ✅ **Permite elegir qué variantes mostrar** (feature de marzo 2025) |
| **Importación** | ❌ Sin filtro por variante — solo se puede habilitar o deshabilitar el scope de Componentes de un archivo entero |
| **Requisito** | **Supernova solo importa componentes publicados en Figma** |

**Consecuencia:** se pueden conservar `Stroke` y `Outline` en Figma y documentar solo `Outline`. **Pero Supernova importa las doce variantes igual** — se elige qué se muestra, no qué entra.

⚠️ **Sin comprobar: si el plan de Supernova aguanta ~18 000 componentes.** *Antes de publicar los 1512, conviene publicar UNO con sus doce variantes y medir. Un icono responde lo que 1512 no dejarían deshacer.*

### 4 · La regla de tamaños, ya decidida

**El estándar son `16`, `20` y `24` px**, y **no es un límite**: se puede usar el nativo de 32, uno mayor o uno propio **siempre que esté justificado**. *Lo que la regla evita no es la excepción: es el tamaño accidental.*

**Por qué hizo falta escribirla:** Heroicons dibujaba tres tamaños en su familia `Solid`, así que **la librería decidía por el diseñador**. Phosphor entrega uno solo, a 32 px: **la decisión pasa a quien diseña.**

*Escrita en `13-convencion-naming.md` §8c del repo de Product Design. Los tokens que la materializan son la tarea 4.4.*

---

## Lo que ya está resuelto y no hay que rediscutir

- 🟢 **El defecto estructural desapareció.** Antes había 327 sets con eje `size` y 309 componentes sueltos sin él — dos anatomías para lo mismo. **Los 1512 de Phosphor tienen firma idéntica.**
- 🟢 **El estilo dejó de ser texto.** Heroicons lo codificaba en el nombre (`Solid`/`Outline`); **Phosphor lo codifica en una propiedad.** Un `iconLeft` puede pasar de trazo a relleno **sin sustituir la instancia**.
- 🟢 **591 instancias migradas** en once páginas, con el color ligado a `icon/primary` en todo el catálogo.
- 🟡 **Dos activos propios siguen huérfanos a propósito:** `logo-hundred-bricks` (7 instancias) e `Industrias illustration` (10). **No son de la librería** — viven en el laboratorio y se reincorporan aparte.
- ⏭️ **El Brand Book conserva 68 iconos de Heroicons.** Es el muestrario de la librería anterior y **su contenido se migra a Supernova manualmente**, así que no se toca en Figma.

⚠️ **Consecuencia de lo anterior: los Heroicons huérfanos no se pueden borrar todavía**, porque ese muestrario los sostiene.

---

## Trampas verificadas, para no volver a descubrirlas

**`swapComponent` NO conserva el tamaño.** La instancia adopta el del componente nuevo, y Phosphor viene a 32×32: un icono de 20 px salta a 32.

**El cambio se propaga en cascada.** Al cambiar una instancia dentro de un component set, las que la heredan se actualizan solas **y pierden su tamaño antes de que un bucle llegue a ellas**.

> **El método que funciona: fotografiar TODAS las medidas antes del primer cambio, hacer el swap, y restaurar desde esa foto.** Medir sobre la marcha llega tarde en cualquier estructura que se propaga sola.

**El criterio de completitud es "componente huérfano", no "el nombre acaba en Solid".** Un icono renombrado se escapa del filtro por nombre, y un activo propio se marca por error — pasó con `Table / Individual / Cell / Label Outline`.
