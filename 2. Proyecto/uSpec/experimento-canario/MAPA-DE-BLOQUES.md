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

## 🔴 El único bloqueo real: no hay frames del Button

**Solo hay 8 frames de Figma importados en todo el design system, y ninguno es del Button.** Los que existen son de la página *Icono*.

**La causa:** el design source tiene **`documentationFrames: false`**. *Los frames de documentación no se están importando.*

> **Para desbloquear la parte visual:** activar `documentationFrames` en el design source de Figma y re-importar. **Hasta entonces, `figma-frames` no tiene nada que mostrar del Button** — y es el bloque que cubre anatomía, tamaños, surface y focus ring.

*Nota: eso también confirma que la vía es la correcta. Los frames de la página Icono llegaron por aquí, con su imagen hospedada en `studio-assets.supernova.io`. **No hay que exportar PNG a mano.***

---

## Lo que conviene hacer, en orden

1. **Activar `documentationFrames`** en el design source y re-importar. *Desbloquea las cuatro secciones visuales.*
2. **Regenerar `button.md` con uSpec** — el actual describe el componente viejo.
3. **Enriquecer el conversor** para que emita `component-checklist`, `figma-components-propstable` y `color-accessibility-grid` en vez de tablas planas, donde corresponda.
4. **Mover el conversor a la plantilla de uSpec**, para que el `.md` salga compatible de origen.

*El paso 3 es el que convierte la documentación de "texto que se ve bien" en "documentación conectada al sistema".*
