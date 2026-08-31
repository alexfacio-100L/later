#!/usr/bin/env node
/**
 * Completa lo que `create-component-md` pierde al escribir el `.md`.
 *
 *   node completar-md.mjs Componentes/button.md              → verifica e informa
 *   node completar-md.mjs Componentes/button.md --escribir    → repara
 *
 * ── Por qué existe ──────────────────────────────────────────────────────────
 * El 21 ago 2026 aparecieron TRES defectos del mismo tipo en el mismo `.md`:
 * el bloque `render-meta` omitido, la sección `## Anatomy` inexistente, y la
 * columna `Spec` y las `Notes` de Structure vaciadas. Los tres se repararon a
 * mano desde `.uspec-cache/`, que los conservaba íntegros.
 *
 * El patrón se repite: **el cache está bien y el `.md` pierde información al
 * escribirse.** Dejarlo en una directiva de la skill no basta — es prosa que un
 * agente puede saltarse. Esto lo hace determinista.
 *
 * 🔴 Sin `render-meta` las cuatro skills de preview hacen fail-fast: es su única
 * fuente de identidad. Ese es el defecto caro.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { createHash } from "node:crypto"
import { basename, dirname, join } from "node:path"

const ANSI = { ok: "\x1b[32m", mal: "\x1b[31m", tenue: "\x1b[2m", fin: "\x1b[0m" }
const c = (col, t) => `${ANSI[col]}${t}${ANSI.fin}`

// ── Entrada ─────────────────────────────────────────────────────────────────
const ruta = process.argv[2]
const escribir = process.argv.includes("--escribir")
if (!ruta) {
  console.error("Uso: node completar-md.mjs <ruta.md> [--escribir]")
  process.exit(1)
}
if (!existsSync(ruta)) {
  console.error(`No existe: ${ruta}`)
  process.exit(1)
}

const slug = basename(ruta).replace(/\.md$/, "")
const cacheDir = join("./.uspec-cache", slug)
const rutaBase = join(cacheDir, `${slug}-_base.json`)
if (!existsSync(rutaBase)) {
  console.error(`No hay cache para "${slug}": falta ${rutaBase}`)
  console.error(`Sin el cache no se puede reparar nada — corre el plugin uSpec Extract.`)
  process.exit(1)
}

let md = readFileSync(ruta, "utf-8")
const base = JSON.parse(readFileSync(rutaBase, "utf-8"))
const rutaStructure = join(cacheDir, `${slug}-structure.json`)
const structure = existsSync(rutaStructure)
  ? JSON.parse(readFileSync(rutaStructure, "utf-8"))
  : null

const hallazgos = []
const reparados = []

// ── 1 · El bloque render-meta ───────────────────────────────────────────────
// Sin esto, create-anatomy / color / property / structure hacen fail-fast.
function construirRenderMeta() {
  const meta = base._meta ?? {}
  const pd = base.propertyDefinitions ?? {}
  const axes = base.variantAxes ?? []

  const variantAxes = {}
  const variantAxesDefaults = {}
  for (const a of axes) {
    variantAxes[a.name] = a.options ?? []
    variantAxesDefaults[a.name] = a.defaultValue
  }

  // 🔴 El campo es `rawKey`, NO `key`. Confundirlos deja los booleanos en null
  // y las skills no pueden llamar a setProperties.
  const booleans = pd.booleans ?? []
  const booleanDefs = booleans.map(b => ({
    key: b.rawKey,
    default: b.defaultValue,
    associatedLayerName: b.associatedLayerName,
    associatedLayerId: b.associatedLayerId,
  }))

  const propertyDefs = structuredClone(pd.rawDefs ?? {})
  const porClave = new Map(booleans.map(b => [b.rawKey, b.associatedLayerId]))
  for (const [k, v] of Object.entries(propertyDefs)) {
    if (v?.type === "BOOLEAN" && porClave.has(k)) v.associatedLayerId = porClave.get(k)
  }

  const slotContents = (pd.slots ?? []).map(s => ({
    slotName: s.slotName ?? s.name,
    slotNodeType: s.slotNodeType,
    preferredComponents: s.preferredComponents ?? [],
  }))

  const walks = base.subComponentVariantWalks ?? {}
  const subComponents = ((base._childComposition?.children) ?? [])
    .filter(ch => ch.classification === "constitutive" && ch.subCompSetId)
    .map(ch => ({
      name: ch.name,
      mainComponentName: ch.mainComponentName,
      subCompSetId: ch.subCompSetId,
      subCompVariantAxes: ch.subCompVariantAxes ?? {},
      subCompVariantAxesDefaults: walks[ch.subCompSetId]?.variants?.[0]?.variantProperties ?? {},
      booleanOverrides: ch.booleanOverrides ?? {},
    }))

  const sectionTargets = {}
  const groupTargets = {}
  for (const sec of (structure?.data ?? structure)?.sections ?? []) {
    if (!sec.sectionName) continue
    sectionTargets[sec.sectionName] = {
      name: sec._anchor?.layerName ?? null,
      nodeId: sec._anchor?.layerId ?? null,
    }
    const g = {}
    for (const r of sec.rows ?? []) {
      if (r.isSubProperty !== true && r._layerId) {
        g[r.spec] = { name: r._layerName, nodeId: r._layerId }
      }
    }
    groupTargets[sec.sectionName] = g
  }

  const sourceHash =
    "sha256:" + createHash("sha256").update(JSON.stringify(base)).digest("hex")

  return {
    schemaVersion: "1.0",
    extractedAt: meta.extractedAt,
    sourceHash,
    fileKey: meta.fileKey,
    nodeId: meta.nodeId,
    component: base.component,
    variantAxes,
    variantAxesDefaults,
    propertyDefs,
    booleanDefs,
    subComponents,
    slotContents,
    sectionTargets,
    groupTargets,
  }
}

const TIENE_RENDER_META = /<!-- render-meta:start v=1 -->/.test(md)
let renderMetaValido = false
if (TIENE_RENDER_META) {
  const m = md.match(/<!-- render-meta:start v=1 -->[\s\S]*?```json\n([\s\S]*?)\n```[\s\S]*?<!-- render-meta:end -->/)
  try {
    const d = JSON.parse(m[1])
    renderMetaValido = Boolean(d?.component?.compSetNodeId)
    if (!renderMetaValido) hallazgos.push("el `render-meta` existe pero no trae `component.compSetNodeId`")
    const sinClave = (d.booleanDefs ?? []).filter(b => !b.key).length
    if (sinClave) hallazgos.push(`el \`render-meta\` tiene ${sinClave} booleano(s) con \`key\` nula — se leyó \`key\` en vez de \`rawKey\``)
    // El esquema exige `associatedLayerId` en las entradas BOOLEAN de propertyDefs.
    // La reparación a mano del 21 ago lo puso en booleanDefs pero se lo dejó aquí.
    const boolSinCapa = Object.entries(d.propertyDefs ?? {})
      .filter(([, v]) => v?.type === "BOOLEAN" && !v.associatedLayerId).length
    if (boolSinCapa) hallazgos.push(`${boolSinCapa} entrada(s) BOOLEAN de \`propertyDefs\` sin \`associatedLayerId\``)
  } catch {
    hallazgos.push("el `render-meta` existe pero no parsea como JSON")
  }
} else {
  hallazgos.push("**falta el bloque `render-meta`** — las cuatro skills de preview harán fail-fast")
}

const REGENERAR_RM = !TIENE_RENDER_META || !renderMetaValido ||
  hallazgos.some(h => h.includes("rawKey") || h.includes("associatedLayerId"))
if (escribir && REGENERAR_RM) {
  const bloque = [
    "<!-- render-meta:start v=1 -->",
    "<!-- Machine-readable appendix consumed by downstream `create-*` skills.",
    "     Carries node IDs so renderers can resolve sections/groups → live Figma layers",
    "     without re-extracting. Schema: see references/component-md/agent-component-md-instruction.md > ## RENDER_META_JSON.",
    "     Do NOT hand-edit; regenerated by completar-md.mjs. -->",
    "```json",
    JSON.stringify(construirRenderMeta(), null, 2),
    "```",
    "<!-- render-meta:end -->",
  ].join("\n")
  md = TIENE_RENDER_META
    ? md.replace(/<!-- render-meta:start v=1 -->[\s\S]*?<!-- render-meta:end -->/, bloque)
    : md.trimEnd() + "\n\n" + bloque + "\n"
  reparados.push("bloque `render-meta` regenerado desde el cache")
}

// ── 2 · La sección ## Anatomy ───────────────────────────────────────────────
// uSpec NUNCA la produce: en su diseño la anatomía solo vivía dibujada en Figma.
// Sin ella, los marcadores numerados del `#preview` no explican nada.
function construirAnatomy() {
  const dv = base.defaultVariant?.name
  const variante = base.variants?.find(v => v.name === dv) ?? base.variants?.[0]
  if (!variante?.treeHierarchical) return null

  // Mismo criterio que create-anatomy: se baja por los envoltorios de un solo
  // hijo hasta el contenedor real. Si no coincide, la numeración del `.md` y la
  // del preview se desincronizan y el documento miente.
  let cont = variante.treeHierarchical
  while ((cont.children ?? []).length === 1 && cont.children[0].type === "FRAME") {
    cont = cont.children[0]
  }

  const porBoolean = new Map(
    (base.propertyDefinitions?.booleans ?? []).map(b => [b.associatedLayerName, b.name])
  )
  const setPorNombre = new Map(
    ((base._childComposition?.children) ?? [])
      .filter(ch => ch.parentSetName)
      .map(ch => [ch.name, ch.parentSetName])
  )
  // iconRight suele no figurar en _childComposition aunque comparta main con iconLeft
  const setPorMain = new Map(
    ((base._childComposition?.children) ?? [])
      .filter(ch => ch.parentSetName && ch.mainComponentName)
      .map(ch => [ch.mainComponentName, ch.parentSetName])
  )

  const TIPO = { INSTANCE: "Instance", TEXT: "Text", SLOT: "Slot", FRAME: "Frame", GROUP: "Frame" }

  // create-anatomy desenvuelve dos casos, y hay que replicarlos o el tipo de la
  // tabla no coincide con el que rotula el preview:
  //   FRAME con un único hijo TEXT      → cuenta como Text
  //   FRAME con un único hijo INSTANCE  → cuenta como Instance
  const desenvolver = ch => {
    const hijos = ch.children ?? []
    if ((ch.type === "FRAME" || ch.type === "GROUP") && hijos.length === 1) {
      const h = hijos[0]
      if (h.type === "TEXT") return { ...ch, type: "TEXT", _envuelto: true }
      if (h.type === "INSTANCE") return { ...ch, type: "INSTANCE", mainComponentName: h.mainComponentName, _envuelto: true }
    }
    return ch
  }

  const filas = []

  const raiz = base.component?.componentName ?? "Container"
  filas.push({
    tipo: "Frame",
    nombre: raiz,
    nota: "Contenedor raíz. Fija el fondo, el radio, la sombra y el espaciado interno.",
  })

  for (const bruto of cont.children ?? []) {
    const ch = desenvolver(bruto)
    const tipo = TIPO[ch.type] ?? "Frame"
    const bool = porBoolean.get(ch.name)
    const set = setPorNombre.get(ch.name) ?? setPorMain.get(ch.mainComponentName)
    const partes = []
    if (tipo === "Instance") partes.push(set ? `Instancia de \`${set}\`.` : "Instancia de un componente referenciado.")
    else if (tipo === "Text") partes.push("Elemento de texto.")
    else if (tipo === "Slot") partes.push("Ranura componible.")
    else partes.push("Contenedor de layout.")
    if (ch.visible === false) {
      partes.push(bool ? `Oculto por defecto; lo revela \`${bool}\`.` : "Oculto por defecto.")
    }
    filas.push({ tipo, nombre: ch.name, nota: partes.join(" ") })
  }
  return filas
}

const TIENE_ANATOMY = /^## Anatomy$/m.test(md)
if (!TIENE_ANATOMY) {
  hallazgos.push("**falta la sección `## Anatomy`** — uSpec nunca la produce, y sin ella los marcadores del preview no explican nada")
}
if (escribir && !TIENE_ANATOMY) {
  const filas = construirAnatomy()
  if (!filas) {
    hallazgos.push("no se pudo construir `## Anatomy`: el cache no trae `treeHierarchical`")
  } else {
    const cuerpo = [
      "## Anatomy",
      "",
      "Los elementos que componen el componente, en el orden en que los numera el preview. **La numeración es un contrato: los marcadores del frame y las filas de esta tabla son la misma lista.**",
      "",
      "| # | Type | Element | Notes |",
      "| --- | --- | --- | --- |",
      ...filas.map((f, i) => `| ${i + 1} | ${f.tipo} | ${f.nombre} | ${f.nota} |`),
      "",
      "<!-- Generado por completar-md.mjs desde el cache. Las notas son mecánicas:",
      "     merece la pena reescribirlas con el porqué de cada elemento. -->",
      "",
    ].join("\n")
    // va antes de Known gaps si existe, y si no antes de la primera sección tras Overview
    const ancla = /^## Known gaps$/m.test(md) ? "## Known gaps" : md.match(/^## (?!Overview)(.+)$/m)?.[0]
    md = ancla ? md.replace(ancla, cuerpo + ancla) : md.trimEnd() + "\n\n" + cuerpo
    reparados.push(`sección \`## Anatomy\` generada con ${filas.length} filas`)
  }
}

// ── 3 · Las tablas de Structure ─────────────────────────────────────────────
// El cache conserva `spec`, `notes`, `provenance` e `isSubProperty` por fila.
// El `.md` los perdió: 22 filas de valores sin saber a qué propiedad pertenecen.
function tablasStructure() {
  const secs = (structure?.data ?? structure)?.sections ?? []
  if (!secs.length) return null
  const celda = t => String(t ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim()
  const marcar = r => {
    let s = celda(r.spec)
    if (r.isSubProperty) s = (r.isLastInGroup ? "└ " : "├ ") + s
    if (r.provenance === "inferred") s += " [inferred]"
    else if (r.provenance === "not-measured") s += " [unmeasured]"
    return s
  }
  const out = []
  for (const s of secs) {
    out.push(`### ${s.sectionName}`, "")
    if (s.sectionDescription) out.push(celda(s.sectionDescription), "")
    const cols = s.columns ?? []
    out.push("| " + cols.join(" | ") + " |", "|" + "---|".repeat(cols.length))
    for (const r of s.rows ?? []) {
      const vals = (r.values ?? []).map(celda)
      out.push("| " + [marcar(r), ...vals, celda(r.notes) || "—"].join(" | ") + " |")
    }
    out.push("")
  }
  return out.join("\n").trimEnd() + "\n"
}

const bloqueStructure = md.match(/^## Structure$[\s\S]*?(?=^## (?!Structure)|\Z)/m)?.[0]
if (bloqueStructure && structure) {
  const filas = bloqueStructure.split("\n").filter(l => /^\|/.test(l) && !/^\|[\s|:-]+$/.test(l))
  const sinNombre = filas.filter(l => {
    const primera = l.replace(/^\|/, "").split("|")[0].trim()
    return ["—", "-", "–", ""].includes(primera)
  }).length
  if (sinNombre > 1) {
    hallazgos.push(`**${sinNombre} filas de Structure sin nombre de propiedad** — la columna \`Spec\` se vació al renderizar`)
    if (escribir) {
      const nuevas = tablasStructure()
      const corte = bloqueStructure.indexOf("### ")
      if (nuevas && corte > 0) {
        md = md.replace(bloqueStructure, bloqueStructure.slice(0, corte) + nuevas + "\n")
        reparados.push(`${sinNombre} filas de Structure recuperadas del cache`)
      }
    }
  }
}


// ── 4 · El carry voice-render-meta ──────────────────────────────────────────
//
// 🔴 Sin este bloque, `create-voice` hace fail-fast en su Step 0: el carry es su
// ÚNICA fuente para saber qué capa de Figma rodear con la anotación. Nunca se
// emitía, así que la skill no podía correr sobre ningún componente.
//
// ⚠️ Y hay una trampa que este bloque señala pero no puede resolver sola: dentro
// del Button hay DOS nodos llamados `Button` —la raíz y el TEXT del label—, y
// `findStopNode` busca solo entre descendientes, así que marca el texto. Cuando
// el `layerName` coincide con el nombre del componente, se emite `preferRoot`
// para que el render elija la raíz. **La skill tiene que honrarlo**; hasta
// entonces el aviso queda a la vista de quien la ejecute.

const TIENE_VOICE_META = /<!-- voice-render-meta v=1/.test(md)
const rutaVoice = join(cacheDir, `${slug}-voice.json`)

if (/^## Voice \/ Screen reader$/m.test(md) && existsSync(rutaVoice)) {
  if (!TIENE_VOICE_META) {
    hallazgos.push("falta el carry `voice-render-meta`: `create-voice` no puede correr sin él")
    try {
      const voz = JSON.parse(readFileSync(rutaVoice, "utf8"))?.data ?? {}
      const nombreComponente = voz.componentName ?? ""
      const vistos = new Map()

      for (const estado of voz.states ?? []) {
        for (const seccion of estado.sections ?? []) {
          for (const t of seccion.tables ?? []) {
            if (!t?.name || vistos.has(t.name)) continue
            const layerName = t.layerName ?? null
            const stop = {
              name: t.name,
              focusOrderIndex: t.focusOrderIndex ?? null,
              layerName,
              slotIndex: t.slotIndex ?? null,
            }
            // La ambigüedad que rompe el artwork, marcada en el propio dato.
            if (layerName && layerName === nombreComponente) stop.preferRoot = true
            vistos.set(t.name, stop)
          }
        }
      }

      const focusStops = [...vistos.values()]
        .sort((a, b) => (a.focusOrderIndex ?? 99) - (b.focusOrderIndex ?? 99))

      if (focusStops.length) {
        const carry = `\n<!-- voice-render-meta v=1 ${JSON.stringify({ focusStops })} -->\n`
        const iniVoz = md.indexOf("## Voice / Screen reader")
        const sig = md.indexOf("\n## ", iniVoz + 1)
        const corte = sig === -1 ? md.length : sig
        md = md.slice(0, corte) + carry + md.slice(corte)
        const ambiguos = focusStops.filter(f => f.preferRoot).length
        reparados.push(`carry \`voice-render-meta\` emitido · ${focusStops.length} focus stops` +
          (ambiguos ? ` · ${ambiguos} con nombre ambiguo, marcados \`preferRoot\`` : ""))
      } else {
        hallazgos.push("el cache de voice no trae focus stops: no se pudo emitir el carry")
      }
    } catch (e) {
      hallazgos.push(`no pude leer el cache de voice: ${e.message}`)
    }
  }
}


// ── 5 · Los slots que Figma no puede llenar ─────────────────────────────────
//
// 🔴 La premisa de la tarea 4.15: estos cinco slots existen justamente porque
// su contenido NO es extraíble. El techo de los cuatro extractores es el techo
// de Figma, y esto es lo que Figma no contiene.
//
// ⚠️ Por eso el default NO puede ser el silencio. `validateMarkdown` acepta la
// sintaxis y no dice nada de si la página se ve bien: un slot vacío se publica
// tan campante. El marcador de abajo es visible en la página Y hace que este
// script salga con código 1, que es lo que impide publicar sin darse cuenta.

const SIN_DOCUMENTAR =
  "> 🔴 **Sin documentar.** Figma no contiene esta información y todavía nadie la ha escrito.\n" +
  "> No implementes este componente sin resolverla — no es una omisión benigna."

// El área táctil es la ÚNICA excepción: sí se mide desde Figma, y el tablero la
// pide como fila obligatoria. Acabó siendo nota al pie en `Known gaps` solo
// porque no había casilla donde ponerla. Ahora la hay, y se genera.
const UMBRAL_TACTIL = 44

function filaAreaTactil() {
  const secs = (structure?.data ?? structure)?.sections ?? []
  const sec = secs.find(s => (s.rows ?? []).some(r => /^minHeight$/i.test(r.spec ?? "")))
  if (!sec) return null
  const cols = (sec.columns ?? []).slice(1, -1)          // fuera `Spec` y `Notes`
  const fila = s => (sec.rows ?? []).find(r => new RegExp(`^${s}$`, "i").test(r.spec ?? ""))
  const alto = fila("minHeight"), ancho = fila("minWidth")
  if (!alto) return null
  const num = v => { const m = String(v).match(/\((\d+(?:\.\d+)?)\)|^(\d+(?:\.\d+)?)$/); return m ? Number(m[1] ?? m[2]) : null }
  const filas = cols.map((c, i) => {
    const h = num(alto.values?.[i]), w = ancho ? num(ancho.values?.[i]) : null
    const menor = [h, w].filter(x => x != null).reduce((a, b) => Math.min(a, b), Infinity)
    const ok = menor !== Infinity && menor >= UMBRAL_TACTIL
    return { col: c, h, w, ok }
  })
  return { cols, filas }
}

function cuerpoDeSeccion(titulo) {
  const esc = titulo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  // ⚠️ `$` con la bandera `m` casa el final de CUALQUIER línea, así que el
  // cuantificador perezoso paraba en la primera. El fin de cadena se afirma
  // con `(?![\\s\\S])`, que no depende de la bandera.
  return md.match(new RegExp(`^${esc}$([\\s\\S]*?)(?=\\n## |(?![\\s\\S]))`, "m"))?.[1] ?? ""
}

const SIN_DOCUMENTAR_RESTO =
  "> 🔴 **Sin documentar.** Lo de arriba es lo único que Figma puede aportar aquí; el resto —qué hace el\n" +
  "> componente al pulsarlo, al enfocarlo, al bloquearse— todavía no lo ha escrito nadie.\n" +
  "> No implementes sin resolverlo: no es una omisión benigna."

// 🔴 La frontera con `create-motion`, que hay que dejar escrita donde se lee.
// `create-motion` renderiza una spec detallada DENTRO DE FIGMA desde un export de
// After Effects. No lee ni escribe el `.md`, y su declaración de alcance lo dice.
// Esta sección es la otra mitad: la INTENCIÓN de movimiento que un ingeniero
// implementa — qué anima, cuánto dura, con qué easing, y qué pasa bajo
// `prefers-reduced-motion`. Ninguna de las dos genera a la otra.
const NOTA_MOTION =
  "_Motion **intent**, for the engineer to implement: what animates, how long, which easing, and what\n" +
  "happens under `prefers-reduced-motion`. The `create-motion` skill is a different artifact — it renders\n" +
  "a detailed timeline spec **into Figma** from an After Effects export, and neither one generates the other.\n" +
  "When an AE spec exists for this component, link it here._"

function cuerpoBehavior() {
  const t = filaAreaTactil()
  const out = []
  if (t) {
    out.push(
      "### Touch target",
      "",
      `Generated from the Structure cache. Threshold: **${UMBRAL_TACTIL} px** — Later's own declared standard (WCAG 2.5.5 AAA), not the 2.5.8 AA minimum.`,
      "",
      "| Size | min-height | min-width | ≥ 44 px |",
      "| --- | --- | --- | --- |",
      ...t.filas.map(f =>
        `| \`${f.col}\` | ${f.h ?? "—"} | ${f.w ?? "—"} | ${f.ok ? "✅ pass" : "🔴 **fail**"} |`),
      "",
      "<!-- GENERATED by completar-md.mjs from the structure cache. Do not hand-edit: re-extract and re-run. -->",
      "",
    )
  } else {
    out.push("<!-- Touch-target row could not be generated: no `minHeight` row in the structure cache. -->", "")
  }
  out.push(SIN_DOCUMENTAR_RESTO)
  return out.join("\n")
}

// Los cuatro slots humanos, en el orden en que se insertan.
// 🔴 `## Motion` NO va donde lo dejó la inserción previa (entre `Token
// resolution` y `Voice`). Va aquí, pegado a `Behavior & interaction`:
// el movimiento es comportamiento, no apariencia. Ver DECISIONS.md, 31 ago.
const SLOTS = [
  { titulo: "## Behavior & interaction", cuerpo: cuerpoBehavior,
    anclas: ["## Responsive rules", "## Content & data assumptions", "## Known gaps"] },
  { titulo: "## Motion", cuerpo: () => NOTA_MOTION + "\n\n" + SIN_DOCUMENTAR,
    anclas: ["## Responsive rules", "## Content & data assumptions", "## Known gaps"] },
  { titulo: "## Responsive rules", cuerpo: () => SIN_DOCUMENTAR,
    anclas: ["## Content & data assumptions", "## Known gaps"] },
  { titulo: "## Content & data assumptions", cuerpo: () => SIN_DOCUMENTAR,
    anclas: ["## Known gaps"] },
]

function insertar(titulo, cuerpo, anclas, sufijo = "") {
  const ancla = anclas.find(a => new RegExp(`^${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m").test(md))
  const bloque = `${titulo}\n\n${cuerpo}\n\n${sufijo}`
  if (!ancla) { md = md.trimEnd() + "\n\n" + bloque; return "final del archivo" }
  md = md.replace(new RegExp(`^${ancla.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"), bloque + ancla)
  return `antes de \`${ancla}\``
}

const sinDocumentar = []
for (const s of SLOTS) {
  const existe = new RegExp(`^${s.titulo}$`, "m").test(md)
  if (!existe) {
    hallazgos.push(`**falta la sección \`${s.titulo}\`** — es uno de los cinco slots que Figma no puede llenar`)
    if (escribir) reparados.push(`\`${s.titulo}\` insertada ${insertar(s.titulo, s.cuerpo(), s.anclas)}`)
  }
  // Documentada o no, se revisa el contenido: insertarla no es documentarla.
  const cuerpoActual = cuerpoDeSeccion(s.titulo)
  if (/Sin documentar/.test(cuerpoActual) || !cuerpoActual.trim()) sinDocumentar.push(s.titulo)
}
if (sinDocumentar.length) {
  hallazgos.push(
    `**${sinDocumentar.length} de ${SLOTS.length} slots sin documentar** (${sinDocumentar.join(", ")}) — ` +
    `visibles en la página y bloqueando la publicación. Los llena una persona; no salen de Figma.`)
}

// ── 6 · El bloque de resolución de tokens ───────────────────────────────────
//
// Convierte el `.md` de especificación visual en contrato construible: por cada
// token, su hex en CADA modo. Hasta hoy el `.md` resolvía UN solo hex, el del
// modo con que se extrajo, y un desarrollador no podía construir el modo oscuro.
//
// 🟢 Es render, no criterio: el cache trae las cuatro variantes de modo
// (`primary|secondary / Light|Dark`) con su `elementHexesByState`. Nada se
// deduce ni se consulta por red.

// 🔴 La columna `Code` y por qué dice lo que dice.
// `13-convencion-naming.md` (repo del área) es explícito: la traducción a código
// la hace un exporter, POR REGLA y no token por token. Ese exporter es la tarea
// 7.3 y NUNCA HA CORRIDO. Su salvedad vigente: "lo que salga a código será el
// nombre crudo".
// Emitir `--background-brand-main` / `backgroundBrandMain` / `BackgroundBrandMain`
// inventaría un contrato de tres plataformas que nadie ha configurado, y lo
// replicaría en los 40 componentes que vienen. Así que la columna emite el
// nombre crudo —que es literalmente lo que llega a código hoy— y el encabezado
// declara que no hay exporter. El día que 7.3 corra, se cambia esta constante
// y se regeneran los `.md`.
const ENCABEZADO_CODE = "Code (raw — no exporter configured, see 7.3)"
const nombreEnCodigo = token => `\`${token}\``

function construirTokenResolution() {
  const rutaColor = join(cacheDir, `${slug}-color.json`)
  if (!existsSync(rutaColor)) return null
  const color = JSON.parse(readFileSync(rutaColor, "utf8"))?.data ?? {}
  const det = color._extractionArtifacts?.modeDetection
  const variantes = color.variants ?? []
  if (!variantes.length) return null

  // modeId → nombre del modo. Sin `modeIds` no hay forma honesta de saber qué
  // columna es cuál: se degrada a una sola columna en vez de adivinar.
  const porModeId = new Map(Object.entries(det?.modeIds ?? {}).map(([n, id]) => [id, n]))
  const modos = det?.modes?.length ? det.modes : ["Value"]

  const hexes = new Map()   // token → { modo → Set(hex) }
  const usos  = new Map()   // token → Set("Element · state")
  for (const v of variantes) {
    const modo = porModeId.get(v.modeId) ?? modos[0]
    for (const t of v.tables ?? []) {
      const els = t.elements ?? [], hx = t.elementHexesByState ?? []
      els.forEach((el, i) => {
        for (const [estado, token] of Object.entries(el.tokensByState ?? {})) {
          if (!token || token === "none") continue
          const hex = hx[i]?.hexByState?.[estado] ?? null
          if (!hexes.has(token)) hexes.set(token, new Map())
          if (!hexes.get(token).has(modo)) hexes.get(token).set(modo, new Set())
          if (hex) hexes.get(token).get(modo).add(String(hex).toUpperCase())
          if (!usos.has(token)) usos.set(token, new Set())
          usos.get(token).add(`${el.element} · ${estado}`)
        }
      })
    }
  }

  // `uniqueTokens` manda el orden y la completitud: si un token está declarado
  // ahí y no apareció en ninguna tabla, la fila se emite igual, marcada.
  const declarados = color._extractionArtifacts?.uniqueTokens ?? []
  const todos = [...new Set([...declarados, ...hexes.keys()])].sort()

  const conflictos = []
  const filas = todos.map(tk => {
    const porModo = hexes.get(tk) ?? new Map()
    const celdas = modos.map(m => {
      const set = porModo.get(m)
      if (!set || !set.size) return "—"
      const vals = [...set]
      if (vals.length > 1) conflictos.push(`\`${tk}\` resuelve a ${vals.length} hex distintos en ${m}: ${vals.join(", ")}`)
      return vals.map(h => `\`${h}\``).join(" / ")
    })
    return `| \`${tk}\` | ${celdas.join(" | ")} | ${nombreEnCodigo(tk)} |`
  })

  const sinResolver = todos.filter(tk => {
    const pm = hexes.get(tk) ?? new Map()
    return modos.some(m => !pm.get(m)?.size)
  })

  const cuerpo = [
    "Every token named anywhere above, resolved to the value an engineer types — **per mode**.",
    "Until this block existed the `.md` carried a single hex, the one belonging to whichever mode the",
    "component happened to be extracted in, so the other mode was not implementable from this file.",
    "",
    `| Token | ${modos.join(" | ")} | ${ENCABEZADO_CODE} |`,
    `| --- |${modos.map(() => " --- |").join("")} --- |`,
    ...filas,
    "",
    `**The \`Code\` column carries the raw token path on purpose.** Later's naming convention states that the`,
    `translation to code is done by an exporter, *by rule and not token by token* — and that exporter is not`,
    `configured yet (task 7.3, never run). Its standing caveat: "what reaches code will be the raw name."`,
    `Emitting \`--background-brand-main\` / \`backgroundBrandMain\` / \`BackgroundBrandMain\` here would invent a`,
    `three-platform contract nobody has configured and replicate it across every component. When 7.3 lands,`,
    `this column becomes the exporter's output and every \`.md\` is regenerated.`,
    "",
    "<!-- GENERATED by completar-md.mjs from the extract-color cache. Do not hand-edit: re-extract and re-run. -->",
  ].join("\n")

  return { cuerpo, n: todos.length, modos, conflictos, sinResolver }
}

const TIENE_TOKEN_RES = /^## Token resolution$/m.test(md)
if (!TIENE_TOKEN_RES) {
  hallazgos.push("**falta la sección `## Token resolution`** — sin ella el `.md` describe cómo se ve el componente pero no permite resolver un solo token a un valor")
}
if (escribir && !TIENE_TOKEN_RES) {
  const tr = construirTokenResolution()
  if (!tr) {
    hallazgos.push("no se pudo construir `## Token resolution`: el cache de color no trae variantes de modo")
  } else {
    insertar("## Token resolution", tr.cuerpo, ["## Voice / Screen reader", "## Acceptance criteria", "## Cross-references"])
    reparados.push(`\`## Token resolution\` generada · ${tr.n} tokens × ${tr.modos.length} modos (${tr.modos.join(", ")})`)
    for (const c of tr.conflictos) hallazgos.push(`conflicto en \`## Token resolution\`: ${c}`)
    if (tr.sinResolver.length)
      hallazgos.push(`${tr.sinResolver.length} token(s) sin hex en algún modo: ${tr.sinResolver.slice(0, 5).join(", ")}${tr.sinResolver.length > 5 ? "…" : ""}`)
  }
}

// ── 7 · La batería base de criterios de aceptación ──────────────────────────
//
// Las afirmaciones idénticas en CUALQUIER componente del sistema. Se emiten
// solas para que nadie tenga que acordarse de ellas, que es justo lo que el
// FODA del equipo dice que no ocurre ("falta de consciencia para documentación
// de resultados"). Una regla que exige criterio para ejecutarse no se ejecuta.
//
// Cada línea la puede verificar alguien que no construyó el componente.
// "Se ve bien" no es criterio; "el foco mide >= 3:1" sí.

const AC_BASE = [
  ["A11y", "The focus indicator measures **≥ 3:1** against the adjacent surface, and is never conveyed by colour alone (WCAG 1.4.11, 1.4.1)."],
  ["A11y", "**Enter and Space** both activate the component when it is focused, and produce the same result as a pointer activation."],
  ["A11y", "A `disabled` instance is **removed from the tab order** and is not reachable by keyboard."],
  ["A11y", "Every interactive target measures **≥ 44 px** on both axes — see the Touch target table under `## Behavior & interaction`."],
  ["Tokens", "Every colour and dimension resolves through a token. **Zero raw values** — no literal hex, no literal px, in any state or mode."],
  ["Tokens", "Every token resolves to the value listed in `## Token resolution` **in each mode**, and switching mode changes nothing else."],
  ["Motion", "`prefers-reduced-motion: reduce` is honoured: motion is removed or reduced to a non-vestibular equivalent, and no information is lost when it is."],
  ["States", "Every state documented in `## API` is reachable and visually distinct from every other, in both modes."],
]

function construirAC() {
  return [
    "The baseline battery below is **identical for every component in the system** and is emitted automatically.",
    "Component-specific criteria are authored underneath it — this block is not complete until they exist.",
    "",
    "| # | Area | Criterion |",
    "| --- | --- | --- |",
    ...AC_BASE.map(([area, texto], i) => `| B${i + 1} | ${area} | ${texto} |`),
    "",
    `<!-- ac-baseline v=1 n=${AC_BASE.length} -->`,
    "<!-- GENERATED by completar-md.mjs. The B-rows are the shared baseline; do not hand-edit them here —",
    "     change AC_BASE in completar-md.mjs so every component in the system changes with it. -->",
    "",
    "### Component-specific",
    "",
    SIN_DOCUMENTAR,
  ].join("\n")
}

const TIENE_AC = /^## Acceptance criteria$/m.test(md)
if (!TIENE_AC) {
  hallazgos.push("**falta la sección `## Acceptance criteria`** — el `.md` no declara qué debe cumplir el componente, solo cómo se ve")
}
if (escribir && !TIENE_AC) {
  insertar("## Acceptance criteria", construirAC(), ["## Cross-references", "## Provenance"], "---\n\n")
  reparados.push(`\`## Acceptance criteria\` generada · ${AC_BASE.length} criterios base + slot específico`)
} else if (TIENE_AC) {
  // La batería se identifica por su marca, no comparando prosa: así un reformateo
  // no la da por perdida, y un cambio de AC_BASE sí se detecta en todo el catálogo.
  const marca = cuerpoDeSeccion("## Acceptance criteria").match(/<!-- ac-baseline v=1 n=(\d+) -->/)
  if (!marca) {
    hallazgos.push("`## Acceptance criteria` existe pero **no lleva la batería base** — falta la marca `ac-baseline`")
  } else if (Number(marca[1]) !== AC_BASE.length) {
    hallazgos.push(`\`## Acceptance criteria\` trae ${marca[1]} criterios base y la batería vigente tiene ${AC_BASE.length} — regenera`)
  }
}

// ── Informe ────────────────────────────────────────────────────────────────
console.log(`\n${basename(ruta)}  ${c("tenue", `· cache: ${cacheDir}`)}\n`)

if (!hallazgos.length) {
  console.log(`  ${c("ok", "✓")} El .md está completo. Nada que reparar.\n`)
  process.exit(0)
}

for (const h of hallazgos) console.log(`  ${c("mal", "🔴")} ${h}`)

if (!escribir) {
  console.log(`\n  ${c("tenue", "Repara con:")} node completar-md.mjs ${ruta} --escribir`)
  console.log(`  ${c("tenue", "El cache es la fuente: el .md pierde información al escribirse, no al revés.")}\n`)
  process.exit(1)
}

writeFileSync(ruta, md)
console.log("")
for (const r of reparados) console.log(`  ${c("ok", "✓")} ${r}`)
console.log(`\n  ${c("ok", "Reparado.")} ${c("tenue", "Vuelve a correr sin --escribir para confirmar.")}\n`)
