# Los 36 bloques de Supernova, y cuáles convienen al `button.md`

**19 ago 2026.** El Lead preguntó si se pueden invocar desde el Markdown los widgets que Supernova ofrece en su editor, y cuáles equivalen a lo que hoy está en Figma.

**Respuesta: los 36 existen y los 36 validan desde Markdown.** *Comprobado uno por uno con `validateMarkdown`.*

---

## El catálogo completo

```
assets · blockquote · callout · code · code-react · color-accessibility-grid
component-checklist · component-checklist-all · component-health · context-mcp
design-tokens · divider · do-dont-guidelines · embed · embed-figma · embed-lottie
embed-youtube · figma-components · figma-components-propstable · figma-frames
files · image · markdown · ordered-list · release-notes · rich-text
shortcut-links · storybook · table · title1…title5 · unordered-list
token-color-ramps
```

⚠️ **Tres nombres no son los que parecen**, y por eso fallaron las primeras pruebas:

| Lo intuitivo | El real |
| --- | --- |
| `figma-component` | **`figma-components`** *(plural)* |
| `figma-component-props-table` | **`figma-components-propstable`** |
| `color-ramps` | **`token-color-ramps`** |

*Un `UnknownBlockDefinition` casi siempre es esto, no un bloque ausente.*

---

## El mapa: qué sección del `button.md` va a qué bloque

| Sección hoy | Bloque | Qué gana | Estado |
| --- | --- | --- | --- |
| **Overview** | `rich-text` | — | ✅ Ya funciona como texto |
| **Composition** | **`component-checklist`** | Las propiedades del componente **en vivo** | ✅ **Listo** |
| **Known gaps · Follow-ups** | **`callout`** | Severidad visible en vez de viñetas | ✅ **Listo** |
| **API** *(tabla de 7 columnas)* | **`figma-components-propstable`** | 🎯 **La tabla se genera del componente real** — nunca se desactualiza | ✅ **Listo** |
| **Structure / Anatomy** | **`figma-frames`** | Las muestras, en vivo desde Figma | 🔴 **Bloqueado** |
| **Sizes · Surface · Focus ring** | **`figma-frames`** | Igual | 🔴 **Bloqueado** |
| **Color** *(4 secciones)* | **`color-accessibility-grid`** | 🎯 **El contraste calculado por Supernova**, no escrito a mano | ✅ **Listo** |
| **Color** *(valores)* | `design-tokens` | Los tokens vivos, con su valor real | ✅ **Listo** |
| **Voice / Screen reader** | `SNTable` | — | ✅ Ya funciona |
| **Cross-references** | `shortcut-links` | Navegación real entre páginas | ✅ **Listo** |
| **Usage** *(a futuro)* | `do-dont-guidelines` | El patrón Do/Don't nativo | ✅ Listo |

### Los dos que más cambian el documento

**`figma-components-propstable`** — hoy la tabla de API son **7 columnas escritas a mano que ya están desactualizadas** (dicen `Type` en vez de `variant`). Este bloque **la genera del componente importado**, así que *el problema de la documentación caduca desaparece para esa sección*.

**`color-accessibility-grid`** — hoy las cuatro secciones de color listan ratios de contraste **calculados y escritos a mano**. Este bloque **los calcula Supernova**. *Es justo el trabajo que más se ha repetido en foundations.*

---

## La sintaxis real, sacada de páginas existentes

**De `Componentes / Icono`, que ya usa estos bloques:**

```jsx
<SNComponentChecklist
  component="8850c7d8-36f2-472e-827c-2d52c9fdd529"
  selectedPropertyIds={["99b630a0-…", "a0f04855-…"]}
  title="" showDescription />

<SNBlock packageId="io.supernova.block.figma-frames" variantId="bordered" columns={3}>
  <SNItem>
    <SNPropFigmaNode name="figmaNodes" value={[
      { entityId: "14531837-2e78-494c-aaa9-ad5343b80efd",
        entityMeta: {},
        resource: { resourceId: "1aa05c86-…",
                    url: "https://studio-assets.supernova.io/design-systems/825551/….png" } }
    ]} showFrameDetails previewContainerSize="Centered" />
  </SNItem>
</SNBlock>
```

**Variantes disponibles:** `figma-frames` y `figma-components` aceptan `variantId="bordered"` o `"plain"`; `do-dont-guidelines` acepta `simple`, `prominent`, `contained` y `side-border`.

**Y el ID que hace falta:** el componente Button ya existe en Supernova como **`d4f71d86-4a9b-4535-949d-0b3aadd0818f`**, con su descripción cargada.

---

## ~~El único bloqueo real: no hay frames del Button~~ — RESUELTO EL 3 SEP 2026

🔴 **Todo lo que decía esta sección es falso desde el 3 de septiembre, y se deja tachado en vez de borrado porque su diagnóstico era correcto el día que se escribió.**

*Decía: «solo hay 8 frames importados y ninguno es del Button», «el design source tiene `documentationFrames: false`», y «hasta entonces `figma-frames` no tiene nada que mostrar».*

**Lo que resultó, medido el 3 sep:**

| Lo que decía | Lo que hay |
| --- | --- |
| `documentationFrames: false` | **Estaba en `true`** |
| Activarlo trae los frames | **No.** Estaba activo y la importación había traído 12 frames — **cero del Button** |
| No hay frames del Button | **23 de 23**, renderizados y referenciables |

🟢 **La vía que funciona no es la importación, es el render explícito:** `assets.getRenderedFigmaFramesAsync` con el `figmaFileNodeId` de cada nodo. *Acepta capas **anidadas** —los `#preview` del Button lo son— y da igual cómo se llame la capa: renderizaron incluso tres `Artwork wrapper`.* **Y es lo único con cobertura declarable: se piden N y se comprueban N.** `npm run docs:frames`.

⚠️ **Y el ejemplo de sintaxis de la sección anterior también está caduco.** `<SNBlock packageId="io.supernova.block.figma-frames"><SNPropFigmaNode …>` con un objeto `resource` anidado **lo rechaza `validateMarkdown`**: `UndeclaredValueKey … no value.0.resource`. **La forma vigente es:**

```jsx
<SNFigmaImages previewSize="Centered" variant="plain" columns={1}>
  <SNFigmaFrame id="<persistentId del frame>" resourceId="<id de la imagen>" src="<url>" />
</SNFigmaImages>
```

*Los tres ids los asigna Supernova al renderizar y no se escriben a mano: salen de `frames-vivos.json`.*

---

## Lo que conviene hacer, en orden

1. **Activar `documentationFrames`** en el design source y re-importar. *Desbloquea las cuatro secciones visuales.*
2. **Regenerar `button.md` con uSpec** — el actual describe el componente viejo.
3. **Enriquecer el conversor** para que emita `component-checklist`, `figma-components-propstable` y `color-accessibility-grid` en vez de tablas planas, donde corresponda.
4. **Mover el conversor a la plantilla de uSpec**, para que el `.md` salga compatible de origen.

*El paso 3 es el que convierte la documentación de "texto que se ve bien" en "documentación conectada al sistema".*


---

# El inventario que faltaba: qué bloque acompaña a cada tipo de contenido

**Escrito el 3 sep 2026, a petición del Lead.** *Su crítica, y da en el hueco: «faltó una evaluación de qué bloques ofrece Supernova para acompañar cada contenido. Si comunicamos algo y se complementa con un recurso —una tabla, una imagen—, se incrusta el bloque que le corresponde. En algunos sí se aplica, en otros no».*

🔴 **Y es un hueco del material de partida, no un despiste al redactar: los cinco documentos de la capa editorial hablan de voz, densidad y routing, y ninguno menciona un solo bloque nativo.** *Se resolvió cómo suena la página y no cómo se apoya.*

## La tabla, por tipo de contenido

| Cuando el contenido es… | El bloque es | Cuándo NO |
| --- | --- | --- |
| Una **muestra visual** del componente | **`figma-frames`** (`<SNFigmaImages>`) | Nunca uses una imagen subida si el nodo existe en Figma: la imagen es una foto que envejece en silencio |
| Un **par correcto/incorrecto** | **`do-dont-guidelines`** (`<SNGuidelines>/<SNGuideline>`) | Si ninguna opción es errónea. Comparar dos alternativas legítimas no es un do/don't |
| **Ratios de contraste** | **`color-accessibility-grid`** | Si los colores no son tokens registrados: el bloque resuelve sobre `entityId`, no sobre hex sueltos |
| **Valores de token** | **`design-tokens`** | En variante tabla con `columns={3}` — da `TooManyColumns` |
| La **API completa** de un componente | **`figma-components-propstable`** | Si la API tiene propiedades que **no existen en Figma** (nuestro caso: `isLoading`). El bloque solo sabe de lo que Figma expone |
| Un **subconjunto** de propiedades como checklist | **`component-checklist`** | Para listar la API entera. No es su trabajo |
| El **estado de salud** | **`component-health`** | Si el componente no está registrado en Supernova |
| Un **aviso suelto** | **`callout`** (`Info` · `Warning` · `Success`) | Si es la mitad de un par do/don't: ahí es `<SNGuideline type="caution">` |
| **Navegación a otras páginas** | **`shortcut-links`** | Si la página destino está vacía. Enlazar a un hueco es peor que no enlazar |
| **Código** | **`code`** · **`code-react`** | Metiendo prosa como atributo: acepta un único bloque cercado |
| **Historial de versiones del sistema** | **`release-notes`** | 🔴 **Para un changelog de componente escrito a mano.** No acepta contenido (`properties: []`): muestra las versiones del design system |
| Una **tabla de datos** sin bloque propio | **`table`** (`<SNTable>`) | Cuando SÍ hay bloque dedicado. La tabla genérica es siempre la opción de menor valor |

⚠️ **Dos tipos de contenido de esta página NO tienen bloque nativo, y conviene decirlo en vez de forzarlos:** los **criterios de aceptación** *(`component-checklist` está atado a propiedades de un componente, no a criterios de texto libre)* y la **matriz de adopción por plataforma** *(no existe un bloque de estado de implementación)*. **Los dos se quedan en `SNTable`, a propósito.**

## Lo que la página del Button ya hace bien

**`color-accessibility-grid`** sobre los tokens vivos · **`design-tokens`** con sus valores reales · **`component-health`** y **`component-checklist`** atados al componente canónico · **`callout`** para avisos puntuales, sin abusar · los cinco pares **`do-dont-guidelines`** en su forma canónica · y **todas las tablas como `<SNTable>`**, evitando el fallo silencioso de las pipe tables, que validan y se descartan al escribir.

## Lo que queda pendiente, por valor

| | Qué | Por qué no se hizo hoy |
| --- | --- | --- |
| 🔴 | **`figma-components-propstable` en «Propiedades»** | El bloque genera la tabla desde Figma, y **`isLoading` no existe en Figma** — verificado en la extracción del 3 sep: los únicos booleanos medidos son `showIconLeft` y `showIconRight`. *Sustituir la tabla perdería la propiedad y las notas.* **Decisión del Lead: se gana una tabla que no envejece y se pierde lo que Figma no sabe** |
| 🟡 | **`shortcut-links` en las dos secciones de referencias cruzadas** | Los destinos —Link, Color, Espaciado— **están entre las 107 páginas vacías del árbol**. *Enlazar a un hueco es peor que un nombre en negrita.* **Se hace cuando `Cimientos` esté poblado** |
