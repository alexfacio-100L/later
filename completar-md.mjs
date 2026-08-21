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
