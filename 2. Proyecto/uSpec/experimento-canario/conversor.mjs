/**
 * Conversor de un `.md` de uSpec a MDX-lite de Supernova, con bloques vivos.
 *
 * No es un traductor de sintaxis: **reconoce qué sección está convirtiendo** y
 * elige el bloque que corresponde. Una tabla de contraste escrita a mano se
 * sustituye por el bloque que lo calcula; una tabla de API, por la que se genera
 * del componente. Lo que queda estático solo es lo que no tiene equivalente vivo.
 *
 * Las reglas de sintaxis salieron de `validateMarkdown`. Ver SINTAXIS-MDX-LITE.md.
 */

// ─────────────────────────────────────────────────────────────
// Configuración del componente que se documenta
// ─────────────────────────────────────────────────────────────

export const CONFIG = {
  componenteId: "d4f71d86-4a9b-4535-949d-0b3aadd0818f",
  propiedadesChecklist: [
    "a0f04855-5c1e-4cd1-87d3-475a12f3c4a9", // Status
    "99b630a0-b8b6-4908-b508-94204759319e", // Documented
    "d777f8b3-380a-4470-a508-ba7473d8edd0", // Figma component
  ],

  /** Secciones que son metadato del proceso de generación, no documentación.
   *  `Provenance` sola son 186 líneas — el 27% del documento. */
  omitir: [/^Provenance$/i, /^Auto-reconciled$/i],

  /** Secciones cuyo contenido se sustituye por un bloque vivo. */
  vivas: {
    api: /^API$/i,
    color: /^Color$/i,
    anatomia: /^Anatomy$/i,
  },
}

// ─────────────────────────────────────────────────────────────
// Utilidades de sintaxis — el mínimo que Supernova exige
// ─────────────────────────────────────────────────────────────

/** Supernova no admite comentarios de ninguna clase: ni HTML ni MDX. */
const sinComentarios = t => t.replace(/<!--[\s\S]*?-->/g, "")

/** MDX lee `<button>` como componente JSX. Se cita como código.
 *  Se excluyen las etiquetas SN*, que son nuestras. */
const etiquetasCitadas = t =>
  t.split("\n").map(linea =>
    linea.split("`").map((trozo, i) =>
      i % 2 === 1 ? trozo
        : trozo.replace(/<(\/?(?!SN)[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*?)?)\/?>/g, "`<$1>`")
    ).join("`")
  ).join("\n")

const esFila       = l => /^\s*\|.*\|\s*$/.test(l)
const esSeparador  = l => /^\s*\|[\s:|-]+\|\s*$/.test(l)
const celdasDe     = l => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim())

/** Las pipe tables no se soportan: se emiten como <SNTable>. */
function tablaSN(filas) {
  const columnas = Math.max(...filas.map(f => f.length))
  const out = ["<SNTable showBorder highlightHeaderRow highlightHeaderColumn={false}>"]
  for (const fila of filas) {
    out.push("  <SNTableRow>")
    for (let c = 0; c < columnas; c++) {
      out.push(`    <SNTableCell alignment="Left">`)
      out.push(`      ${(fila[c] ?? "").replace(/<br\s*\/?>/gi, " ")}`)
      out.push("    </SNTableCell>")
    }
    out.push("  </SNTableRow>")
  }
  out.push("</SNTable>", "")
  return out
}

const callout = (tipo, cuerpo) =>
  [`<SNCallout type="${tipo}">`, ...cuerpo.split("\n").map(l => `  ${l}`), "</SNCallout>", ""]

const tokensProp = ids =>
  "[" + ids.map(i => `{ entityId: "${i}", entityType: "Token" }`).join(", ") + "]"

// ─────────────────────────────────────────────────────────────
// El conversor
// ─────────────────────────────────────────────────────────────

/**
 * @param {string} md      el .md producido por uSpec
 * @param {object} tokens  mapa nombre → id, de `mapa-tokens.mjs`
 * @returns {{mdx: string, informe: object}}
 */
export function convertir(md, tokens = {}) {
  const informe = { omitidas: [], vivas: [], tablas: 0, callouts: 0, tokensNoResueltos: new Set() }

  let texto = etiquetasCitadas(sinComentarios(md))
  const lineas = texto.split("\n")
  const salida = []

  let seccion = { h2: null, h3: null }
  let omitiendo = false
  let i = 0

  /** Nombres de token citados en un tramo, resueltos contra el mapa. */
  const tokensDe = (desde, hasta) => {
    const trozo = lineas.slice(desde, hasta).join("\n")
    const nombres = [...new Set(
      (trozo.match(/`?\b(background|text|icon|border|shadowTint|overlay)\/[a-zA-Z0-9]+`?/g) ?? [])
        .map(s => s.replace(/`/g, ""))
    )]
    const ids = []
    for (const n of nombres) {
      if (tokens[n]) ids.push(tokens[n])
      else informe.tokensNoResueltos.add(n)
    }
    return ids
  }

  /** Dónde acaba la sección que empieza en `desde`. */
  const finDeSeccion = (desde, nivel) => {
    for (let j = desde + 1; j < lineas.length; j++) {
      const m = lineas[j].match(/^(#{1,6}) /)
      if (m && m[1].length <= nivel) return j
    }
    return lineas.length
  }

  while (i < lineas.length) {
    const linea = lineas[i]
    const enc = linea.match(/^(#{1,6}) (.+)$/)

    if (enc) {
      const nivel = enc[1].length
      const titulo = enc[2].trim()

      if (nivel <= 2) { seccion.h2 = titulo; seccion.h3 = null; omitiendo = false }
      if (nivel === 3) seccion.h3 = titulo

      // ── Secciones de metadato: se saltan enteras ──
      if (CONFIG.omitir.some(re => re.test(titulo))) {
        informe.omitidas.push(titulo)
        i = finDeSeccion(i, nivel)
        continue
      }

      // ── API → tabla generada del componente ──
      if (CONFIG.vivas.api.test(titulo) && nivel === 2) {
        informe.vivas.push("API → component-checklist")
        salida.push(linea, "")
        salida.push(`<SNComponentChecklist component="${CONFIG.componenteId}" selectedPropertyIds={${JSON.stringify(CONFIG.propiedadesChecklist)}} title="Propiedades del componente" showDescription />`, "")
        salida.push(...callout("Info",
          "Las propiedades salen del componente importado, no de este documento. **Si cambian en Figma, cambian aquí.**"))
        informe.callouts++
        // Se salta solo la tabla principal; los ejemplos en h3 se conservan
        let j = i + 1
        while (j < lineas.length && !/^#{3} /.test(lineas[j])) j++
        i = j
        continue
      }

      // ── Color → rejilla de accesibilidad ──
      if (CONFIG.vivas.color.test(titulo) && nivel === 2) {
        const fin = finDeSeccion(i, nivel)
        const ids = tokensDe(i, fin)
        informe.vivas.push(`Color → color-accessibility-grid (${ids.length} tokens)`)
        salida.push(linea, "")
        if (ids.length) {
          salida.push(`<SNBlock packageId="io.supernova.block.color-accessibility-grid" columns={1}>`,
                      "  <SNItem>",
                      `    <SNPropToken name="tokens" value={${tokensProp(ids)}} />`,
                      "  </SNItem>", "</SNBlock>", "")
          salida.push(...callout("Success",
            `**Supernova calcula estos contrastes.** Los ${ids.length} tokens salen del sistema; la tabla escrita a mano que había aquí caducaba con cada cambio.`))
          informe.callouts++
        }
        i = fin
        continue
      }

      // ── Anatomía → frames de Figma ──
      if (CONFIG.vivas.anatomia.test(titulo)) {
        informe.vivas.push("Anatomy → figma-frames")
        salida.push(linea, "")
        salida.push(`<SNBlock packageId="io.supernova.block.figma-frames" variantId="bordered" columns={2}>`,
                    "  <SNItem>",
                    `    <SNPropFigmaNode name="figmaNodes" value={[]} showFrameDetails previewContainerSize="Centered" />`,
                    "  </SNItem>", "</SNBlock>", "")
        salida.push(...callout("Warning",
          "**Pendiente de poblar.** Los frames existen en Figma (`Button Anatomy`) pero aún no están importados como recursos. Requiere un re-import ahora que `documentationFrames` está activo."))
        informe.callouts++
        i = finDeSeccion(i, enc[1].length)
        continue
      }

      salida.push(linea)
      i++
      continue
    }

    // ── Defectos abiertos → callouts por severidad ──
    if (/^Known gaps$/i.test(seccion.h2) && /^- \*\*(Alta|Media|Baja)\*\*/.test(linea)) {
      const sev = linea.match(/^- \*\*(Alta|Media|Baja)\*\*/)[1]
      const tipo = sev === "Alta" ? "Error" : sev === "Media" ? "Warning" : "Info"
      const cuerpo = linea.replace(/^- \*\*(Alta|Media|Baja)\*\*\s*(🔴\s*)?—?\s*/, "")
      salida.push(...callout(tipo, cuerpo))
      informe.callouts++
      i++
      continue
    }

    // ── Tablas ──
    if (esFila(linea)) {
      const bloque = []
      while (i < lineas.length && esFila(lineas[i])) bloque.push(lineas[i++])
      if (bloque.some(esSeparador)) {
        salida.push(...tablaSN(bloque.filter(l => !esSeparador(l)).map(celdasDe)))
        informe.tablas++
      } else salida.push(...bloque)
      continue
    }

    salida.push(linea)
    i++
  }

  informe.tokensNoResueltos = [...informe.tokensNoResueltos]
  return { mdx: salida.join("\n"), informe }
}
