# Cómo actualizar uSpec sin planchar nuestras adecuaciones

**20 ago 2026.** *Resuelto antes de tocar nada de uSpec, que es el momento en que sale barato.*

---

## El punto de partida, verificado

**Hoy no hemos modificado ni una línea de uSpec.** Las 13 skills y los 14 references son idénticos al paquete publicado `0.3.2`.

⚠️ **Parecía lo contrario.** Una comparación directa marca **12 de 13 skills como modificadas**, y es falso: **`init` resuelve tres familias de placeholder al instalar**, y esas sustituciones cambian el archivo sin cambiar su contenido.

| Placeholder en el paquete | Se convierte en |
| --- | --- |
| `{{ref:api/x.md}}` | `../../../references/api/x.md` |
| `{{skill:create-x}}` | `` the `create-x` skill `` |
| `{{repo:figma-plugin/x}}` | `../../../figma-plugin/x` |

> **Sin normalizar esas tres, cualquier comparación es ruido.** *Fue exactamente lo que pasó en el primer intento: 12 falsos positivos.*

---

## La herramienta

```bash
node verificar-uspec.mjs          # compara con la última publicada
node verificar-uspec.mjs 0.4.0    # compara con una versión concreta
```

**No instala nada globalmente.** Descarga el paquete a un temporal, compara, y lo borra. *Así se puede consultar cualquier versión sin ensuciar el sistema ni tocar el proyecto.*

**Qué responde:**

| | |
| --- | --- |
| **Contra la versión instalada** | Toda diferencia es **nuestra**. Es la lista de lo que se perdería al reinstalar |
| **Contra una versión nueva** | Qué cambió arriba, qué archivos son nuevos y cuáles se retiraron |

---

## La estrategia: no editar arriba, extender al lado

**La regla que hace todo esto sostenible:**

> **Lo de uSpec se deja intacto. Lo nuestro vive aparte.**

**Lo que ya cumple esa regla:**

| Nuestro | Dónde |
| --- | --- |
| El conversor a Supernova | `experimento-canario/conversor.mjs` |
| La bandera de destino | `experimento-canario/destino.mjs` |
| Configuración | `uspecs.config.json` |
| Toda la documentación de este directorio | `*.md` |

**Ninguno lo toca una actualización**, porque `init` solo escribe en `.claude/skills/` y `references/`.

### Cuando haya que modificar una skill

*El caso previsto: recortar las `create-*` para que solo dibujen el `#preview`.*

**Antes de hacerlo, correr `verificar-uspec.mjs` para partir de verde.** Después:

1. **Modificar lo mínimo**, y anotar qué y por qué en este archivo
2. **Guardar el original** junto al modificado, como `SKILL.md.orig`
3. **Volver a correr el verificador**: la skill aparecerá en la lista de modificados, que es justo lo que queremos — **es el inventario de lo que hay que reaplicar**

---

## El procedimiento de actualización

**1 · Ver qué cambió arriba**

```bash
node verificar-uspec.mjs
```

**2 · Si hay modificaciones nuestras, guardarlas** — copiar los archivos que el verificador liste.

**3 · Actualizar**

```bash
npx uspec-skills@<versión> init
```

**4 · Reaplicar** lo nuestro sobre la versión nueva, comprobando que el cambio de arriba no lo haya dejado sin sentido.

**5 · Fijar la versión** en `uspecs.config.json` y en el `package.json` del proyecto.

**6 · Correr el verificador otra vez** — debe listar exactamente lo que reaplicaste, ni más ni menos.

---

## Lo que queda pendiente

🔴 **No existe `package.json` en la raíz del proyecto.** `npx uspec-skills` **resuelve la última versión publicada cada vez**. Hoy el config declara `0.3.2` y npm sirve `0.3.2` — **coinciden por casualidad, no por garantía.** *Cuando uSpec publique `0.4.0`, el proyecto la usará sin avisar y sin que nadie lo decida.*

**Fijarla como `devDependency` es lo que convierte este procedimiento en una decisión en vez de un accidente.**

---

## Adecuaciones locales vigentes

*Lo que hay que reaplicar tras cada actualización de uSpec. El verificador las lista solo.*

### `create-anatomy` — modo solo-preview (20 ago 2026)

**Qué:** una directiva al inicio de la skill y tres marcas en el cuerpo, para que solo construya la capa `#preview` y omita lo que ya viaja en el `.md`.

| Bloque | Acción |
| --- | --- |
| Step 7 — relleno del header | Omitido *(la sección sí se crea: dentro vive el `#preview`)* |
| Step 8 — `--- Fill annotation table ---` | Omitido por completo |
| Step 8b — secciones por sub-componente | Omitido salvo hijos constitutivos |

**Por qué:** el sistema documenta en Supernova. La tabla, el encabezado y las notas se convierten allí en bloques nativos; rellenarlos en Figma es trabajo que se tira.

🔴 **La plantilla de la tabla NO se borra del frame.** *Decisión del Lead, y es la correcta: el camino de contingencia `DESTINO_DOCUMENTACION=figma` necesita esa plantilla para poder escribir. Un frame sin ella deja el flujo de respaldo sin destino.*

**El original está en `SKILL.md.orig`, junto al modificado.** *No se versiona —es una copia del upstream— pero permite ver el diff en local.*

### Lo que NO hace falta recortar

**Solo cuatro skills producen `#preview`:** `create-anatomy`, `create-color`, `create-property` y `create-structure`.

*`create-api`, `create-voice` y `create-motion` no generan ninguno.* **Si no se documenta en Figma, esas tres no se invocan nunca** — recortarlas no ahorra nada porque ya no se usan.

---

## Defecto encontrado al medir el recorte (20 ago 2026)

### `create-component-md` no emitió el bloque `render-meta`

**Ningún `.md` generado lo tiene.** El placeholder `{{RENDER_META_JSON}}` de `references/component-md/component-md-template.md` nunca se sustituyó y el bloque entero se omitió al renderizar.

**Consecuencia:** las cuatro skills que producen previews (`create-anatomy`, `create-color`, `create-property`, `create-structure`) **abren con un fail-fast en Step 0** — el `render-meta` es su única fuente de identidad. Sin él no arrancan.

**Reparado a mano en `Componentes/button.md`** reconstruyéndolo desde `.uspec-cache/button/button-_base.json`, que es su fuente canónica. El script vive en el historial de la sesión; los campos salen de `_meta`, `component`, `variantAxes`, `propertyDefinitions.booleans` (ojo: el campo es **`rawKey`**, no `key`) y del structure cache para `sectionTargets` / `groupTargets`.

🔴 **Se volverá a perder en la siguiente corrida del orquestador.** *Hay que arreglarlo en `create-component-md` o repetir la reparación cada vez.*

### Dos cosas más que el archivo de Figma ya no cumple

| Lo que la skill espera | Lo que hay |
| --- | --- |
| Importar la plantilla por `templateKeys.anatomyOverview` | La key **no resuelve** — `Component with key … not found` |
| — | La plantilla vive **local** en el archivo: `.Anatomy`, nodo `12214:6725`, con los 16 nodos que la skill busca |

*Se usó la local. Si la librería vuelve a publicarse, la key debería volver a funcionar.*

### `create-component-md` + la plantilla — dos salidas obligatorias (20 ago 2026)

**Qué:** una directiva al inicio de `.claude/skills/create-component-md/SKILL.md` y una sección nueva en `references/component-md/component-md-template.md`.

| Salida | Por qué |
| --- | --- |
| **Bloque `render-meta`** | Sin él, las cuatro skills de preview hacen fail-fast. Ya se perdió una vez |
| **Sección `## Anatomy`** | uSpec **nunca** la produce: en su diseño la anatomía solo vivía dibujada en Figma |

**El segundo es el que faltaba de verdad.** *El conversor ya tenía la rama `## Anatomy → figma-frames` escrita y funcional — llevaba semanas sin dispararse porque la sección de entrada no existía. Una rama muerta esperando su entrada.*

🔴 **La numeración de la tabla es un contrato con el preview.** *Los marcadores del frame y las filas de la tabla son la misma lista: contenedor raíz primero, luego los hijos directos en orden. Si se desincronizan, el documento miente y nadie lo nota.*

### Los iconos de la columna Type

`<SNImage>` **sí funciona dentro de `<SNTableCell>`** — verificado contra `validateMarkdown`, que además lo dice al fallar: *"accepts text and `<SNImage>`"*. Dos condiciones:

- El contenido va **en su propia línea**, indentado. Inline no valida
- Una celda que empieza por `#` la lee Markdown como encabezado — **hay que escaparla**

Los cuatro iconos de tipo se exportaron de la plantilla `.Anatomy` y se subieron **una sola vez** con `node experimento-canario/subir-iconos-tipo.mjs`; quedan en `iconos-tipo.json` y los reusan todos los componentes. **El `.md` dice `Instance` en texto plano; el conversor lo cambia por el icono.** *Así el `.md` sigue siendo legible para un ingeniero y Supernova recibe el icono.*

#### De dónde salen los PNG de los iconos (corregido el 21 ago 2026)

**Del frame ya documentado —`Button Anatomy`, `12362:5484`— no de la plantilla maestra.**

*En la plantilla los cuatro iconos están **superpuestos** dentro de `#indicator`, uno visible por fila. Exportarlos ahí uno a uno arrastra el borde redondeado del contenedor y los descentra: `instance` salía recortado a **160×192** en vez de 192×192.* En el frame documentado cada fila tiene visible solo su icono y salen limpios y cuadrados.

**El `slot` es la excepción:** el Button no tiene ranuras, así que no hay fila que copiar. Se exportó clonando un `#indicator` dentro de una caja con el mismo fondo que las celdas y dejando visible solo `#slot`. 🔴 **La caja tiene que cubrir el indicador entero** —`#slot` no vive en el origen, está a x=12— o el PNG sale con una franja del lienzo al lado.
