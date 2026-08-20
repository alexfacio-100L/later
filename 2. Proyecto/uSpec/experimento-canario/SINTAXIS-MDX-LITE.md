# La sintaxis MDX-lite de Supernova, descubierta a golpes

**19 ago 2026.** La especificación vive en `docs/markdown-import.md` del repositorio del SDK, **que no viene en el paquete npm ni es accesible públicamente**. Esto se dedujo ejecutando `validateMarkdown` contra el design system real hasta que pasó.

> **El método sirve para cualquier duda futura:** `validateMarkdown` no escribe nada y su error dice exactamente qué rechaza. **Es gratis preguntarle.**

---

## Lo que RECHAZA, y cómo se arregla

| Rechazo | Error literal | Solución |
| --- | --- | --- |
| **Comentarios HTML** `<!-- -->` | ``Unexpected character `!` (U+0021) before name`` | **Eliminarlos** |
| **Comentarios MDX** `{/* */}` | `Unsupported top-level content: mdxFlowExpression` | **Eliminarlos también** — no admite comentarios de ninguna clase |
| **Etiquetas HTML citadas** `<button>` | ``Expected a closing tag for `<button>` `` | Envolver en backticks: `` `<button>` `` |
| **Tablas Markdown** `\| a \| b \|` | `Pipe tables are not supported. Use <SNTable> with <SNTableRow> and <SNTableCell>` | **Convertir a `<SNTable>`** |

⚠️ **Las tablas son el rechazo que más pesa:** el `button.md` tiene **237 líneas de tabla, un 35% del documento**. *Sin conversión, no entra nada.*

---

## Lo que ACEPTA sin tocar

**Markdown estándar:** encabezados `#`–`######`, negritas, cursivas, código inline y en bloque, listas, citas `>`, separadores `---`, enlaces.

**Y sus propios componentes:**

```jsx
<SNCallout type="Info|Success">…</SNCallout>
<SNImage alignment="Left" />

<SNTable showBorder highlightHeaderRow highlightHeaderColumn={false}>
  <SNTableRow>
    <SNTableCell alignment="Left" columnWidth={250}>contenido</SNTableCell>
  </SNTableRow>
</SNTable>
```

### Bloques vivos — verificados uno a uno

| Bloque | `packageId` | |
| --- | --- | --- |
| **Frames de Figma** | `io.supernova.block.figma-frames` | ✅ **La solución para las muestras** |
| **Tokens** | `io.supernova.block.design-tokens` | ✅ *Con `columns={1}` o sin `columns`* |
| **Checklist de componente** | `io.supernova.block.component-checklist` | ✅ |
| **Callout** | *(componente directo)* | ✅ |
| **Imagen** | *(componente directo)* | ✅ |

```jsx
<SNBlock packageId="io.supernova.block.figma-frames" variantId="bordered" columns={4}>
  <SNItem>
    <SNPropFigmaNode name="figmaNodes" value={[]} showFrameDetails previewContainerSize="Centered" />
  </SNItem>
</SNBlock>
```

> 🎯 **Esto responde la parte visual sin exportar PNG.** `figma-frames` referencia **nodos de Figma en vivo**: si el componente cambia, la muestra se actualiza sola. Un PNG sería deuda desde el primer cambio.
>
> 🔴 **Pero hoy no llegarían:** el design source tiene `documentationFrames: false`. **Hay que activarlo.**

### Errores que NO significan "no existe"

*Distinguirlos importa — dos de estos me hicieron creer que un bloque no estaba disponible:*

| Error | Qué significa de verdad |
| --- | --- |
| `TooManyColumns` | **El bloque existe**, pero acepta menos columnas de las pedidas |
| `UnknownBlockDefinition` | El `packageId` está mal escrito, o ese bloque no está instalado |
| `UnknownPropertyKey` | El bloque existe; el nombre de la propiedad no |
| `<SNItem> accepts only property components` | Dentro de `<SNItem>` solo van `<SNProp*>` |
| `A Code property accepts a single fenced code block` | El código va como bloque cercado, no como atributo |

---

## Resultado del canario

**691 líneas de Markdown → 155 bloques en Supernova.** Verificado leyendo la página de vuelta:

| | |
| --- | --- |
| **26 `<SNTable>` nativas** | 211 filas · 858 celdas — **tablas reales, no texto** |
| **Encabezados** | 9 `##` + 21 `###`, jerarquía intacta |
| **Formato** | 269 negritas · 2.594 fragmentos de código · listas · citas · separadores |

**Nada se aplanó.** Supernova normalizó 3.503 líneas de entrada a 517 y las convirtió en sus propios componentes editables.

---

## ⚠️ Validar no es lo mismo que verse bien

**El primer intento pasó la validación y se veía mal.** Merece registrarse porque es fácil de repetir.

**El bug:** la regla que envuelve etiquetas HTML citadas en backticks corría **después** de generar las `<SNTable>`, así que envolvía las etiquetas recién creadas:

```
`<SNTable showBorder>` `<SNTableRow>` `<SNTableCell …>`
```

**Supernova lo aceptó** —es sintaxis válida: son fragmentos de código— **y lo renderizó como texto.** Las tablas no eran tablas.

> **La lección: `validateMarkdown` responde "¿es sintaxis válida?", NO "¿se ve bien?".** Un documento puede validar al 100% y ser ilegible. **Después de escribir hay que mirar la página, o releerla por MCP y comprobar que las etiquetas propias no quedaron escapadas.**

**Y la regla general de orden:** cuando una transformación envuelve o escapa marcado, **tiene que correr ANTES de las que generan marcado propio.** El orden correcto es:

1. **Eliminar comentarios**
2. **Envolver etiquetas HTML citadas** en backticks
3. **Convertir tablas** a `<SNTable>`

*Con una defensa extra: la regla de backticks excluye explícitamente las etiquetas `SN*`, por si el orden vuelve a cambiar.*

### El `columnWidth` fijo también estorbaba

Se calculaba como `760 / columnas`. **Con siete columnas daban 108 px cada una y la tabla parecía una hoja de cálculo.** *Se quitó: sin `columnWidth`, Supernova ajusta al contenido.*

**Resultado tras el arreglo: 127 bloques en vez de 155** — menos bloques porque las tablas dejaron de fragmentarse en párrafos de código.

---

## Cómo se pasan valores a los bloques vivos

**Descubierto construyendo la página con widgets, a base de rechazos del validador.**

### Los tokens y componentes van como OBJETOS, no como strings

```jsx
❌ <SNPropToken name="tokens" value={["1bac692a-…"]} />
   → "Value does not match the Token schema — value.0: Expected object, received string"

❌ <SNPropToken name="tokens" value={[{ entityId: "1bac692a-…" }]} />
   → "value.0.entityType: Required"

✅ <SNPropToken name="tokens" value={[{ entityId: "1bac692a-…", entityType: "Token" }]} />
```

*Mismo patrón que `SNPropFigmaNode`, que además lleva `resource`.*

### El `component-checklist` tiene forma corta

```jsx
<SNComponentChecklist
  component="d4f71d86-4a9b-4535-949d-0b3aadd0818f"
  selectedPropertyIds={["a0f04855-…", "99b630a0-…"]}
  title="Estado del componente" showDescription />
```

*Aquí sí es string, porque es un componente abreviado, no un `<SNBlock>` genérico.*

### Propiedades que NO existen

| Bloque | No declara |
| --- | --- |
| `do-dont-guidelines` | `title` · `text` |
| `shortcut-links` | `title` |
| *(cualquiera)* | **`SNPropUrl` no existe como tipo** |

**Los bloques sí existen** — validan con `<SNItem />` vacío. *Lo que falta es saber sus nombres de propiedad reales, y se descubren igual: probando.*

### Límites de columnas

**`design-tokens` en variante tabla admite 1 columna.** Con `columns={3}` responde `TooManyColumns: Variant table allows 1 column(s), page carries 3`.

> **Regla general que sirve para todos: el validador nombra el bloque, la propiedad y el problema exacto.** Construir contra él es más rápido que buscar en la documentación, **y es la única fuente que no envejece.**

### Los IDs que hacen falta, y de dónde salen

| Qué | De dónde |
| --- | --- |
| **Componente** | `sn_get_component_list` — el Button es `d4f71d86-4a9b-4535-949d-0b3aadd0818f` |
| **Propiedades de componente** | `sn_get_component_property_list` — `status`, `isDocumented`, `figmaComponent`… |
| **Tokens** | `sdk.tokens.getTokens(from)` o `sn_get_token_list` |
| **Frames de Figma** | `sdk.resources.getFigmaFrames(from)` → usa su `persistentId` como `entityId` |
