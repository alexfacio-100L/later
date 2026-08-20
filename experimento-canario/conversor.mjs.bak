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

/** Ancho útil de una página de documentación de Supernova, en px. */
const ANCHO_PAGINA = 760
/** Por debajo de esto una columna deja de ser legible. */
const ANCHO_MINIMO = 72

/**
 * Reparte el ancho **en proporción al contenido**, no a partes iguales.
 *
 * Sin esto las tablas se ven rotas: una columna de `true`/`false` recibe lo
 * mismo que una de notas de 100 caracteres, así que la primera desperdicia
 * espacio y la segunda se estrangula.
 *
 * La proporción se amortigua con una potencia < 1 para que una columna muy
 * larga no aplaste a las demás, y luego se garantiza un mínimo legible.
 */
function anchosDeColumna(filas, columnas) {
  const medias = []
  for (let c = 0; c < columnas; c++) {
    const largos = filas.map(f => (f[c] ?? "").length)
    medias.push(Math.max(largos.reduce((a, b) => a + b, 0) / (largos.length || 1), 3))
  }
  // Amortiguar: sin esto, una nota larga se lleva casi todo el ancho.
  const pesos = medias.map(m => Math.pow(m, 0.55))
  const total = pesos.reduce((a, b) => a + b, 0)
  let anchos = pesos.map(p => (p / total) * ANCHO_PAGINA)

  // Garantizar el mínimo, quitando el excedente a las más anchas.
  const deficit = anchos.reduce((acc, a) => acc + Math.max(0, ANCHO_MINIMO - a), 0)
  if (deficit > 0) {
    const holgadas = anchos.map(a => Math.max(0, a - ANCHO_MINIMO))
    const disponible = holgadas.reduce((a, b) => a + b, 0)
    anchos = anchos.map((a, i) =>
      a < ANCHO_MINIMO ? ANCHO_MINIMO
        : a - (disponible ? (holgadas[i] / disponible) * deficit : 0))
  }
  return anchos.map(a => Math.round(a * 100) / 100)
}

/**
 * Marca las filas que dependen de otra propiedad.
 *
 * En Figma esto se dibuja con la capa `#hierarchy-indicator` —una flecha que
 * solo se muestra en las filas anidadas—. En el `.md` la dependencia viaja en
 * prosa: *"Solo tiene sentido cuando `showIconLeft` = `true`"*.
 *
 * Se detecta ese patrón y se prefija la fila con `↳`, la misma convención que
 * el archivo de Figma usa para las páginas anidadas.
 */
function marcarJerarquia(filas) {
  const DEPENDE = /solo tiene sentido cuando\s+`([^`]+)`/i
  return filas.map((fila, i) => {
    if (i === 0) return fila                       // cabecera
    const dependeDe = fila.slice(1).join(" ").match(DEPENDE)
    if (!dependeDe) return fila
    const copia = [...fila]
    copia[0] = `↳ ${copia[0]}`
    return copia
  })
}

/**
 * MDX lee `{` como inicio de expresión, así que un texto como `semantics { }`
 * —sintaxis de Compose en las notas de accesibilidad— rompe la validación con
 * "accepts text and <SNImage>, not mdxTextExpression".
 *
 * Se envuelven en código las llaves que viajan como texto, respetando lo que ya
 * está entre backticks.
 */
const llavesLiterales = t =>
  t.split("`").map((trozo, i) =>
    i % 2 === 1 ? trozo : trozo.replace(/\{\s*\}/g, "`{ }`").replace(/(?<![`\w])\{(?![{\s]*[}])/g, "`{`")
  ).join("`")

/** Las pipe tables no se soportan: se emiten como <SNTable>. */
function tablaSN(filas) {
  // La primera fila es la cabecera: se localiza.
  if (filas.length) filas = [filas[0].map(traducirCabecera), ...filas.slice(1)]
  filas = marcarJerarquia(filas)
  const columnas = Math.max(...filas.map(f => f.length))
  const anchos = anchosDeColumna(filas, columnas)
  const out = ["<SNTable showBorder highlightHeaderRow highlightHeaderColumn={false}>"]
  for (const fila of filas) {
    out.push("  <SNTableRow>")
    for (let c = 0; c < columnas; c++) {
      out.push(`    <SNTableCell alignment="Left" columnWidth={${anchos[c]}}>`)
      out.push(`      ${llavesLiterales((fila[c] ?? "").replace(/<br\s*\/?>/gi, " "))}`)
      out.push("    </SNTableCell>")
    }
    out.push("  </SNTableRow>")
  }
  out.push("</SNTable>", "")
  return out
}


// ─────────────────────────────────────────────────────────────
// Localización
// ─────────────────────────────────────────────────────────────

/**
 * El `.md` de uSpec lleva los encabezados en inglés **a propósito**: las skills
 * los localizan por su texto literal. Ese contrato se conserva — traducir el
 * `.md` rompería tanto uSpec como el reconocimiento de secciones de este mismo
 * conversor.
 *
 * **La traducción ocurre aquí, al emitir**, que es la capa de presentación.
 * El documento técnico queda en inglés; lo que lee el equipo, en español.
 *
 * NO se traducen identificadores: nombres de token, propiedades (`isLoading`,
 * `size`) ni valores (`primary`, `marketing`). Deben coincidir con el código.
 */
const SECCIONES_ES = {
  "Overview": "Resumen",
  "Composition": "Composición",
  "Known gaps": "Defectos conocidos",
  "Unresolved": "Sin resolver",
  "Follow-ups": "Siguientes pasos",
  "Icon": "Icono",
  "Referenced components": "Componentes referenciados",
  "Structure": "Estructura",
  "Anatomy": "Anatomía",
  "Button sizes": "Tamaños",
  "Button surface shape": "Forma según la superficie",
  "Button focus ring": "Anillo de foco",
  "Voice / Screen reader": "Lector de pantalla",
  "State: enabled": "Estado: activo",
  "State: focused": "Estado: con foco",
  "State: isDisabled === true": "Estado: deshabilitado",
  "State: isLoading === true": "Estado: cargando",
  "Cross-references": "Referencias cruzadas",
  "Type deltas — diferencias por tipo": "Diferencias por tipo",
}

/** Cabeceras de tabla. Solo se traduce la PRIMERA fila. */
const CABECERAS_ES = {
  "Property": "Propiedad", "Properties": "Propiedades",
  "Value": "Valor", "Values": "Valores",
  "Notes": "Notas", "Note": "Nota",
  "Element": "Elemento", "Elements": "Elementos",
  "Type": "Tipo", "Default": "Por defecto",
  "Description": "Descripción", "Name": "Nombre",
  "State": "Estado", "States": "Estados",
  "Token": "Token", "Layer": "Capa", "Size": "Tamaño",
  "Role": "Rol", "Required": "Obligatorio", "Optional": "Opcional",
  "Spec": "Especificación", "Specs": "Especificaciones",
}

/** Cabeceras con parte variable, que un diccionario plano no cubre. */
const CABECERAS_PATRON = [
  [/^Prop passed to (.+)$/i, (m) => `Prop que recibe ${m[1]}`],
  [/^Applied to (.+)$/i,     (m) => `Aplicado a ${m[1]}`],
]

const traducirSeccion = t => SECCIONES_ES[t.trim()] ?? t
const traducirCabecera = c => {
  const limpio = c.replace(/\*\*/g, "").trim()
  const es = CABECERAS_ES[limpio]
  if (es) return c.replace(limpio, es)
  for (const [re, fn] of CABECERAS_PATRON) {
    const m = limpio.match(re)
    if (m) return c.replace(limpio, fn(m))
  }
  return c
}

const callout = (tipo, cuerpo) =>
  [`<SNCallout type="${tipo}">`, ...cuerpo.split("\n").map(l => `  ${l}`), "</SNCallout>", ""]

/**
 * Si hay un preview registrado para esta sección, lo emite como imagen.
 * La clave del registro es el título literal del encabezado en el `.md`.
 */
const imagenDeSeccion = (titulo, frames, informe) => {
  const f = frames[titulo]
  if (!f) return []
  informe.vivas.push(`${titulo} → preview`)
  return [`<SNImage alignment="Left" src="${f.url}" />`, ""]
}

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
export function convertir(md, tokens = {}, frames = {}) {
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
        salida.push(`${enc[1]} ${traducirSeccion(titulo)}`, "")
        salida.push(`<SNComponentChecklist component="${CONFIG.componenteId}" selectedPropertyIds={${JSON.stringify(CONFIG.propiedadesChecklist)}} title="Propiedades del componente" showDescription />`, "")
        salida.push(...callout("Info",
          "El estado del componente sale del sistema, no de este documento. **La tabla de propiedades de abajo sigue viniendo del `.md`** — cuando `figma-components-propstable` acepte el componente, esa tabla también dejará de caducar."))
        informe.callouts++
        // La tabla de propiedades SE CONSERVA: el checklist muestra metadatos
        // del componente (estado, documentado), no las propiedades y sus notas.
        // Sustituirla perdía lo más valioso del documento.
        i++
        continue
      }

      // ── Color → rejilla de accesibilidad ──
      if (CONFIG.vivas.color.test(titulo) && nivel === 2) {
        const fin = finDeSeccion(i, nivel)
        const ids = tokensDe(i, fin)
        informe.vivas.push(`Color → color-accessibility-grid (${ids.length} tokens)`)
        salida.push(`${enc[1]} ${traducirSeccion(titulo)}`, "")
        if (ids.length) {
          salida.push(`<SNBlock packageId="io.supernova.block.color-accessibility-grid" columns={1}>`,
                      "  <SNItem>",
                      `    <SNPropToken name="tokens" value={${tokensProp(ids)}} />`,
                      "  </SNItem>", "</SNBlock>", "")
          salida.push(...callout("Success",
            `**Supernova calcula estos contrastes.** Los ${ids.length} tokens salen del sistema; la tabla escrita a mano que había aquí caducaba con cada cambio.`))
          informe.callouts++
        }
        // Los previews de las subsecciones de color, si están registrados
        for (let j = i; j < fin; j++) {
          const sub = lineas[j].match(/^#{3} (.+)$/)
          if (!sub) continue
          const img = imagenDeSeccion(sub[1].trim(), frames, informe)
          if (img.length) {
            salida.push(`### ${traducirSeccion(sub[1].trim())}`, "")
            salida.push(...img)
          }
        }
        i = fin
        continue
      }

      // ── Anatomía → frames de Figma ──
      if (CONFIG.vivas.anatomia.test(titulo)) {
        informe.vivas.push("Anatomy → figma-frames")
        salida.push(`${enc[1]} ${traducirSeccion(titulo)}`, "")
        const frame = frames["Anatomy"]
        if (frame) {
          salida.push(`<SNImage alignment="Left" src="${frame.url}" />`, "")
          salida.push(...callout("Info",
            `Exportado de Figma —\`${frame.nombre}\`, nodo \`${frame.nodo}\`— y subido como recurso. **Es una imagen: si el frame cambia en Figma, hay que volver a exportarlo.**`))
          informe.vivas.push(`Anatomy → imagen de ${frame.nombre}`)
        } else {
          salida.push(`<SNBlock packageId="io.supernova.block.figma-frames" variantId="bordered" columns={2}>`,
                      "  <SNItem>",
                      `    <SNPropFigmaNode name="figmaNodes" value={[]} showFrameDetails previewContainerSize="Centered" />`,
                      "  </SNItem>", "</SNBlock>", "")
          salida.push(...callout("Warning", "**Pendiente de poblar.** Ningún frame exportado para esta sección."))
        }
        informe.callouts++
        i = finDeSeccion(i, enc[1].length)
        continue
      }

      salida.push(`${enc[1]} ${traducirSeccion(titulo)}`)
      salida.push(...imagenDeSeccion(titulo, frames, informe))
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
